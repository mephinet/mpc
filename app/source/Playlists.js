/*global enyo, $L */
enyo.kind({
    name: "MPC.Playlists",
    kind: "MPC.VirtualList",

    events: {
        onLoad: ""
    },

    buttonCaption: $L("Load"),

    renderEntry: function (entry) {
        return entry.path;
    },

    buttonClicked: function (sender, event) {
        this.doLoad(this.data[this.currentlySelected].path);
    }
});
