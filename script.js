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

function initializeOtherFields() {
  document.querySelectorAll(".conditional-other").forEach(function (field) {
    if (field.dataset.otherInitialized === "true") {
      return;
    }

    var select = document.getElementById(field.getAttribute("data-other-for"));
    var input = field.querySelector("input");

    if (!select || !input) {
      return;
    }

    field.dataset.otherInitialized = "true";

    function updateOtherField() {
      var selectedText = select.options[select.selectedIndex] ? select.options[select.selectedIndex].text : "";
      var shouldShow = select.value === "Other" || selectedText === "Other";
      field.classList.toggle("show", shouldShow);
      input.required = shouldShow;

      if (!shouldShow) {
        input.value = "";
      }
    }

    select.addEventListener("change", updateOtherField);
    updateOtherField();
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeOtherFields);
} else {
  initializeOtherFields();
}
