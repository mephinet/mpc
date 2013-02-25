/*jslint plusplus: false */
/*global enyo, $L */
enyo.kind({
    name: "MPC.Queue",
    kind: "MPC.VirtualList",

    published: {
        currentSongId: -1
    },

    events: {
        onPlay: ""
    },

    songIdMap: null,
    buttonCaption: $L("Play"),

    setupRow: function (sender, index) {
        if (this.inherited(arguments)) {
            this.$.item.addRemoveClass("playing", this.data[index].songid === this.currentSongId);
            return true;
        }
    },

    renderEntry: function (entry) {
        if (entry.artist || entry.title) {
            return entry.artist + " - " + entry.title;
        }
        return entry.filename;
    },

    dataChanged: function () {
        this.inherited(arguments);
        this.songIdMap = {};
        for (var i = 0; i < this.data.length; i++) {
            this.songIdMap[this.data[i].songid] = i;
        }
    },

    buttonClicked: function (sender, event) {
        this.doPlay(this.data[this.currentlySelected].songid);
    },

    currentSongIdChanged: function (oldSongId) {
        if (this.songIdMap && oldSongId !== this.currentSongIdChanged) {
            this.$.list.updateRow(this.songIdMap[oldSongId]);
            this.$.list.updateRow(this.songIdMap[this.currentSongId]);
        }
    }
});
