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

function initializeNavDropdowns() {
  document.querySelectorAll(".nav-dropdown").forEach(function (dropdown) {
    if (dropdown.dataset.dropdownInitialized === "true") {
      return;
    }

    var trigger = dropdown.querySelector(".nav-trigger");
    var menu = dropdown.querySelector(".nav-dropdown-menu");

    if (!trigger || !menu) {
      return;
    }

    dropdown.dataset.dropdownInitialized = "true";

    trigger.addEventListener("click", function (event) {
      if (!dropdown.classList.contains("open")) {
        event.preventDefault();
        document.querySelectorAll(".nav-dropdown.open").forEach(function (openDropdown) {
          if (openDropdown !== dropdown) {
            openDropdown.classList.remove("open");
          }
        });
        dropdown.classList.add("open");
      }
    });
  });
}

document.addEventListener("click", function (event) {
  document.querySelectorAll(".nav-dropdown.open").forEach(function (dropdown) {
    if (!dropdown.contains(event.target)) {
      dropdown.classList.remove("open");
    }
  });
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

function initializeDetailScheduling() {
  var today = new Date();
  today.setHours(0, 0, 0, 0);
  var blockedDates = [
    // Add closed or fully booked dates here using YYYY-MM-DD.
    "2026-07-03",
    "2026-07-04",
  ];
  var monthFormatter = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" });

  function formatDateKey(date) {
    var month = String(date.getMonth() + 1).padStart(2, "0");
    var day = String(date.getDate()).padStart(2, "0");
    return date.getFullYear() + "-" + month + "-" + day;
  }

  function formatDateForField(date) {
    return (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();
  }

  document.querySelectorAll(".calendar-field").forEach(function (calendarField) {
    var dateField = calendarField.querySelector("input[readonly]");
    var calendar = calendarField.querySelector("[data-detail-calendar]");

    if (!dateField || !calendar || dateField.dataset.schedulingInitialized === "true") {
      return;
    }

    dateField.dataset.schedulingInitialized = "true";

    var visibleMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    var selectedDate = null;
    var title = calendar.querySelector("[data-calendar-title]");
    var grid = calendar.querySelector("[data-calendar-grid]");
    var previousButton = calendar.querySelector("[data-calendar-prev]");
    var nextButton = calendar.querySelector("[data-calendar-next]");

    if (!title || !grid || !previousButton || !nextButton) {
      return;
    }

    function openCalendar() {
      document.querySelectorAll(".calendar-field.open").forEach(function (openField) {
        if (openField !== calendarField) {
          openField.classList.remove("open");
        }
      });
      calendarField.classList.add("open");
    }

    function closeCalendar() {
      calendarField.classList.remove("open");
    }

    function renderCalendar() {
      grid.innerHTML = "";
      title.textContent = monthFormatter.format(visibleMonth);

      var firstDay = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1);
      var daysInMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 0).getDate();

      for (var emptyDay = 0; emptyDay < firstDay.getDay(); emptyDay += 1) {
        var spacer = document.createElement("span");
        spacer.className = "calendar-day empty";
        grid.appendChild(spacer);
      }

      for (var day = 1; day <= daysInMonth; day += 1) {
        var date = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), day);
        var button = document.createElement("button");
        var isSunday = date.getDay() === 0;
        var isPast = date < today;
        var value = formatDateKey(date);
        var displayValue = formatDateForField(date);
        var isBlocked = blockedDates.indexOf(value) !== -1;

        button.type = "button";
        button.className = "calendar-day";
        button.textContent = day;
        button.dataset.date = value;
        button.dataset.displayDate = displayValue;
        button.setAttribute("aria-label", displayValue);

        if (isSunday) {
          button.classList.add("sunday");
          button.disabled = true;
          button.setAttribute("aria-label", displayValue + " unavailable, Sunday");
        } else if (isBlocked) {
          button.classList.add("blocked");
          button.disabled = true;
          button.setAttribute("aria-label", displayValue + " unavailable");
        } else if (isPast) {
          button.classList.add("past");
          button.disabled = true;
          button.setAttribute("aria-label", displayValue + " unavailable, past date");
        }

        if (selectedDate === value) {
          button.classList.add("selected");
          button.setAttribute("aria-pressed", "true");
        }

        button.addEventListener("click", function (event) {
          selectedDate = event.currentTarget.dataset.date;
          dateField.value = event.currentTarget.dataset.displayDate;
          dateField.setCustomValidity("");
          closeCalendar();
          renderCalendar();
        });

        grid.appendChild(button);
      }
    }

    previousButton.addEventListener("click", function () {
      visibleMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1);
      renderCalendar();
    });

    nextButton.addEventListener("click", function () {
      visibleMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1);
      renderCalendar();
    });

    dateField.addEventListener("focus", openCalendar);
    dateField.addEventListener("click", openCalendar);

    document.addEventListener("click", function (event) {
      if (!calendarField.contains(event.target)) {
        closeCalendar();
      }
    });

    dateField.addEventListener("invalid", function () {
      if (!dateField.value && dateField.required) {
        dateField.setCustomValidity("Please choose an available date from the calendar.");
        openCalendar();
      }
    });

    dateField.addEventListener("input", function () {
      dateField.setCustomValidity("");
    });

    renderCalendar();
  });
}

