/*jslint plusplus: false */
/*global enyo, $L, close */

enyo.kind({
    name: "MPC.MainView",
    kind: enyo.SlidingPane,

    flex: 1,

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
        onNewSong: ""
    },

    components: [
        {name: "menu", width: '320px', components: [
            {kind: enyo.Group, defaultKind: enyo.Item, components: [
                {name: "queueButton", className: "enyo-item-selected", content: $L("Queue"), onclick: "showQueue"},
                {name: "playlistsButton", content: $L("Manage Playlists"), onclick: "showPlaylists"}
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
        {name: "main", components: [
            {kind: enyo.PageHeader, name: "statusHeader", components: [
                {kind: enyo.VFlexBox, flex: 1, components: [
                    {kind: enyo.HFlexBox, components: [
                        {name: "currentStatus", className: "status", content: ""},
                        {kind: enyo.Spacer},
                        {kind: enyo.Button, name: "reconnectButton", label: $L("Reconnect"),
                         onclick: "doReconnect", showing: false}
                    ]},
                    {name: "progress", className: "progress", kind: enyo.ProgressBar}
                ]}

            ]},
            {name: "mainPane", kind: enyo.Pane, flex: 1, onSelectView: "mainPaneSelected", components: [
                {kind: "MPC.Queue", flex: 1, onPlay: "doPlayById"},
                {kind: "MPC.Playlists", flex: 1, onLoad: "loadPlaylist"}
            ]},
            {kind: "MPC.Controls", onPlay: "doPlay", onPause: "doPause", onStop: "stop", onNext: "doNext",
             onVolumeChanged: "doSetVolumeByApp"}
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
            this.$.currentStatus.setContent("Current Artist - Current Song");
            this.$.progress.setPositionImmediate(80);
        }
    },

    showQueue: function () {
        this.$.mainPane.selectViewByName("queue");
    },

    showPlaylists: function () {
        this.$.mainPane.selectViewByName("playlists");
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
        this.$.statusHeader.removeClass("error");
        this.$.currentStatus.setContent(s);
        this.$.random.setState(!!status.random);
        this.$.repeat.setState(!!status.repeat);
        this.$.reconnectButton.hide();

        if (status.state && (status.state === "play") && (s !== this.lastSong)) {
            this.doNewSong(s);
            this.lastSong = s;
        }

        if (status.total_time && status.total_time > 0) {
            this.$.progress.setPosition(status.elapsed_time / status.total_time * 100);
        } else {
            this.$.progress.setPositionImmediate(0);
        }
    },

    updateStatusWithError: function (error) {
        this.$.statusHeader.addClass("error");
        this.$.currentStatus.setContent($L(error));
        this.$.reconnectButton.show();
    },

    stop: function () {
        this.$.progress.setPositionImmediate(0);
        this.doStop();
    },

    loadPlaylist: function (sender, playlist) {
        this.doLoadPlaylist(playlist);
        this.showQueue();
    }

});
