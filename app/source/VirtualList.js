/*global enyo */
enyo.kind({
    name: "MPC.VirtualList",
    kind: enyo.Pane,

    published: {
        data: null,
        query: null
    },

    components: [
        {name: "list", kind: enyo.VirtualList, onSetupRow: "setupRow", components: [
            {kind: enyo.Item, layoutKind: "HFlexLayout",
             onclick: "itemTapped",
             tapHighlight: true,
             components: [
                 {name: "caption", flex: 1},
                 {name: "extraButton", kind: enyo.Button, onclick: "extraButtonClicked", toggling: true, showing: false},
                 {name: "primaryButton", kind: enyo.Button, onclick: "primaryButtonClicked", showing: false}
             ]}
        ]}
    ],

    currentlySelected: null,
    filteredData: null,
    primaryButtonCaption: null,
    extraButtonCaption: null,
    extraButtonEnabled: false,

    setupRow: function (sender, index) {
        var selected = (index === this.currentlySelected);
        if (this.filteredData && this.filteredData[index]) {
            var entry = this.filteredData[index];
            this.$.caption.setContent(this.renderEntry(entry));
            this.$.primaryButton.setCaption(this.primaryButtonCaption);
            this.$.primaryButton.setShowing(selected);
            this.$.extraButton.setCaption(this.extraButtonCaption);
            this.$.extraButton.setShowing(this.extraButtonEnabled && selected);
            return true;
        }
    },

    dataChanged: function () {
        this.updateFilteredData();
        this.$.list.refresh();
    },

    queryChanged: function () {
        this.currentlySelected = null;
        this.updateFilteredData();
        this.$.list.refresh();
    },

    updateFilteredData: function () {
        if (!this.query) {
            this.filteredData = this.data;
            return;
        }
        this.filteredData = [];
        enyo.map(this.data, function (d) {
            if (this.matches(d)) {
                this.filteredData.push(d);
            }
        }, this);
    },

    itemTapped: function (sender, event) {
        if (event.rowIndex === null) {
            this.error("itemTapped without rowIndex!");
            return;
        }

        var lastSelected = this.currentlySelected;
        this.currentlySelected = event.rowIndex;

        this.$.list.updateRow(this.currentlySelected);

        if (lastSelected !== null) {
            this.$.list.updateRow(lastSelected);
        }
    }

});
