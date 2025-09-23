// String utility functions for AY language
function split(str, delimiter) {
  return str.split(delimiter);
}

function reverse(str) {
  return str.split("").reverse().join("");
}

function join(arr, delimiter) {
  return arr.join(delimiter);
}

function upper(str) {
  return str.toUpperCase();
}

function lower(str) {
  return str.toLowerCase();
}