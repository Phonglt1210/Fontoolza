// ==UserScript==
// @name         CT - ONLY
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  CT - ONLY
// @match        https://zigavn.com/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function() {
  'use strict';
  const delay = ms => new Promise(r => setTimeout(r, ms));

  let enabled = true;
  let inGame = false;

  // ===== UI ON/OFF =====
  function createToggleUI() {
    const el = document.createElement('div');
    el.textContent = "CT: ON";
    Object.assign(el.style, {
      position: "fixed",
      top: "180px",
      left: "18px",
      zIndex: 999999,
      background: "#0f0",
      padding: "8px 12px",
      borderRadius: "8px",
      fontWeight: "700",
      cursor: "pointer"
    });
    el.onclick = () => {
      enabled = !enabled;
      el.textContent = enabled ? "CT: ON" : "CT: OFF";
      el.style.background = enabled ? "#0f0" : "#f33";
    };
    document.body.appendChild(el);
  }

  // ===== HOOK BUTTON =====
  async function hookButtons() {
    while (!cc || !ccui || !ccui.Button) {
      await delay(500);
    }

    console.log("[CT] Hook button...");

    const oldAddClick = ccui.Button.prototype.addClickEventListener;

    ccui.Button.prototype.addClickEventListener = function(fn) {
      const btn = this;
      const tex = String(btn._normalFileName || btn._textureFile || "");
      const name = String(btn.name || "");
      const x = btn.x || 0;
      const y = btn.y || 0;

      const wrappedFn = (...args) => {

        // ------------ NẾU TẮT → KHÔNG CHẶN ------------
        if (!enabled) return fn.apply(this, args);

        // ------------ RESET KHI BACK ------------
        if (name.toLowerCase().includes("back") || tex.toLowerCase().includes("back")) {
          console.log("[CT] ➜ Bấm nút BACK → Reset inGame = false");
          inGame = false;
          return fn.apply(this, args);
        }

        // ------------ Ở MENU ------------
        if (!inGame) {
          const isCT =
            tex.includes("CT_butt") ||
            name.toLowerCase().includes("ct") ||
            (cc.winSize && x < cc.winSize.width / 2 && y > cc.winSize.height / 2);

          if (isCT) {
            console.log("[CT] → CT");
            inGame = true;
            return fn.apply(this, args);
          } else {
            console.log("[CT] ❌ Chặn nút game khác:", tex || name);
            return; // block click
          }
        }

        // ------------ ĐANG TRONG GAME ------------
        return fn.apply(this, args);
      };

      return oldAddClick.call(this, wrappedFn);
    };

    console.log("[CT] Hook xong.");
  }

  // ===== KHỞI CHẠY =====
  createToggleUI();
  hookButtons();

})();
