/*global enyo */
enyo.kind({
    name: "MPC.SearchInput",
    kind: "enyo.Control",
    className: "mpc-search",

    events: {
        onSearch: ""
    },

    components: [
        {name: "button", kind: "IconButton",
         icon: "images/btn_search.png", onclick: "showInput"},

        {name: "input", kind: "enyo.RoundedInput", 
         className: "input", showing: false,
         spellcheck: false, autocorrect: false, autoWordComplete: false, 
         changeOnInput: true, keypressInputDelay: 0.5,
         onchange: "inputChanged",
         components: [
            {kind: "enyo.Control", className: "close", onclick: "closeInput"}
        ]}
    ],

    inputChanged: function () {
        var txt = this.$.input.getValue();
        this.doSearch(txt);
    },
   
    showInput: function () {
        this.$.button.hide();
        this.$.input.show();
    },

    closeInput: function () {
        this.$.input.hide();
        this.$.button.show();
        this.$.input.setValue("");
        this.doSearch("");
    }
    
});
