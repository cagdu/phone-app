const data = {
    wallpaper: {
        src: "/assets/img/wp/" + Math.floor(Math.random() * 3) + ".jpg",
        color: "#939393"
    }
}

window.addEventListener("load", () => {

    // Time
    setInterval(() => { document.querySelectorAll("#phone .time").forEach(x => { let date = new Date(); date = date.getHours() + ":" + date.getMinutes(); x.innerHTML = date; }) }, 1000);
    // Wallpaper
    document.querySelector("#phone > .wallpaper").style = `--wp:url(${data.wallpaper.src});--color:${data.wallpaper.color}`;
})