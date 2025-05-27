document.addEventListener("DOMContentLoaded", function() {
    const bellButton = document.querySelector("#notification__button");

    function ringBell() {
        bellButton.classList.add("active");
        setTimeout(() => {
            bellButton.classList.remove("active");
        }, 500);
    }

    setInterval(ringBell, 2000);
});