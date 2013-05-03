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
                 {kind: enyo.Button, onclick: "buttonClicked", showing: false}
             ]}
        ]}
    ],

    currentlySelected: null,
    filteredData: null,

    setupRow: function (sender, index) {
        if (this.filteredData && this.filteredData[index]) {
            var entry = this.filteredData[index];
            this.$.caption.setContent(this.renderEntry(entry));
            this.$.button.setCaption(this.buttonCaption);
            this.$.button.setShowing(index === this.currentlySelected);
            return true;
        }
    },

    dataChanged: function () {
        this.updateFilteredData();
        this.$.list.refresh();
    },

    queryChanged: function () {
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
