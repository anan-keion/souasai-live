// JavaScript が動くときだけ演出用に最初は隠す（動かない環境では普通に表示）
document.documentElement.classList.add("js");
window.addEventListener("load", function () {
    document.documentElement.classList.add("loaded");
});

// 見出し・本文・開催情報の枠は、スクロールして画面に入ったときに表示する。
// 狭い画面ではメインビジュアルと同じ画面に入ることがあるので、
// メインビジュアルの演出（写真 → タイトル → 情報）が終わってから監視を始める
window.addEventListener("load", function () {
    var targets = document.querySelectorAll("h2, p, .info-box, .lineup-item");
    if (!("IntersectionObserver" in window)) {
        // 古いブラウザでは演出なしで全部表示
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
                    // 同時に画面に入ったものは、上から順に少しずつずらして表示
                    entry.target.style.transitionDelay = (shown * 0.2) + "s";
                    shown++;
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);  // 一度表示したらそのまま
                }
            });
        }, { threshold: 0.2 });
        targets.forEach(function (el) { observer.observe(el); });
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        startObserving();  // 演出なしの設定ではすぐ表示
    } else {
        // 情報（最後に出る要素）の演出が終わったら開始。念のため 3 秒後にも開始する
        document.querySelector(".hero-info").addEventListener("animationend", startObserving);
        setTimeout(startObserving, 3000);
    }
});
