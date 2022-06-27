const data = { // User data
    username: "CagatayD",
    language: navigator.language || navigator.userLanguage,
    wallpaper: {
        src: "/assets/img/wp/" + Math.floor(Math.random() * 3) + ".jpg",
        color: "#939393"
    }
}

const conf = { apps: null, language: null }
$.getJSON("/assets/json/apps.map.json").done(function (x) { conf.apps = x }); // Apps
$.getJSON(`/assets/json/lang/${data.language}.json`).done(function (x) { conf.language = x }); // Language

setTimeout(() => { ready() }, 500); //todo: Development

function ready() {
    console.log(conf.language)

    // Apps
    document.querySelectorAll("#phone .body .app").forEach(x => { let type = x.attributes.getNamedItem("data-app")?.textContent, app = conf.apps[type]; x.children[0].style = `--x:${app?.pos[0]};--y:${app?.pos[1]};`; x.children[1].title = conf.language["app-" + type] })

    // Timer
    setInterval(() => {
        let date = new Date();
        document.querySelectorAll("#phone .time").forEach(x => { x.innerHTML = date.getHours() + ":" + date.getMinutes(); })
        // Clock App
        let clock = $("#phone .app.clock .detail .sticks")[0]; clock.children[0].style = `transform:rotate(${(date.getHours() >= 12 ? date.getHours() - 12 : date.getHours()) * 30}deg)`; clock.children[1].style = `transform:rotate(${date.getMinutes() * 6}deg)`; clock.children[2].style = `transform:rotate(${date.getSeconds() * 6}deg)`;
        // Calendar App
        let calendar = $("#phone .app.calendar .detail")[0];
        calendar.children[0].innerHTML = conf.language["calendar-" + date.getDay()];
        calendar.children[1].innerHTML = date.getDate();
    }, 1000);

    // Wallpaper
    document.querySelector("#phone > .wallpaper").style = `--wp:url(${data.wallpaper.src});--color:${data.wallpaper.color}`;

    // Page Manager
    let body = document.querySelector("#phone .body");
    for (let i = 0; Number(body.getAttribute("data-max")) > i; i++) { $("#phone .body .dots .min").append(`<div class="dot p${i + 1} ${Number(body.getAttribute("data-page")) == i + 1 ? "a" : ""} ">•</div>`) }
    const pageManager = new class {
        editDot = (page) => { $("#phone .body .dots .min .dot.a").removeClass("a"); $(`#phone .body .dots .min .dot.p${page}`).addClass("a"); }
        right = () => { let nums = [Number(body.getAttribute("data-page")), Number(body.getAttribute("data-max"))]; if (nums[1] > nums[0]) { body.setAttribute("data-page", nums[0] + 1); body.children[0].classList.replace("p" + nums[0], "p" + Number(nums[0] + 1)); this.editDot(Number(nums[0] + 1)) } }
        left = () => { let nums = [Number(body.getAttribute("data-page")), Number(body.getAttribute("data-max"))]; if (nums[0] > 1) { body.setAttribute("data-page", nums[0] - 1); body.children[0].classList.replace("p" + nums[0], "p" + Number(nums[0] - 1)); this.editDot(Number(nums[0] - 1)) } }
        move = (page) => { let nums = [Number(body.getAttribute("data-page")), Number(body.getAttribute("data-max"))]; if (page !== nums[0] && page <= nums[1]) { body.setAttribute("data-page", page); body.children[0].classList.replace("p" + nums[0], "p" + page); this.editDot(page) } }
    }
    $(document).delegate("#phone .body .dots .min .dot", "click", (e) => pageManager.move(String(e.currentTarget.classList[1]).replace("p", "")));
    /**
     * ----------------------
     * https://stackoverflow.com/questions/2264072/detect-a-finger-swipe-through-javascript-on-the-iphone-and-android
     */
    body.addEventListener('touchstart', handleTouchStart, false);
    body.addEventListener('touchmove', handleTouchMove, false);
    var xDown = null, yDown = null;
    function getTouches(evt) { return evt.touches || evt.originalEvent.touches; }
    function handleTouchStart(evt) { const firstTouch = getTouches(evt)[0]; xDown = firstTouch.clientX; yDown = firstTouch.clientY; };
    function handleTouchMove(evt) { if (!xDown || !yDown) return; var xUp = evt.touches[0].clientX, yUp = evt.touches[0].clientY, xDiff = xDown - xUp, yDiff = yDown - yUp; if (Math.abs(xDiff) > Math.abs(yDiff)) { if (xDiff > 0) { pageManager.right() } else { pageManager.left() } } else { if (yDiff > 0) { } else { } }; xDown = null; yDown = null; };
    /** ---------------------- */
}