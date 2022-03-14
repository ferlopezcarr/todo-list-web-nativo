document.getElementById("navbar-menu-button").addEventListener('click', (e) => {
    e.preventDefault();
    displayMenu();
});

function displayMenu() {
    const navbarButton = document.getElementById("navbar-menu-button");
    const sidebar = document.getElementById("sidebar-menu");
    if (!navbarButton.classList.contains("active")) {
        navbarButton.classList.add("active");
        sidebar.classList.remove("hidden");
    } else {
        navbarButton.classList.remove("active")
        sidebar.classList.add("hidden");
    }
}