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
                {name: "currentStatus", className: "status"},
                {kind: enyo.Spacer},
                {kind: enyo.Button, name: "reconnectButton", label: $L("Reconnect"),
                 onclick: "doReconnect", showing: false},

		{name: "searchButton", kind: "IconButton", icon: "images/btn_search.png", onclick: "showSearchInput"},
                {kind: "MPC.SearchInput", showing: false, onSearch: "doSearch", onClose: "closeSearchInput"}
            ]},
            {name: "progress", className: "progress", kind: enyo.ProgressBar}
        ]}
    ],

    setStatus: function (s) {
        this.setStatusError(s, 0);
    },
    
    setError: function (s) {
        this.setStatusError(s, 1);
    },

    setStatusError: function (s, error) {
        this.$.currentStatus.setContent(s);
        this.addRemoveClass("error", error);
        this.$.reconnectButton.setShowing(error);
        this.$.progress.setShowing(!error);
        if (error) {
            this.$.searchInput.hide();
            this.$.searchButton.hide();
        }
    },

    progressChanged: function () {
        this.$.progress.setPosition(this.progress);
    },

    clearProgress: function () {
        this.$.progress.setPositionImmediate(0);
    },

    showSearch: function (show) {
        if (show) {
            this.$.searchInput.close();
            this.$.searchButton.show();
        } else {
            this.$.searchInput.hide();
            this.$.searchButton.hide();
        }
    },

    showSearchInput: function () {
        this.$.searchButton.hide();
        this.$.searchInput.show();
    },

    closeSearchInput: function () {
        this.$.searchInput.hide();
        this.$.searchButton.show();
    }

});
