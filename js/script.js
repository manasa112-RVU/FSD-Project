
const exploreButton = document.querySelector(".primary-btn");

exploreButton.addEventListener("click", function (event) {
    event.preventDefault();
    alert("Project exploration feature will be available soon.");
});


const createButton = document.querySelector(".secondary-btn");

createButton.addEventListener("click", function (event) {
    event.preventDefault();
    alert("Project creation feature will be added in the next phase.");
});


const getStartedButton = document.querySelector(".cta-btn");

getStartedButton.addEventListener("click", function (event) {
    event.preventDefault();

    document.querySelector(".features").scrollIntoView({
        behavior: "smooth"
    });
});