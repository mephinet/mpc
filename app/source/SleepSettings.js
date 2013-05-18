/*global enyo, $L */
enyo.kind({
    name: "MPC.SleepSettings",
    kind: enyo.VFlexBox,
    className: "mpc-sleep-settings",

    events: {
        onSleepChanged: ""
    },

    components: [
        {kind: enyo.Group, components: [
            {kind: enyo.Item, layoutKind: "HFlexLayout", align: "center", components: [
                {content: $L("Active"), flex: 1},
                {name: "button", kind: enyo.ToggleButton, onChange: "settingsChanged"}
            ]},
            {kind: enyo.Item, layoutKind: "HFlexLayout", align: "center", components: [
                {content: $L("Sleep after"), flex: 1},
                {name: "minutes", kind: enyo.IntegerPicker, label: $L("minutes"), min: 1, max: 59, onChange: "settingsChanged"}
            ]},
            {kind: enyo.Item, layoutKind: "HFlexLayout", align: "center", components: [
                {content: $L("Finish last song"), flex: 1},
                {content: $L("Warning: this will erase the queue"), className: "note"},
                {name: "crop", kind: enyo.ToggleButton, onChange: "settingsChanged"}
            ]}
        ]}
    ],

    settingsChanged: function (sender) {
        var s = 0;
        if (this.$.button.getState()) {
            s = this.$.minutes.getValue();
        }
        this.doSleepChanged(s, this.$.crop.getState());
    },

    resetSleep: function () {
        this.$.button.setState(false);
    }
});
