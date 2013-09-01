/*jslint onevar: false */
/*global enyo, $L */

enyo.kind({
    name: "MPC.About",
    kind: enyo.Popup,
    className: "enyo-popup mpc-about",

    components: [
        {layoutKind: "VFlexLayout", style: "height: 100%", components: [
            {kind: "Scroller", autoHorizontal: false, horizontal: false, flex: 1, components: [
                {kind: enyo.HFlexBox, pack: "center", components: [
                    {kind: enyo.Image, name: "aboutIcon", className: "icon hide-on-phones", src: "images/icon_64x64.png"},
                    {kind: enyo.VFlexBox, components: [
                        {name: "title", className: "title"},
                        {name: "copyright", className: "copyright"}
                    ]}
                ]},

                {className: "licenseInfo", content: 'This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation; either version 2 of the License, or (at your option) any later version.<br /> This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.<br /> You should have received a copy of the GNU General Public License along with this program; if not, write to the Free Software Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301, USA.<hr />This app uses <a href="http://mpd.wikia.com/wiki/ClientLib:libmpdclient">libmpdclient</a>, which is covered under a revised BSD license. The icon was designed by <a href="http://mugenb16.deviantart.com/">MugenB16</a> and is licensed by the <a href="http://creativecommons.org/licenses/by-nc-nd/3.0/">CC BY-NC-ND 3.0</a> license. The Play, Pause, Stop, Next and Mute icons are from the "Retina Display Icons" by <a href="http://blog.twg.ca">The Working Group</a>, licensed under the <a href="http://creativecommons.org/licenses/by-sa/3.0/">CC BY-SA 3.0</a> license.<br />Thanks go to <a href="http://medesimo.eu/">Eugenio Paolantonio</a> for porting the app to phones.', allowHtml: true},
                {name: "info", className: "info", allowHtml: true}
            ]},
            {kind: enyo.Button, caption: $L("Close"), onclick: "close"}
        ]}
    ],

    rendered: function () {
        this.inherited(arguments);

        var info = enyo.fetchAppInfo();
        var url = info.support.url;
        this.$.title.setContent(info.title + " " + info.version);
        this.$.copyright.setContent(info.copyright);
        this.$.info.setContent($L("Suggestions or a bug report? Visit ") + '<a href="' + url + '">' + url + '</a>');
    }
});
