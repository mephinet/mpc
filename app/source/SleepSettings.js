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
            {kind: enyo.Item, layoutKind: "HFlexLayout", components: [
                {content: $L("Active"), flex: 1},
                {name: "button", kind: enyo.ToggleButton, onChange: "settingsChanged"}
            ]},
            {kind: enyo.Item, layoutKind: "HFlexLayout", components: [
                {content: $L("Sleep after"), flex: 1},
                {name: "minutes", kind: enyo.IntegerPicker, label: $L("minutes"), min: 1, max: 59, onChange: "settingsChanged"}
            ]}
        ]}
    ],

    settingsChanged: function (sender, state) {
        var s = 0;
        if (state) {
            s = this.$.minutes.getValue();
        }
        this.doSleepChanged(s);
    },

    resetSleep: function () {
        this.$.button.setState(false);
    }
});
