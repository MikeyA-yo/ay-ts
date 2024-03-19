 function rand(min = 0, max = 0){
  if(min && max){
    const num = Math.random() * (max - min + 1) + min;
    return num;
  }
    return Math.random();
  }
  function round(a){
    return Math.round(a);
  }
  function PI(){
    return Math.PI;
  }
  function floor(a){
    return Math.floor(a);
  }
  function exp(a,b){
    return Math.pow(a, b);
  }
  function degToRad(degrees) {
    return degrees * (Math.PI / 180);
  }
  
  function radToDeg(rad) {
    return rad / (Math.PI / 180);
  }
  
  module.exports = {
    rand,
    round, 
    PI,
    floor,
    exp,
    degToRad,
    radToDeg
  }