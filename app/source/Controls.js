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
        {kind: enyo.GrabButton, className: "hide-on-phones"},
        {kind: enyo.Spacer, className: "hide-on-phones"},

        {name: "playButton", icon: "images/btn_play.png", onclick: "play"},
        {name: "pauseButton", icon: "images/btn_pause.png", onclick: "pause", showing: false},
        {name: "stopButton", icon: "images/btn_stop.png", onclick: "stop"},
        {name: "nextButton", icon: "images/btn_next.png", onclick: "doNext"},

        {kind: enyo.Spacer},

        {icon: "images/btn_mute.png", onclick: "mute"},
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
