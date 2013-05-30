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
                {content: $L("Crop queue to"), flex: 1},
                {name: "minutes", kind: enyo.IntegerPicker, label: $L("minutes"), min: 1, max: 59}
            ]},
            {kind: enyo.Item, layoutKind: "HFlexLayout", pack: "center", align: "center", components: [
                {kind: enyo.Button, label: $L("Crop Queue"), onclick: "crop", className: "enyo-button-affirmative"}
            ]}

        ]}
    ],

    crop: function (sender) {
        var s = this.$.minutes.getValue() * 60;
        this.doSleepChanged(s);
    }

});
