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
                {name: "active", content: $L("Active"), flex: 1},
                {kind: enyo.ToggleButton, onChange: "settingsChanged"}
            ]},
            {kind: enyo.Item, layoutKind: "HFlexLayout", components: [
                {content: $L("Sleep after"), flex: 1},
                {name: "minutes", kind: enyo.IntegerPicker, label: $L("minutes"), min: 1, max: 59, onChange: "settingsChanged"}
            ]}
        ]}
    ],

    settingsChanged: function () {
        var s = 0;
        if (this.$.active) {
            s = this.$.minutes.getValue();
        }
        this.doSleepChanged(s);
    }
});
