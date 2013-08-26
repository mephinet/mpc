/*global enyo, $L */
enyo.kind({
    name: "MPC.StatusHeader",
    kind: enyo.PageHeader,
    className: "enyo-header mpc-status-header",

    published: {
        progress: 0,
        searchEnabled: true
    },

    events: {
        onSearch: "",
        onReconnect: ""
    },

    components: [
        {kind: enyo.VFlexBox, flex: 1, components: [
            {kind: enyo.HFlexBox, components: [
                {name: "currentStatus", className: "status"},
                {kind: enyo.Spacer, name: "statusSpacer"},

                {kind: enyo.Button, name: "reconnectButton", label: $L("Reconnect"), showing: false,
                 onclick: "doReconnect"},

                {name: "searchButton", kind: "IconButton",
                 icon: "images/btn_search.png", onclick: "showSearchInput"},

                {kind: "MPC.SearchInput", onSearch: "doSearch", onClose: "hideSearchInput", showing: false}
            ]},
            {name: "currentStatusSong", className: "statusSong"},
            {name: "progress", className: "progress", kind: enyo.ProgressBar}
        ]}
    ],

    searchInputOpen: false,
    error: false,

    rendered: function () {
        this.inherited(arguments);
        this.updateSearchUI();
    },

    setStatus: function (a, s) {
        this.setStatusError(a, s, 0);
    },

    setError: function (type, desc) {
        this.setStatusError(type, desc, 1);
    },

    setStatusError: function (a, s, error) {
        this.$.currentStatus.setContent(a);
        this.$.currentStatusSong.setContent(s);
        this.error = error;
        this.addRemoveClass("error", error);
        this.updateSearchUI();
    },

    progressChanged: function () {
        this.$.progress.setPosition(this.progress);
    },

    clearProgress: function () {
        this.$.progress.setPositionImmediate(0);
    },

    showSearchInput: function () {
        this.searchInputOpen = true;
        this.$.searchInput.clear();
        this.updateSearchUI();
    },

    hideSearchInput: function () {
        this.searchInputOpen = false;
        this.doSearch();
        this.updateSearchUI();
    },

    searchEnabledChanged: function () {
        this.updateSearchUI();
    },

    updateSearchUI: function () {
        var showButton = (!this.error) && this.searchEnabled && !this.searchInputOpen;
        var showInput = (!this.error) && this.searchEnabled && this.searchInputOpen;
        this.$.searchButton.setShowing(showButton);
        this.$.searchInput.setShowing(showInput);
        this.$.currentStatus.addRemoveClass('hide-on-phones', showInput);
        this.$.currentStatusSong.addRemoveClass('hide-on-phones', showInput);
        this.$.reconnectButton.setShowing(this.error);
        this.$.progress.setShowing(!this.error);
        if (showInput) this.$.searchInput.forceFocus();

    }
});
