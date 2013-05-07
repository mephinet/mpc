/*jslint plusplus: false */
/*global enyo, $L, close */

enyo.kind({
    name: "MPC.MainView",
    kind: enyo.SlidingPane,

    events: {
        onPlay: "",
        onPause: "",
        onStop: "",
        onNext: "",
        onRandomChanged: "",
        onRepeatChanged: "",
        onReconnect: "",
        onLoadPlaylist: "",
        onPlayById: "",
        onSetVolumeByApp: "",
        onNewSong: "",
        onSleepChanged: ""
    },

    components: [
        {name: "left", width: '320px', components: [
            {kind: enyo.Group, defaultKind: enyo.Item, components: [
                {name: "queueButton", className: "enyo-item-selected", content: $L("Queue"), onclick: "showQueue"},
                {name: "playlistsButton", content: $L("Manage Playlists"), onclick: "showPlaylists"},
                {name: "sleepSettingsButton", content: $L("Sleep Settings"), onclick: "showSleepSettings"}
            ]},
            {kind: enyo.Spacer},
            {kind: enyo.Group, components: [
                {kind: enyo.Item, layoutKind: "HFlexLayout", components: [
                    {content: $L("Random"), flex: 1, className: "toggleButtonLabel"},
                    {kind: enyo.ToggleButton, name: "random", onChange: "doRandomChanged"}
                ]},
                {kind: enyo.Item, layoutKind: "HFlexLayout", components: [
                    {content: $L("Repeat"), flex: 1, className: "toggleButtonLabel"},
                    {kind: enyo.ToggleButton, name: "repeat", onChange: "doRepeatChanged"}
                ]}
            ]},
            {kind: enyo.Toolbar}
        ]},
        {name: "right", components: [
            {kind: "MPC.StatusHeader", onSearch: "search", onReconnect: "doReconnect"},
            {name: "mainPane", kind: enyo.Pane, flex: 1, onSelectView: "mainPaneSelected", components: [
                {kind: "MPC.Queue", onPlay: "doPlayById"},
                {kind: "MPC.Playlists", onLoad: "loadPlaylist"},
                {kind: "MPC.SleepSettings", onSleepChanged: "doSleepChanged"}
            ]},
            {kind: "MPC.Controls", onPlay: "doPlay", onPause: "doPause", onStop: "stop",
             onNext: "doNext", onVolumeChanged: "doSetVolumeByApp"}
        ]}
    ],

    lastSong: null,

    rendered: function () {
        this.inherited(arguments);

        if (!enyo.fetchDeviceInfo()) {
            // running in a browser - create dummy queue
            var p = [], i;
            for (i = 1; i < 1000; i++) {
                p.push({artist: "Artist " + i, title: "Title " + i, songid: i});
            }
            this.$.queue.setData(p);
            this.$.playlists.setData([{path: "foo"}, {path: "bar"}, {path: "baz"}]);
            this.$.statusHeader.setStatus("Current Artist - Current Song");
            this.$.statusHeader.setProgress(80);
        }
    },

    showQueue: function () {
        this.$.mainPane.selectViewByName("queue");
        this.$.statusHeader.showSearch(true);
    },

    showPlaylists: function () {
        this.$.mainPane.selectViewByName("playlists");
        this.$.statusHeader.showSearch(false);
    },

    showSleepSettings: function () {
        this.$.mainPane.selectViewByName("sleepSettings");
        this.$.statusHeader.showSearch(false);
    },

    mainPaneSelected: function (sender, newView, oldView) {
        this.$[oldView.getName() + "Button"].removeClass("enyo-item-selected");
        this.$[newView.getName() + "Button"].addClass("enyo-item-selected");
    },

    updateStatus: function (status) {
        this.$.queue.setCurrentSongId(status.songid);
        this.$.controls.setVolumeByRemote(status.volume);
        this.$.controls.setPlaying(status.state && (status.state === "play"));

        var s;
        if (status.artist && status.title) {
            s = status.artist + " - " + status.title;
        } else {
            s = status.filename;
        }
        this.$.statusHeader.setStatus(s);
        this.$.random.setState(!!status.random);
        this.$.repeat.setState(!!status.repeat);

        if (status.state && (status.state === "play") && (s !== this.lastSong)) {
            this.doNewSong(s);
            this.lastSong = s;
        }

        if (status.total_time && status.total_time > 0) {
            this.$.statusHeader.setProgress(status.elapsed_time / status.total_time * 100);
        } else {
            this.$.statusHeader.clearProgress();
        }
    },

    updateStatusWithError: function (error) {
        this.$.statusHeader.setError($L(error));
    },

    stop: function () {
        this.$.statusHeader.clearProgress();
        this.doStop();
    },

    loadPlaylist: function (sender, playlist) {
        this.doLoadPlaylist(playlist);
        this.showQueue();
    },

    search: function (sender, query) {
        this.$.queue.setQuery(query);
    },

    resetSleep: function () {
        this.$.sleepSettings.resetSleep();
    }

});
