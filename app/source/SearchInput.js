enyo.kind({
    name: "MPC.SearchInput",
    kind: "enyo.Control",
    className: "search",

    events: {
        onClose: "",
        onSearch: "",
    },

    components: [
        {name: "input", kind: "enyo.RoundedInput",
         spellcheck: false, autocorrect: false, autoWordComplete: false, 
         changeOnInput: true, keypressInputDelay: 0.5,
         onchange: "inputChanged",
         components: [
            {kind: "enyo.Control", className: "close", onclick: "close"}
        ]}
    ],

    inputChanged: function () {
        var txt = this.$.input.getValue();
        this.doSearch(txt);
    },
   
    close: function () {
        this.doClose();
        this.doSearch("");
        this.$.input.setValue("");
    }
    
});
