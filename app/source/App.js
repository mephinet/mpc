/*global enyo, $L, close */
/*jslint onevar: false */

enyo.kind({
    name: "MPC.App",
    kind: enyo.VFlexBox,
    components: [
        {kind: enyo.Pane, flex: 1, components: [
            {kind: "MPC.MainView",
             onPlay: "play", onPause: "pause", onStop: "stop", onNext: "next",
             onRandomChanged: "randomChanged", onRepeatChanged: "repeatChanged",
             onReconnect: "reconnect", onLoadPlaylist: "loadPlaylist",
             onPlayById: "playById", onSetVolumeByApp: "setVolumeByApp",
             onNewSong: "newSong", onSleepChanged: "reduceQueue",
             onPlayNext: "playNext"
            },
            {kind: "MPC.Prefs", onLoaded: "prefsLoaded", onSave: "prefsSaved"}
        ]},
        {kind: "MPC.Plugin",
         onPluginReady: "pluginReady", onPluginDisconnected: "pluginDied",
         onUpdateStatus: "updateStatus", onUpdateQueue: "updateQueue",
         onUpdatePlaylists: "updatePlaylists",
         onError: "updateStatusWithError"
        },
        {name: "errorDialog", kind: enyo.ModalDialog, caption: $L("Error"), components: [
            {name: "errorMessage"},
            {kind: enyo.Button, caption: "D'oh!", onclick: "errorButtonClicked"}
        ]},
        {kind: enyo.AppMenu, components: [
            {caption: $L("Preferences"), onclick: "showPrefs"},
            {caption: $L("About..."), onclick: "showAbout"}
        ]},
        {kind: "MPC.About"},
        {kind: enyo.ApplicationEvents, onWindowDeactivated: "deactivated", onWindowActivated: "activated"}
    ],

    status: null,
    window_activated: 1,

    pluginReady: function () {
        this.log("plugin is ready!");
        this.$.prefs.loadPrefs();
    },

    showPrefs: function () {
        this.$.pane.selectView(this.$.prefs);
    },

    reconnect: function (sender) {
        var host = this.$.prefs.getHost();
        var port = this.$.prefs.getPort();
        this.log("connect data loaded: " + host + ":" + port);
        enyo.scrim.show();
        this.$.plugin.connect(host, port);
        this.status = null;
    },

    prefsLoaded: function (sender) {
        var host = this.$.prefs.getHost();
        var port = this.$.prefs.getPort();
        if (host && port) {
            this.reconnect();
        } else {
            this.showPrefs();
        }
    },

    prefsSaved: function (sender) {
        this.$.pane.back();
        var host = this.$.prefs.getHost();
        var port = this.$.prefs.getPort();
        this.log("New connect data: " + host + ":" + port);
        enyo.scrim.show();
        this.$.plugin.connect(host, port);
    },

    play: function () {
        this.log();
        this.$.plugin.play();
    },

    pause: function () {
        this.log();
        this.$.plugin.pause();
    },

    playById: function (sender, songid) {
        this.log(songid);
        this.$.plugin.playById(songid);
    },

    playNext: function (sender, songid) {
        this.log(songid);
        this.$.plugin.playNext(songid);
    },

    loadPlaylist: function (sender, playlist) {
        this.log(playlist);
        enyo.scrim.show();
        this.$.plugin.loadPlaylist(playlist);
        this.status = null;
    },

    stop: function () {
        this.log();
        this.$.plugin.stop();
    },

    crop: function () {
        this.log();
        this.$.plugin.crop();
    },

    next: function () {
        this.log();
        this.$.plugin.next();
    },

    reduceQueue: function (sender, seconds) {
        this.log(seconds);
        var keep = [];
        var all  = [];
        enyo.map(this.$.mainView.getQueue(), function (s) {
            if ((!this.status) || (s.songid !== this.status.songid)) {
                all.push({songid: s.songid, duration: s.duration});
            }
        }, this);

        if (this.status && this.status.songid && this.status.total_time) {
            keep.push(this.status.songid);
            seconds -= this.status.total_time - this.status.elapsed_time;
        }

        while (seconds > 0 && all.length > 0) {
            var idx = Math.floor(Math.random() * all.length);
            var song = all.splice(idx, 1)[0];
            keep.push(song.songid);
            seconds -= song.duration;
        }
        this.$.plugin.reduceQueue(keep);
    },
    
    randomChanged: function (sender, value) {
        this.log(value);
        this.$.plugin.setRandom(value);
    },

    repeatChanged: function (sender, value) {
        this.log(value);
        this.$.plugin.setRepeat(value);
    },

    updateStatus: function (sender, status) {
        enyo.scrim.hide();
        this.status = status;
        this.$.mainView.updateStatus(status);
    },

    updateStatusWithError: function (sender, error) {
        enyo.scrim.hide();
        this.$.mainView.updateStatusWithError(error);
    },

    updateQueue: function (sender, queue) {
        this.log();
        this.$.mainView.setPrioSupport(queue.prio_support);
        this.$.mainView.setQueue(queue.songs);
    },

    updatePlaylists: function (sender, playlists) {
        this.log();
        this.$.mainView.setPlaylists(playlists);
    },

    setVolumeByApp: function (sender, volume) {
        this.$.plugin.setVolumeByApp(volume);
    },

    newSong: function (sender, title) {
        if (!this.window_activated) {
            enyo.windows.addBannerMessage(title, "{}");
        }
    },

    pluginDied: function () {
        this.$.errorDialog.validateComponents(); // make sure errorMessage exists
        this.$.errorMessage.setContent($L("I'm sorry, the MPC plugin died!"));
        this.$.errorDialog.open();
    },

    showAbout: function () {
        this.$.about.openAtCenter();
    },

    errorButtonClicked: function () {
        this.$.errorDialog.close();
        close();
    },

    activated: function () {
        this.window_activated = 1;
    },
    
    deactivated: function () {
        this.window_activated = 0;
    }
});
