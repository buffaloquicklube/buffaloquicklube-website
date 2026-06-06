function toggleMenu() {
  var menu = document.getElementById("navMenu");
  if (menu) {
    menu.classList.toggle("show");
  }
}

document.addEventListener("click", function (event) {
  var menu = document.getElementById("navMenu");
  var button = document.querySelector(".menu-btn");

  if (!menu || !button || !menu.classList.contains("show")) {
    return;
  }

  if (!menu.contains(event.target) && !button.contains(event.target)) {
    menu.classList.remove("show");
  }
});
