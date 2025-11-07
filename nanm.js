// ==UserScript==
// @name         khong_moveTo_animation
// @namespace    http://tampermonkey.net/
// @version      2024-03-15
// @description  try to take over the world!
// @author       You
// @match        https://zigavn.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zigavn.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    cc.moveTo = function(a, b, c) {
        return new cc.MoveTo(0, b, c)
    };

    // Your code here...
})();
