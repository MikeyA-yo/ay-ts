function rand(min = 0, max = 0) {
  return Math.random() * (max - min + 1) + min
}

function randInt(min = 0, max = 0) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function round(num, precision = 0) {
  return Math.round(num * Math.pow(10, precision)) / Math.pow(10, precision);
}

// Basic trigonometric functions
function sin(x) {
  return Math.sin(x);
}

function cos(x) {
  return Math.cos(x);
}

function tan(x) {
  return Math.tan(x);
}

// Inverse trigonometric functions
function asin(x) {
  return Math.asin(x);
}

function acos(x) {
  return Math.acos(x);
}

function atan(x) {
  return Math.atan(x);
}

function atan2(y, x) {
  return Math.atan2(y, x);
}

// Hyperbolic functions
function sinh(x) {
  return Math.sinh(x);
}

function cosh(x) {
  return Math.cosh(x);
}

function tanh(x) {
  return Math.tanh(x);
}

// Inverse hyperbolic functions
function asinh(x) {
  return Math.asinh(x);
}

function acosh(x) {
  return Math.acosh(x);
}

function atanh(x) {
  return Math.atanh(x);
}

// Trigonometric identities and utility functions
function sec(x) {
  return 1 / Math.cos(x);
}

function csc(x) {
  return 1 / Math.sin(x);
}

function cot(x) {
  return 1 / Math.tan(x);
}

// Convert between degrees and radians
function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

function toDegrees(radians) {
  return radians * (180 / Math.PI);
}

// Degree-based trigonometric functions
function sind(degrees) {
  return Math.sin(toRadians(degrees));
}

function cosd(degrees) {
  return Math.cos(toRadians(degrees));
}

function tand(degrees) {
  return Math.tan(toRadians(degrees));
}

// Additional math constants and functions
function pi() {
  return Math.PI;
}

function e() {
  return Math.E;
}

function abs(x) {
  return Math.abs(x);
}

function sqrt(x) {
  return Math.sqrt(x);
}

function pow(base, exponent) {
  return Math.pow(base, exponent);
}

function exp(x) {
  return Math.exp(x);
}

function log(x) {
  return Math.log(x);
}

function log10(x) {
  return Math.log10(x);
}

function log2(x) {
  return Math.log2(x);
}

function floor(x) {
  return Math.floor(x);
}

function ceil(x) {
  return Math.ceil(x);
}

function max(...numbers) {
  return Math.max(...numbers);
}

function min(...numbers) {
  return Math.min(...numbers);
}
