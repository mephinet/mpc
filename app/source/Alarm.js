/*global enyo */
enyo.kind({
    name: "MPC.Alarm",
    kind: enyo.Component,

    components: [
        {kind: enyo.PalmService, service: "palm://com.palm.power/timeout/",
         onFailure: "alarmFailure", onSuccess: "alarmSuccess",
         subscribe: true
        }
    ],

    setAlarm: function (minutes, crop) {
        if (minutes < 10) {
            minutes = "0" + minutes;
        }
        this.callService("set", {"in": "00:" + minutes + ":00"}, crop);
    },

    clearAlarm: function () {
        this.callService("clear");
    },

    callService: function (method, params, crop) {
        enyo.mixin(params, {wakeup: true, key: "sleepAlarm",
                            uri: "palm://com.palm.applicationManager/launch",
                            params: {id: enyo.fetchAppInfo().id,
                                     params: {action: "alarmWakeup", crop: crop}}});

        this.$.palmService.call(params, {method: method});
    },

    alarmSuccess: function () {
        this.log("alarm setting/clearing successful");
    },

    alarmFailure: function (sender, error) {
        this.error("alarm setting/clearing failed: " + enyo.json.stringify(error));
    }

});
