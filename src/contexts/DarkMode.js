const KEY = "dark_mode";

export function isDarkMode() {
    return localStorage.getItem(KEY) === "true"; 
}

export function toggleDarkMode() {
  const toggle = !isDarkMode();
  localStorage.setItem(KEY, String(toggle));
  applyDarkMode(toggle);
  return toggle;
}

export function applyDarkMode(dark) {
  if (dark) { 
    document.documentElement.setAttribute("theme-mode", "dark");
  } else {
    document.documentElement.removeAttribute("theme-mode");
  }
}

export function initDarkMode() { 
    applyDarkMode(isDarkMode()); 
}
