function rand(min = 0, max = 0) {
  return Math.random() * (max - min + 1) + min
}

function randInt(min = 0, max = 0) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function round(num, precision = 0) {
  return Math.round(num * Math.pow(10, precision)) / Math.pow(10, precision);
}