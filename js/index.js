import Page from "./page.js";

window.dataLayer = window.dataLayer || [];

function gtag() {dataLayer.push(arguments);}

gtag('js', new Date());
gtag('config', 'UA-142122097-3');

document.addEventListener('gesturestart', e => {
    e.preventDefault();
});

new Page().eventListeners();