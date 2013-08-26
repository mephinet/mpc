/*global enyo, $L */
enyo.kind({
    name: "MPC.Prefs",
    kind: enyo.VFlexBox,
    className: "mpc-prefs enyo-bg",

    events: {
        onLoaded: "",
        onSave: ""
    },

    published: {
        host: "",
        port: ""
    },

    components: [
        {kind: enyo.Toolbar, className: "enyo-toolbar-light", pack: "center", components: [
            {kind: enyo.Image, name: "toolbarImage"},
            {kind: enyo.Control, content: $L("Preferences")}
        ]},
        {kind: enyo.Scroller, flex: 1, components: [
            {kind: enyo.Control, name: "centerControl", className: "box-center", components: [
                {kind: enyo.RowGroup, caption: $L("Hostname or IP Address"), components: [
                    {name: "host", kind: enyo.Input}
                ]},

                {kind: enyo.RowGroup, caption: $L("Port"), components: [
                    {name: "port", kind: enyo.Input, autoKeyModifier: "num-lock", value: 6600}
                ]}
            ]}
        ]},

        {kind: enyo.ToolBar, layoutKind: "HFlexLayout", className: "enyo-toolbar-light", pack: "center", components: [
            {name: "saveButton", kind: enyo.Button, 
             className: "saveButton enyo-button-affirmative",
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

    rendered: function () {
        this.inherited(arguments);
        var info = enyo.fetchAppInfo();
        this.$.toolbarImage.setSrc(info.icon);
    },

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
