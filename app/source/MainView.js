/*jslint plusplus: false */
/*global enyo, $L, close, window */

enyo.kind({
    name: "MPC.MainView",
    kind: enyo.SlidingPane,
    multiViewMinWidth: 320,

    published: {
        queue: null,
        playlists: [],
        prioSupport: null
    },

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
        onPlayNext: "",
        onSetVolumeByApp: "",
        onNewSong: "",
        onSleepChanged: ""
    },

    components: [
        {kind: enyo.ApplicationEvents, onBack: "goBack"},
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
                {kind: "MPC.Queue", onPlay: "doPlayById", onPlayNext: "doPlayNext"},
                {kind: "MPC.Playlists", onLoad: "loadPlaylist"},
                {kind: "MPC.SleepSettings", onSleepChanged: "sleepChanged"}
            ]},
            {kind: "MPC.Controls", onPlay: "doPlay", onPause: "doPause", onStop: "stop",
             onNext: "doNext", onVolumeChanged: "doSetVolumeByApp"}
        ]}
    ],

    lastSong: null,
    queueFirstTime: true,

    goBack: function (inSender, inEvent) {
        this.back(inEvent);
        inEvent.stopPropagation();
    },

    rendered: function () {
        this.inherited(arguments);

        if (window.innerWidth <= 640) {
            // block orientation on phones
            enyo.setAllowedOrientation("up");
            // also, remove the selection class on the Queue item, the
            // user won't see it on a phone at first start
            this.$.queueButton.setClassName("enyo-item");
        }

        if (!enyo.fetchDeviceInfo()) {
            // running in a browser - create dummy queue
            var p = [], i;
            for (i = 1; i < 1000; i++) {
                p.push({artist: "Artist " + i, title: "Title " + i, songid: i, duration: 90});
            }
            this.$.queue.setData(p);
            this.$.playlists.setData([{path: "foo"}, {path: "bar"}, {path: "baz"}]);
            this.$.statusHeader.setStatus("Current Artist", "Current Song");
            this.$.statusHeader.setProgress(80);
        }
    },

    showQueue: function () {
        if (this.queueFirstTime) {
            // hack to get the enyo item as selected the first time
            // we select it on phones
            this.$.queueButton.setClassName("enyo-item enyo-item-selected");
            this.queueFirstTime = false;
        }
        this.$.mainPane.selectViewByName("queue");
        this.$.statusHeader.setSearchEnabled(true);
    },

    showPlaylists: function () {
        this.$.mainPane.selectViewByName("playlists");
        this.$.statusHeader.setSearchEnabled(false);
    },

    showSleepSettings: function () {
        this.$.mainPane.selectViewByName("sleepSettings");
        this.$.statusHeader.setSearchEnabled(false);
    },

    mainPaneSelected: function (sender, newView, oldView) {
        if (window.innerWidth <= 640) {
            // ensure we slide the right view on phones
            this.selectViewByName("right");
        }
        if (oldView) {
            this.$[oldView.getName() + "Button"].removeClass("enyo-item-selected");
        }
        this.$[newView.getName() + "Button"].addClass("enyo-item-selected");
    },

    updateStatus: function (status) {
        this.$.queue.setCurrentSongId(status.songid);
        this.$.controls.setVolumeByRemote(status.volume);
        this.$.controls.setPlaying(status.state && (status.state === "play"));

        var a, s;
        if (status.artist && status.title) {
            a = status.artist;
            s = status.title;
        } else {
            s = status.filename;
        }
        this.$.statusHeader.setStatus(a, s);
        this.$.random.setState(!!status.random);
        this.$.repeat.setState(!!status.repeat);

        if (status.state && (status.state === "play") && (s !== this.lastSong)) {
            this.doNewSong(a + " - " + s);
            this.lastSong = s;
        }

        if (status.total_time && status.total_time > 0) {
            this.$.statusHeader.setProgress(status.elapsed_time / status.total_time * 100);
        } else {
            this.$.statusHeader.clearProgress();
        }
    },

    updateStatusWithError: function (error) {
        error = $L(error).split(":");
        this.$.statusHeader.setError(error[0], error[1]);
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

    queueChanged: function () {
        this.$.queue.setData(this.queue);
    },

    prioSupportChanged: function () {
        this.$.queue.setPrioSupport(this.prioSupport);
    },

    playlistsChanged: function () {
        this.$.playlists.setData(this.playlists);
    },

    sleepChanged: function (sender, seconds) {
        this.doSleepChanged(seconds);
        this.showQueue();
        this.doRepeatChanged(false);
    }

});
