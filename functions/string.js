// String utility functions for AY language
function split(str, delimiter) {
  return str.split(delimiter);
}

function reverse(val) {
  if (Array.isArray(val)) {
    return val.reverse();
  }
  return String(val).split("").reverse().join("");
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