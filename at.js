// ==UserScript==
// @name         AT
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  AT ONOFF
// @match        *://*.zigavn.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    console.log("✅ Script đã load");

    let canvas = document.querySelector("#gameCanvas");
    if (!canvas) {
        console.log("❌ Không tìm thấy #gameCanvas");
        return;
    }

    let posA = {x: 480, y: 560}; // tọa độ Tướng đỏ
    let step = 60;               // khoảng cách đi lên/xuống
    let isRunning = false;       // trạng thái auto
    let intervalId = null;

    // ---- Hàm click canvas ----
    function canvasClick(x, y) {
        ["mousedown", "mouseup", "click"].forEach(type => {
            canvas.dispatchEvent(new MouseEvent(type, {
                bubbles: true,
                cancelable: true,
                view: window,
                clientX: canvas.getBoundingClientRect().left + x,
                clientY: canvas.getBoundingClientRect().top + y,
                offsetX: x,
                offsetY: y
            }));
        });
        console.log("👉 Click tại offset:", x, y);
    }

    function moveTuong() {
        if (!isRunning) return;
        canvasClick(posA.x, posA.y);                  // Chọn Tướng
        setTimeout(() => { if(isRunning) canvasClick(posA.x, posA.y - step); }, 100); // Đi lên
        setTimeout(() => { if(isRunning) canvasClick(posA.x, posA.y); }, 100);        // Đi xuống
        setTimeout(() => { if(isRunning) canvasClick(posA.x, posA.y - step); }, 100); // Đi lên
        setTimeout(() => { if(isRunning) canvasClick(posA.x, posA.y); }, 100);        // Đi xuống
    }

    // ---- Tạo UI đơn giản ----
    let uiDiv = document.createElement("div");
    uiDiv.style.position = "fixed";
    uiDiv.style.top = "270px";
    uiDiv.style.right = "20px";
    uiDiv.style.padding = "10px 15px";
    uiDiv.style.background = "rgba(0,0,0,0.7)";
    uiDiv.style.color = "#fff";
    uiDiv.style.fontSize = "16px";
    uiDiv.style.borderRadius = "8px";
    uiDiv.style.zIndex = 9999;
    uiDiv.style.cursor = "pointer";
    uiDiv.innerText = "▶️ BẬT Auto Tướng";

    uiDiv.onclick = function() {
        isRunning = !isRunning;
        if (isRunning) {
            intervalId = setInterval(moveTuong, 100);
            uiDiv.innerText = "⏸ TẮT Auto Tướng";
        } else {
            clearInterval(intervalId);
            uiDiv.innerText = "▶️ BẬT Auto Tướng";
        }
    };

    document.body.appendChild(uiDiv);

})();
