/*global enyo, $L */
enyo.kind({
    name: "MPC.Prefs",
    kind: enyo.VFlexBox,

    events: {
        onLoaded: "",
        onSave: ""
    },

    published: {
        host: "",
        port: ""
    },

    components: [
        {kind: enyo.RowGroup, caption: $L("Hostname or IP Address"), components: [
            {name: "host", kind: enyo.Input}
        ]},

        {kind: enyo.RowGroup, caption: $L("Port"), components: [
            {name: "port", kind: enyo.Input, autoKeyModifier: "num-lock", value: 6600}
        ]},

        {kind: enyo.Spacer},

        {kind: enyo.ToolBar, components: [
            {name: "saveButton", kind: enyo.Button,
             style: "width: 300px",
             className: "enyo-button-affirmative",
             content: $L("Done"), onclick: "saveClick"}
        ]},

        {name: "getPreferencesCall", kind: enyo.PalmService,
         service: "palm://com.palm.systemservice/",
         method: "getPreferences",
         onSuccess: "getPrefsSuccess",
         onFailure: "prefsError"
        },
        {name: "setPreferencesCall", kind: enyo.PalmService,
         service: "palm://com.palm.systemservice/",
         method: "setPreferences",
         onSuccess: "setPrefsSuccess",
         onFailure: "prefsError"
        }
    ],

    loadPrefs: function () {
        this.$.getPreferencesCall.call({keys: ["host", "port"]});
    },

    savePrefs: function () {
        this.$.setPreferencesCall.call({
            host: this.$.host.getValue(),
            port: this.$.port.getValue()
        });
    },

    getPrefsSuccess: function (sender, response) {
        if (response.host) {
            this.setHost(response.host);
            this.$.host.setValue(response.host);
        }
        if (response.port) {
            this.setPort(response.port);
            this.$.port.setValue(response.port);
        }
        this.doLoaded();
    },

    setPrefsSuccess: function (sender, response) {
        if (!response.returnValue) {
            this.error("Saving preferences failed");
        }
    },

    prefsError: function (sender, response) {
        this.error(response);
    },

    saveClick: function () {
        this.savePrefs();
        this.setHost(this.$.host.getValue());
        this.setPort(this.$.port.getValue());
        this.doSave();
    }

});
