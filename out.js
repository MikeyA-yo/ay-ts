 const {rand, round, PI, floor, exp, degToRad, radToDeg} = require('./math')
 const {print, timer, Day, interval, read, write, appendFile, dirname} = require('./utils')
  try {
print(dirname()); 
}catch(e){
 console.error(e.message);
}