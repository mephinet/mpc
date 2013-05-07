/*global enyo */
enyo.kind({
    kind: "enyo.Hybrid",
    name: "MPC.Plugin",

    events: {
        onUpdateStatus: "",
        onUpdateQueue: "",
        onUpdatePlaylists: "",
        onError: ""
    },

    executable: "mpc_plugin",
    params: [],
    width: 0,
    height: 0,
    cachePlugin: true,

    create: function () {
        this.inherited(arguments);
        this.addCallback("update_status", enyo.bind(this, "updateStatus"), true);
        this.addCallback("update_queue", enyo.bind(this, "updateQueue"), true);
        this.addCallback("update_playlists", enyo.bind(this, "updatePlaylists"), true);
        this.addCallback("plugin_error", enyo.bind(this, "pluginError"), true);
    },

    connect: function (host, port) {
        this.log("Connecting to " + host + ":" + port);
        this.callPluginMethod("connect", host, port);
    },

    play: function () {
        this.callPluginMethod("play");
    },

    pause: function () {
        this.callPluginMethod("pause");
    },

    playById: function (songid) {
        this.callPluginMethod("play_by_id", songid);
    },

    stop: function () {
        this.callPluginMethod("stop");
    },

    next: function () {
        this.callPluginMethod("next");
    },

    crop: function () {
        this.callPluginMethod("crop");
    },

    setVolumeByApp: function (value) {
        this.callPluginMethod("set_volume_by_app", value);
    },

    setRandom: function (value) {
        this.callPluginMethod("set_random", 0 + value);
    },

    setRepeat: function (value) {
        this.callPluginMethod("set_repeat", 0 + value);
    },

    loadPlaylist: function (playlist) {
        this.callPluginMethod("load_playlist", playlist);
    },

    updateStatus: function (json) {
        var value = enyo.json.parse(json);
        this.doUpdateStatus(value);
    },

    updateQueue: function (json) {
        var value = enyo.json.parse(json);
        this.doUpdateQueue(value);
    },

    updatePlaylists: function (json) {
        var value = enyo.json.parse(json);
        this.doUpdatePlaylists(value);
    },

    pluginError: function (s) {
        this.error(s);
        this.doError(s);
    }

});
