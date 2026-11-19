// Reloading (or back/forward) while scrolled down must NOT replay the loader.
// 1) SmoothScroll saves scrollY to sessionStorage.
// 2) This inline script runs in <head> before first paint and, if the visit is a
//    reload/back-forward with a saved scroll, adds `skip-loader` to <html>.
// 3) CSS hides the loader; Loader/Hero read the class and skip their intro.
export const SKIP_LOADER_CLASS = "skip-loader";
export const SCROLL_KEY = "hr:scrollY";
export const SKIP_SCROLL_THRESHOLD = 50;

export const SKIP_LOADER_SCRIPT = `(function(){try{var n=performance.getEntriesByType("navigation")[0];var t=n&&n.type;var y=+sessionStorage.getItem("${SCROLL_KEY}")||0;if((t==="reload"||t==="back_forward")&&y>${SKIP_SCROLL_THRESHOLD})document.documentElement.classList.add("${SKIP_LOADER_CLASS}")}catch(e){}})();`;

// Phones get their own loader (video). Same breakpoint as Tailwind `md`.
export const MOBILE_QUERY = "(max-width: 767px)";

export const shouldSkipLoader = () =>
  typeof document !== "undefined" &&
  document.documentElement.classList.contains(SKIP_LOADER_CLASS);