function initializeVehicleSelectors() {
  var yearList = document.getElementById("vehicle_year_options");
  var makeInput = document.getElementById("vehicle_make");
  var makeList = document.getElementById("vehicle_make_options");
  var modelInput = document.getElementById("vehicle_model");
  var modelList = document.getElementById("vehicle_model_options");

  if (!yearList || !makeInput || !makeList || !modelInput || !modelList || makeInput.dataset.vehicleInitialized === "true") {
    return;
  }

  makeInput.dataset.vehicleInitialized = "true";

  var vehicleModels = {
    Acura: ["ILX", "Integra", "MDX", "RDX", "RLX", "TL", "TLX", "TSX"],
    Audi: ["A3", "A4", "A5", "A6", "A7", "A8", "e-tron", "Q3", "Q5", "Q7", "Q8", "S4", "S5"],
    BMW: ["2 Series", "3 Series", "4 Series", "5 Series", "7 Series", "i3", "i4", "iX", "X1", "X2", "X3", "X4", "X5", "X6", "X7"],
    Buick: ["Cascada", "Enclave", "Encore", "Encore GX", "Envision", "LaCrosse", "Regal", "Verano"],
    Cadillac: ["ATS", "CT4", "CT5", "CT6", "CTS", "Escalade", "SRX", "XT4", "XT5", "XT6", "XTS"],
    Chevrolet: ["Avalanche", "Blazer", "Bolt EV", "Camaro", "Colorado", "Corvette", "Cruze", "Equinox", "Impala", "Malibu", "Silverado 1500", "Silverado 2500HD", "Silverado 3500HD", "Sonic", "Spark", "Suburban", "Tahoe", "Trailblazer", "Traverse", "Trax", "Volt"],
    Chrysler: ["200", "300", "Aspen", "Pacifica", "PT Cruiser", "Sebring", "Town & Country", "Voyager"],
    Dodge: ["Avenger", "Caliber", "Challenger", "Charger", "Dart", "Durango", "Grand Caravan", "Journey", "Magnum", "Nitro"],
    Ford: ["Bronco", "Bronco Sport", "C-Max", "Edge", "Escape", "Expedition", "Explorer", "F-150", "F-250 Super Duty", "F-350 Super Duty", "Fiesta", "Flex", "Focus", "Fusion", "Maverick", "Mustang", "Ranger", "Taurus", "Transit", "Transit Connect"],
    Genesis: ["G70", "G80", "G90", "GV60", "GV70", "GV80"],
    GMC: ["Acadia", "Canyon", "Envoy", "Savana", "Sierra 1500", "Sierra 2500HD", "Sierra 3500HD", "Terrain", "Yukon", "Yukon XL"],
    Honda: ["Accord", "Civic", "Clarity", "CR-V", "CR-Z", "Crosstour", "Element", "Fit", "HR-V", "Insight", "Odyssey", "Passport", "Pilot", "Ridgeline"],
    Hyundai: ["Accent", "Azera", "Elantra", "Genesis", "Ioniq", "Ioniq 5", "Ioniq 6", "Kona", "Palisade", "Santa Cruz", "Santa Fe", "Sonata", "Tucson", "Veloster", "Venue", "Veracruz"],
    Infiniti: ["EX", "FX", "G", "JX", "M", "Q40", "Q50", "Q60", "Q70", "QX30", "QX50", "QX55", "QX60", "QX70", "QX80"],
    Jeep: ["Cherokee", "Commander", "Compass", "Gladiator", "Grand Cherokee", "Grand Cherokee L", "Liberty", "Patriot", "Renegade", "Wagoneer", "Wrangler"],
    Kia: ["Cadenza", "Carnival", "EV6", "Forte", "K5", "K900", "Niro", "Optima", "Rio", "Sedona", "Seltos", "Sorento", "Soul", "Sportage", "Stinger", "Telluride"],
    Lexus: ["CT", "ES", "GS", "GX", "HS", "IS", "LC", "LS", "LX", "NX", "RC", "RX", "UX"],
    Lincoln: ["Aviator", "Continental", "Corsair", "MKC", "MKS", "MKT", "MKX", "MKZ", "Nautilus", "Navigator"],
    Mazda: ["CX-3", "CX-30", "CX-5", "CX-50", "CX-7", "CX-9", "Mazda2", "Mazda3", "Mazda5", "Mazda6", "MX-5 Miata", "Tribute"],
    "Mercedes-Benz": ["A-Class", "B-Class", "C-Class", "CLA", "CLS", "E-Class", "G-Class", "GLA", "GLB", "GLC", "GLE", "GLK", "GLS", "M-Class", "S-Class", "Sprinter"],
    Mini: ["Clubman", "Convertible", "Cooper", "Countryman", "Hardtop", "Paceman"],
    Mitsubishi: ["Eclipse Cross", "Endeavor", "Galant", "Lancer", "Mirage", "Outlander", "Outlander Sport", "Raider"],
    Nissan: ["370Z", "Altima", "Armada", "Frontier", "Juke", "Kicks", "Leaf", "Maxima", "Murano", "NV", "Pathfinder", "Quest", "Rogue", "Rogue Sport", "Sentra", "Titan", "Versa", "Xterra"],
    Ram: ["1500", "1500 Classic", "2500", "3500", "ProMaster", "ProMaster City"],
    Subaru: ["Ascent", "Baja", "BRZ", "Crosstrek", "Forester", "Impreza", "Legacy", "Outback", "Solterra", "Tribeca", "WRX", "XV Crosstrek"],
    Tesla: ["Model 3", "Model S", "Model X", "Model Y"],
    Toyota: ["4Runner", "Avalon", "C-HR", "Camry", "Corolla", "Crown", "FJ Cruiser", "Highlander", "Land Cruiser", "Prius", "RAV4", "Sequoia", "Sienna", "Tacoma", "Tundra", "Venza", "Yaris"],
    Volkswagen: ["Arteon", "Atlas", "Beetle", "CC", "Eos", "Golf", "GTI", "ID.4", "Jetta", "Passat", "Routan", "Taos", "Tiguan", "Touareg"],
    Volvo: ["C30", "C70", "S40", "S60", "S80", "S90", "V50", "V60", "V70", "V90", "XC40", "XC60", "XC70", "XC90"]
  };
  var extraMakes = ["Alfa Romeo", "Fiat", "Hummer", "Jaguar", "Land Rover", "Lucid", "Maserati", "Mercury", "Oldsmobile", "Polestar", "Pontiac", "Porsche", "Rivian", "Saab", "Saturn", "Scion", "Smart", "Suzuki"];
  var fallbackModels = ["Coupe", "Hatchback", "Sedan", "Convertible", "Wagon", "Crossover", "SUV", "Minivan", "Cargo Van", "Passenger Van", "Pickup", "Box Truck"];

  var currentYear = new Date().getFullYear() + 1;
  var years = [];
  for (var year = currentYear; year >= 1980; year -= 1) {
    years.push(String(year));
  }

  var makes = Object.keys(vehicleModels).concat(extraMakes).sort();
  var allModels = Array.from(new Set(Object.keys(vehicleModels).reduce(function (models, make) {
    return models.concat(vehicleModels[make]);
  }, fallbackModels))).sort();

  function findMake(value) {
    var normalizedValue = value.trim().toLowerCase();
    return makes.find(function (make) {
      return make.toLowerCase() === normalizedValue;
    });
  }

  function currentModelValues() {
    var make = findMake(makeInput.value);
    return make && vehicleModels[make] ? vehicleModels[make] : allModels;
  }

  function createAutocomplete(input, menu, getValues, onSelect) {
    var activeIndex = -1;

    function getFilteredValues() {
      var query = input.value.trim().toLowerCase();
      var values = getValues();

      if (!query) {
        return values.slice(0, 80);
      }

      return values.filter(function (value) {
        return value.toLowerCase().indexOf(query) !== -1;
      }).slice(0, 80);
    }

    function closeMenu() {
      input.closest(".autocomplete-field").classList.remove("open");
      activeIndex = -1;
    }

    function renderMenu() {
      var values = getFilteredValues();
      menu.innerHTML = "";

      if (!values.length) {
        var empty = document.createElement("p");
        empty.className = "autocomplete-empty";
        empty.textContent = "No matches. You can keep typing your own entry.";
        menu.appendChild(empty);
        input.closest(".autocomplete-field").classList.add("open");
        return;
      }

      values.forEach(function (value, index) {
        var option = document.createElement("button");
        option.type = "button";
        option.className = "autocomplete-option";
        option.textContent = value;
        option.dataset.value = value;

        if (index === activeIndex) {
          option.classList.add("active");
        }

        option.addEventListener("mousedown", function (event) {
          event.preventDefault();
        });

        option.addEventListener("click", function () {
          input.value = value;
          closeMenu();

          if (onSelect) {
            onSelect(value);
          }
        });

        menu.appendChild(option);
      });

      input.closest(".autocomplete-field").classList.add("open");
    }

    input.addEventListener("focus", renderMenu);
    input.addEventListener("click", renderMenu);
    input.addEventListener("input", function () {
      activeIndex = -1;
      renderMenu();

      if (onSelect) {
        onSelect(input.value);
      }
    });

    input.addEventListener("keydown", function (event) {
      var options = menu.querySelectorAll(".autocomplete-option");

      if (event.key === "ArrowDown") {
        event.preventDefault();
        activeIndex = options.length ? Math.min(activeIndex + 1, options.length - 1) : -1;
        renderMenu();
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        activeIndex = options.length ? Math.max(activeIndex - 1, 0) : -1;
        renderMenu();
      } else if (event.key === "Enter" && activeIndex >= 0 && options[activeIndex]) {
        event.preventDefault();
        input.value = options[activeIndex].dataset.value;
        closeMenu();

        if (onSelect) {
          onSelect(input.value);
        }
      } else if (event.key === "Escape") {
        closeMenu();
      }
    });

    document.addEventListener("click", function (event) {
      if (!input.closest(".autocomplete-field").contains(event.target)) {
        closeMenu();
      }
    });
  }

  createAutocomplete(yearList.previousElementSibling, yearList, function () {
    return years;
  });

  createAutocomplete(makeInput, makeList, function () {
    return makes;
  }, function () {
    modelInput.value = "";
  });

  createAutocomplete(modelInput, modelList, currentModelValues);

  makeInput.addEventListener("change", function () {
    modelInput.value = "";
  });
}

function initializeForms() {
  initializeNavDropdowns();
  initializeOtherFields();
  initializeDetailScheduling();
  initializeVehicleSelectors();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeForms);
} else {
  initializeForms();
}
