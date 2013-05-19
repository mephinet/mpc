/*jslint plusplus: false */
/*global enyo, $L */
enyo.kind({
    name: "MPC.Queue",
    kind: "MPC.VirtualList",

    published: {
        currentSongId: -1,
        prioSupport: false,
    },

    events: {
        onPlay: "",
        onPlayNext: "",
    },

    songIdMap: null,
    primaryButtonCaption: $L("Play"),
    extraButtonCaption: $L("Play next"),

    setupRow: function (sender, index) {
        if (this.inherited(arguments)) {
            this.$.item.addRemoveClass("playing", this.filteredData[index].songid === this.currentSongId);
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
        enyo.map(this.data, function (d) {
            d.querystring = (d.artist ? d.artist.toLowerCase() : "") + (d.title ? d.title.toLowerCase() : "") + (d.filename ? d.filename.toLowerCase() : "");
        });

        this.inherited(arguments);

        this.songIdMap = {};
        for (var i = 0; i < this.filteredData.length; i++) {
            this.songIdMap[this.filteredData[i].songid] = i;
        }
    },

    matches: function (data) {
        return (data.querystring.indexOf(this.query) >= 0);
    },

    primaryButtonClicked: function (sender, event) {
        this.doPlay(this.filteredData[this.currentlySelected].songid);
    },

    extraButtonClicked: function (sender, event) {
        this.doPlayNext(this.filteredData[this.currentlySelected].songid);
        this.$.extraButton.setDisabled(true);
    },

    currentSongIdChanged: function (oldSongId) {
        if (this.songIdMap && oldSongId !== this.currentSongIdChanged) {
            this.$.list.updateRow(this.songIdMap[oldSongId]);
            this.$.list.updateRow(this.songIdMap[this.currentSongId]);
        }
    },

    prioSupportChanged: function () {
        this.extraButtonEnabled = this.prioSupport;
    }

});
