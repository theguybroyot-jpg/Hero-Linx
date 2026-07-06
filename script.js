// Hero Linx Starter JavaScript

const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");

menuBtn.addEventListener("click", () => {
    sidebar.classList.toggle("open");
});

// Close menu when clicking outside
document.addEventListener("click", (event) => {

    if (
        !sidebar.contains(event.target) &&
        !menuBtn.contains(event.target)
    ) {
        sidebar.classList.remove("open");
    }

});

// Search box

const search = document.getElementById("search");

search.addEventListener("keyup", function(){

    console.log("Searching for:", search.value);

    // We'll connect this to your games later.

});

// Welcome message

console.log("Hero Linx Loaded Successfully!");
