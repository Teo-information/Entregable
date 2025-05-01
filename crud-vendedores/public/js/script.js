// Toggle class active
const navbarNav = document.querySelector(".navbar-nav");

// Hamburger menu di klik
const hamburgerMenu = document.querySelector("#hamburger-menu");
hamburgerMenu.onclick = () => {
  navbarNav.classList.toggle("active");
};

// klik di luar sidebar, menghilangkan nav
document.addEventListener("click", function (e) {
  if (!hamburgerMenu.contains(e.target) && !navbarNav.contains(e.target)) {
    navbarNav.classList.remove("active");
  }
});
