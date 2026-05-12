window.addEventListener("pageshow", () => {
    document.body.classList.add("fade-in");
});

document.querySelectorAll("a").forEach(link => {

    link.addEventListener("click", function (e) {

        // Ignore links opening in new tab
        if (this.target === "_blank") return;

        // Ignore external links
        if (this.hostname !== window.location.hostname) return;

        e.preventDefault();

        document.body.classList.remove("fade-in");
        document.body.classList.add("fade-out");

        setTimeout(() => {
            window.location.href = this.href;
        }, 350);
    });
});