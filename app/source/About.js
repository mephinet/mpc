/*jslint vars: true */
/*global enyo, $L */

enyo.kind({
    name: "MPC.About",
    kind: enyo.Popup,

    components: [
        {kind: enyo.HFlexBox, components: [
            {kind: enyo.Image, className: "aboutImage", src: "images/icon_64x64.png"},
            {kind: enyo.VFlexBox, components: [
                {name: "title", className: "aboutTitle"},
                {name: "copyright", className: "aboutCopyright"}
            ]}
        ]},
        {name: "licenseInfo", className: "licenseInfo", content: 'This app uses <a href="http://mpd.wikia.com/wiki/ClientLib:libmpdclient">libmpdclient</a>, which is covered under a revised BSD license. The app icon was designed by <a href="http://mugenb16.deviantart.com/">MugenB16</a> and is covered by a CC license.', allowHtml: true},
        {name: "info", allowHtml: true},
        {kind: enyo.Button, caption: $L("close"), onclick: "close"}
    ],

    rendered: function () {
        this.inherited(arguments);

        var info = enyo.fetchAppInfo();
        this.log(enyo.json.stringify(info));
        var url = info.support.url;
        this.$.title.setContent(info.title + " " + info.version);
        this.$.copyright.setContent(info.copyright);
        this.$.info.setContent($L("Suggestions or a bug report? Visit ") + '<a href="' + url + '">' + url + '</a>');
    }
});
