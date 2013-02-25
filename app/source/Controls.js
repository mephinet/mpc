/*global enyo, $L */
enyo.kind({
    name: "MPC.Controls",
    kind: enyo.Toolbar,

    events: {
        onPlay: "",
        onPause: "",
        onStop: "",
        onNext: "",
        onVolumeChanged: ""
    },

    published: {
        playing: false
    },

    components: [
        {kind: enyo.GrabButton},
        {kind: enyo.Spacer},

        {name: "playButton", caption: $L("play"), onclick: "play"},
        {name: "pauseButton", caption: $L("pause"), onclick: "pause", showing: false},
        {name: "stopButton", caption: $L("stop"), onclick: "stop"},
        {name: "nextButton", caption: $L("next"), onclick: "doNext"},

        {kind: enyo.Spacer},

        {caption: $L("mute"), onclick: "mute"},
        {kind: enyo.Slider, className: "volumeSlider", name: "volume",
         onChanging: "volumeSliderMoving", onChange: "volumeSliderMoved",
         minimum: 0, maximum: 100, position: 10}
    ],

    ignoreRemoteVolumeChanges: false,

    play: function () {
        this.setPlaying(true);
        this.doPlay();
    },

    pause: function () {
        this.setPlaying(false);
        this.doPause();
    },

    stop: function () {
        this.setPlaying(false);
        this.doStop();
    },

    setVolumeByRemote: function (volume) {
        if (this.ignoreRemoteVolumeChanges) {
            return;
        }
        this.$.volume.setPosition(volume);
    },

    volumeSliderMoving: function () {
        this.ignoreRemoteVolumeChanges = true;
        var current = this.$.volume.getPosition();
        this.log("current value: " + current);
        this.doVolumeChanged(current);
    },

    volumeSliderMoved: function () {
        this.doVolumeChanged(this.$.volume.getPosition());
        this.ignoreRemoteVolumeChanges = false;
    },

    mute: function () {
        this.$.volume.setPosition(0);
        this.doVolumeChanged(0);
    },

    playingChanged: function () {
        this.$.playButton.setShowing(!this.playing);
        this.$.pauseButton.setShowing(!!this.playing);
    }
});
