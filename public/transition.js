window.addEventListener("load", () => {
    document.body.classList.add("loaded");
});

document.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", e => {

        if (link.hostname !== window.location.hostname) return;

        e.preventDefault();

        document.body.classList.add("exit");

        setTimeout(() => {
            window.location.href = link.href;
        }, 400);
    });
});