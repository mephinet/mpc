/*global enyo */
enyo.kind({
    name: "MPC.VirtualList",
    kind: enyo.Pane,

    published: {
        data: null
    },

    components: [
        {name: "list", kind: enyo.VirtualList, onSetupRow: "setupRow",
         components: [
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

    setupRow: function (sender, index) {
        if (this.data && this.data[index]) {
            var entry = this.data[index];
            this.$.caption.setContent(this.renderEntry(entry));
            this.$.button.setCaption(this.buttonCaption);
            this.$.button.setShowing(index === this.currentlySelected);
            return true;
        }
    },

    dataChanged: function () {
        this.$.list.refresh();
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
