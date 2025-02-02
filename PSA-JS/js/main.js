window.onload = () => {
    'use strict';
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js');
    }
};

const dropZone = document.getElementById("drop-zone");
const fileList = document.getElementById("file-list");

dropZone.addEventListener("dragover", (event) => {
    event.preventDefault();
    dropZone.style.backgroundColor = "#e0e0e0";
});

dropZone.addEventListener("dragleave", () => {
    dropZone.style.backgroundColor = "#ffffff";
});

dropZone.addEventListener("drop", (event) => {
    event.preventDefault();
    dropZone.style.backgroundColor = "#ffffff";

    const files = event.dataTransfer.files;
    handleFiles(files);
});
