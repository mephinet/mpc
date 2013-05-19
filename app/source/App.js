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
             onNewSong: "newSong", onSleepChanged: "sleepChanged",
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
        {kind: "MPC.Alarm"},
        {kind: enyo.ApplicationEvents, onApplicationRelaunch: "appLoaded"}
    ],

    statusReceived: false,

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
        this.$.mainView.updateStatus(status);
        if (!this.statusReceived) {
            this.appLoaded();
            this.statusReceived = true;
        }
    },

    updateStatusWithError: function (sender, error) {
        enyo.scrim.hide();
        this.$.mainView.updateStatusWithError(error);
    },

    updateQueue: function (sender, queue) {
        this.log();
        this.$.mainView.$.queue.setPrioSupport(queue.prio_support);
        this.$.mainView.$.queue.setData(queue.songs);
    },

    updatePlaylists: function (sender, playlists) {
        this.log();
        this.$.mainView.$.playlists.setData(playlists);
    },

    setVolumeByApp: function (sender, volume) {
        this.$.plugin.setVolumeByApp(volume);
    },

    newSong: function (sender, title) {
        enyo.windows.addBannerMessage(title, "{}");
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

    sleepChanged: function (sender, minutes, crop) {
        if (minutes) {
            this.$.alarm.setAlarm(minutes, crop);
        } else {
            this.$.alarm.clearAlarm();
        }
    },

    appLoaded: function () {
        var params = enyo.windowParams;
        if (params.action === "alarmWakeup") {
            this.log("Received alarm!");
            if (params.crop) {
                this.$.plugin.setRepeat(false);
                this.$.plugin.crop();
            } else {
                this.stop();
            }
            this.$.mainView.resetSleep();
            return true;
        }
    }
});
