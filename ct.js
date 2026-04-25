// ==UserScript==
// @name         Checkkey
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Checkkey
// @match        *://*.zigavn.com/*
// @grant        none
// ==/UserScript==

(function () {
    // tránh chạy nhiều lần nếu file bị load lại
    if (window.__PING_INSTALLED__) return;
    window.__PING_INSTALLED__ = true;

    const SERVER = "https://your-domain.com";

    // lấy lại từ context sẵn có của bạn (tuỳ bạn đang truyền kiểu gì)
    const urlParams = new URLSearchParams(location.search);

    const finger = urlParams.get("finger") || window.__FINGER__;
    const profile = urlParams.get("profile") || window.__PROFILE__;

    if (!finger || !profile) {
        console.warn("Missing auth info");
        return;
    }

    let isReloading = false;

    async function checkKey() {
        try {
            const res = await fetch(`${SERVER}/ping?finger=${finger}&profile=${profile}`, {
                cache: "no-store"
            });

            if (!res.ok) return triggerReload();

            const data = await res.json();
            if (!data.ok) triggerReload();

        } catch (e) {
            triggerReload();
        }
    }

    function triggerReload() {
        if (isReloading) return;
        isReloading = true;

        console.log("❌ Key invalid → reload");

        try {
            localStorage.clear();
            sessionStorage.clear();
        } catch (e) {}

        setTimeout(() => {
            location.reload();
        }, 500);
    }

    // chạy ngay
    checkKey();

    // mỗi 5 phút
    setInterval(checkKey, 5 * 60 * 1000);

    // khi user quay lại tab → check luôn
    document.addEventListener("visibilitychange", () => {
        if (!document.hidden) checkKey();
    });

})();
