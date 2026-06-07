window.addEventListener("pageshow", (event) => {


    document.body.classList.remove("fade-out");


    document.body.classList.add("fade-in");


    if (event.persisted) {
        document.body.classList.remove("fade-out");
    }
});

document.querySelectorAll("a").forEach(link => {

    link.addEventListener("click", function (e) {


        if (this.hostname !== window.location.hostname) return;


        if (this.target === "_blank") return;

        e.preventDefault();

        document.body.classList.remove("fade-in");
        document.body.classList.add("fade-out");

        setTimeout(() => {
            window.location.href = this.href;
        }, 350);
    });
});