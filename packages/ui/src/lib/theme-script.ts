export const THEME_STORAGE_KEY = "theme";

/**
 * Runs before the page paints so the stored theme is applied without a flash.
 * Kept as a string because it has to be inlined into the document.
 */
export const themeScript = `(function(){try{var key="${THEME_STORAGE_KEY}";var stored=localStorage.getItem(key);var theme=stored==="light"||stored==="dark"?stored:(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");var root=document.documentElement;root.dataset.theme=theme;root.classList.toggle("dark",theme==="dark");root.style.colorScheme=theme;}catch(e){}})();`;
