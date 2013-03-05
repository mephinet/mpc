/*global enyo, $L */
enyo.kind({
    name: "MPC.StatusHeader",
    kind: enyo.PageHeader,
    className: "enyo-header mpc-status-header",

    published: {
        status: "",
        error: false,
        progress: 0
    },

    events: {
        onReconnect: ""
    },

    components: [
        {kind: enyo.VFlexBox, flex: 1, components: [
            {kind: enyo.HFlexBox, components: [
                {name: "currentStatus", className: "status"},
                {kind: enyo.Spacer},
                {kind: enyo.Button, name: "reconnectButton", label: $L("Reconnect"),
                 onclick: "doReconnect", showing: false}
            ]},
            {name: "progress", className: "progress", kind: enyo.ProgressBar}
        ]}
    ],

    statusChanged: function () {
        this.$.currentStatus.setContent(this.status);
    },

    errorChanged: function () {
        this.addRemoveClass("error", this.error);
        this.$.reconnectButton.setShowing(this.error);
        this.$.progress.setShowing(!this.error);
    },

    progressChanged: function () {
        this.$.progress.setPosition(this.progress);
    },

    clearProgress: function () {
        this.$.progress.setPositionImmediate(0);
    }

});
