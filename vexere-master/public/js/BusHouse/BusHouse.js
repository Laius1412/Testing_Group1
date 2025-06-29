"use strict";
function addNavEvent() {
    const navs = document.querySelectorAll("#house-tab-select > li");
    const tabs = document.querySelectorAll(".js-house-tab");
    navs.forEach((nav, index) => {
        nav.addEventListener("click", () => {
            nav.style.borderBottom = "2px double rgb(0, 96, 196)";
            nav.style.color = "rgb(0, 96, 196)";
            navs.forEach((subNav, navId) => {
                if (navId !== index) {
                    subNav.style.borderBottom = "none";
                    subNav.style.color = "black";
                }
            });
            tabs.forEach((tab, tabId) => {
                tab.style.display = (tabId === index) ? "block" : "none";
            });
        });
    });
}
addNavEvent();
