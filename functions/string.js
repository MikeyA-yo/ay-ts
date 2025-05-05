// String utility functions for AY language
function Split(str, delimiter) {
  return str.split(delimiter);
}

function Reverse(str) {
  return str.split("").reverse().join("");
}

function stylishJoin(arr, delimiter) {
  return arr.join(delimiter);
}

function shoutyCaps(str) {
  return str.toUpperCase();
}

function whisperyCaps(str) {
  return str.toLowerCase();
}