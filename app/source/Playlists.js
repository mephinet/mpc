/*global enyo, $L */
enyo.kind({
    name: "MPC.Playlists",
    kind: "MPC.VirtualList",

    events: {
        onLoad: ""
    },

    primaryButtonCaption: $L("Load"),

    renderEntry: function (entry) {
        return entry.path;
    },

    primaryButtonClicked: function (sender, event) {
        this.doLoad(this.data[this.currentlySelected].path);
    }
});
