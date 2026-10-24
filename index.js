// 演出用。JS が動かない環境では最初から全部表示する
document.documentElement.classList.add("js");
window.addEventListener("load", function () {
    document.documentElement.classList.add("loaded");
});

document.addEventListener("DOMContentLoaded", function () {
    var header = document.querySelector(".site-header");
    var hero = document.querySelector(".hero");
    if (!("IntersectionObserver" in window)) {
        header.classList.add("is-shown");
        return;
    }
    new IntersectionObserver(function (entries) {
        header.classList.toggle("is-shown", !entries[0].isIntersecting);
    }).observe(hero);
});

window.addEventListener("load", function () {
    var targets = document.querySelectorAll("h2, p, .info-box, .lineup-item, .lineup-break");
    if (!("IntersectionObserver" in window)) {
        targets.forEach(function (el) { el.classList.add("is-visible"); });
        return;
    }

    var started = false;
    function startObserving() {
        if (started) return;
        started = true;
        var observer = new IntersectionObserver(function (entries) {
            var shown = 0;
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.style.transitionDelay = (shown * 0.2) + "s";
                    shown++;
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        targets.forEach(function (el) { observer.observe(el); });
    }

    // メインビジュアルの演出が終わってから監視を始める
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        startObserving();
    } else {
        document.querySelector(".hero-info").addEventListener("animationend", startObserving);
        setTimeout(startObserving, 3000);
    }
});
