/*global enyo */
enyo.kind({
    name: "MPC.SearchInput",
    kind: "enyo.HFlexBox",
    className: "mpc-search",

    events: {
        onSearch: "",
        onClose: ""
    },

    components: [
        {name: "input", kind: "enyo.RoundedInput", flex: 1,
         className: "input",
         spellcheck: false, autocorrect: false, autoWordComplete: false,
         changeOnInput: true, keypressInputDelay: 0.5,
         onchange: "inputChanged",
         components: [
            {kind: "enyo.Control", className: "close", onclick: "doClose"}
        ]}
    ],

    inputChanged: function () {
        var txt = this.$.input.getValue();
        this.doSearch(txt);
    },

    forceFocus: function () {
        this.$.input.forceFocus();
    },

    clear: function () {
        this.$.input.setValue("");
    }
});
