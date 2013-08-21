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

        {name: "input", kind: "enyo.RoundedInput", flex: 1,
         className: "input", showing: false,
         spellcheck: false, autocorrect: false, autoWordComplete: false, 
         changeOnInput: true, keypressInputDelay: 0.5,
         onchange: "inputChanged",
         components: [
            {kind: "enyo.Control", className: "close", onclick: "closeInput"}
        ]}
    ],
    
    ready: function() {
	if (window.innerWidth <= 640) {
	    // ensure the search box expands...
            // FIXME: this works on the pre3, but on other phones?
            this.$.input.setStyle("width: 300px;");
            this.$.input.hide();
        }
    },

    inputChanged: function () {
        var txt = this.$.input.getValue();
        this.doSearch(txt);
    },
   
    showInput: function () {
	if (window.innerWidth <= 640) {
	    // hide song title on phones
            this.owner.$.statusSpacer.hide();
            this.owner.$.currentStatusSong.hide();
	    this.owner.$.currentStatus.hide();
        }

        this.$.button.hide();
        this.$.input.show();
        this.$.input.forceFocus();
    },

    closeInput: function () {
        this.$.input.hide();
        this.$.input.forceBlur();
        this.$.button.show();
        this.$.input.setValue("");
        this.doSearch("");

	if (window.innerWidth <= 640) {
	    // restore song title on phones
            this.owner.$.statusSpacer.show();
            this.owner.$.currentStatusSong.show();
	    this.owner.$.currentStatus.show();
        }
    }
    
});
