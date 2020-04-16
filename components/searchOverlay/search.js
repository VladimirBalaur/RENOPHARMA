function closeSearchSection() {
    let durationMs = 1000;
    let elem = document.querySelector("div.search");
    elem.style.animationName = "fade";
    elem.style.animationDuration = `${durationMs}ms`;
    elem.style.animationFillMode = "forwards";

    setTimeout(() => {
        elem.style.display = "none";
    }, durationMs);
}

function showSearchSection() {
    let elem = document.querySelector("div.search");

    elem.style.display = "flex";
    elem.style.animationName = "show";
    elem.style.animationDuration = `1s`;
    elem.style.animationFillMode = "forwards";
}