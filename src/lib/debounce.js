export function debounce(fn, delayMs = 300) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), delayMs);
  };
}