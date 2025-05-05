// Timer utility functions for AY language
function Timeout(fn, delay) {
  return setTimeout(fn, delay);
}

function Interval(fn, interval) {
  return setInterval(fn, interval);
}

function stopTimeout(timeoutId) {
  clearTimeout(timeoutId);
}

function stopInterval(intervalId) {
  clearInterval(intervalId);
}