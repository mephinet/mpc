/*global enyo, $L */
enyo.kind({
    name: "MPC.StatusHeader",
    kind: enyo.PageHeader,
    className: "enyo-header mpc-status-header",

    published: {
        progress: 0
    },

    events: {
        onSearch: "",
        onReconnect: ""
    },

    components: [
        {kind: enyo.VFlexBox, flex: 1, components: [
            {kind: enyo.HFlexBox, components: [
                {name: "currentStatus", className: "status", style: "font-size: 1.0em; font-weight:bold"},
                {kind: enyo.Spacer, name: "statusSpacer"},
                {kind: enyo.Button, name: "reconnectButton", label: $L("Reconnect"),
                 onclick: "doReconnect", showing: false},

                {kind: "MPC.SearchInput", onSearch: "doSearch"}
            ]},
            {name: "currentStatusSong", className: "statusSong", style: "font-size: 0.9em"},
            {name: "progress", className: "progress", kind: enyo.ProgressBar}
        ]}
    ],

    setStatus: function (a, s) {
        this.setStatusError(a, s, 0);
    },
    
    setError: function (type, desc) {
        this.setStatusError(type, desc, 1);
    },

    setStatusError: function (a, s, error) {
        this.$.currentStatus.setContent(a);
        if (s) {
            this.$.currentStatusSong.setContent(s);
        }
        this.addRemoveClass("error", error);
        this.$.reconnectButton.setShowing(error);
        this.$.progress.setShowing(!error);
        if (error) {
            this.$.searchInput.hide();
        } else {
            this.$.searchInput.show();
        }
    },

    progressChanged: function () {
        this.$.progress.setPosition(this.progress);
    },

    clearProgress: function () {
        this.$.progress.setPositionImmediate(0);
    },

    showSearch: function (showing) {
        this.$.searchInput.setShowing(showing);
    }

});
