/**
 * Utility function to calculate the current theme setting.
 * Look for a local storage value.
 * Fall back to system setting.
 * Fall back to light mode.
 */
function calculateSettingAsThemeString({ localStorageTheme, systemSettingDark }) {
  if (localStorageTheme !== null) {
    return localStorageTheme;
  }
  if (systemSettingDark.matches) {
    return "dark";
  }
  return "light";
}

/**
 * Utility function to update the button text and aria-label.
 */
function updateButton({ buttonEl, isDark }) {
  const newCta = isDark ? "☀" : "🌙";
  buttonEl.setAttribute("aria-label", newCta);
  buttonEl.innerText = newCta;
}

/**
 * Utility function to update the theme setting on the html tag
 */
function updateThemeOnHtmlEl({ theme }) {
  document.querySelector("html").setAttribute("data-theme", theme);
}

/**
 * Utility function to pause AOS (prevent re-animating on theme change)
 */
function pauseAOS() {
  document.querySelectorAll('[data-aos]').forEach(el => {
    el.classList.add('aos-animate');
    el.removeAttribute('data-aos');
  });
}

/**
 * Utility function to set SVG color based on the theme
 */
function setSvgColor(theme) {
  const svgs = document.querySelectorAll("svg");
  svgs.forEach(svg => {
    svg.style.fill = theme === "dark" ? "#ffffff" : "#000000";
  });
}

/**
 * On page load:
 */
const button = document.querySelector("[data-theme-toggle]");
const localStorageTheme = localStorage.getItem("bruno_theme");
const systemSettingDark = window.matchMedia("(prefers-color-scheme: dark)");

let currentThemeSetting = calculateSettingAsThemeString({ localStorageTheme, systemSettingDark });

updateButton({ buttonEl: button, isDark: currentThemeSetting === "dark" });
updateThemeOnHtmlEl({ theme: currentThemeSetting });
setSvgColor(currentThemeSetting);

button.addEventListener("click", (event) => {
  const newTheme = currentThemeSetting === "dark" ? "light" : "dark";
  localStorage.setItem("bruno_theme", newTheme);
  updateButton({ buttonEl: button, isDark: newTheme === "dark" });
  updateThemeOnHtmlEl({ theme: newTheme });
  setSvgColor(newTheme);
  pauseAOS();

  currentThemeSetting = newTheme;
});
