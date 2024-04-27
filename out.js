 const {rand, round, PI, floor, exp, degToRad, radToDeg} = require('./math')
 const {print, timer, Day, interval, read, write, appendFile, dirname} = require('./utils')
 const {AY} = require(__dirname +'/objects/AY');
  try {
for ( let i = 0; i < 20; i++ ) { 
i % 3 == 0 ? console.log('fizz')   : i % 5 == 0 ? console.log('buzz')   : console.log(i)   ; 
} 
print(dirname(), AY.type(AY), AY.type(dirname), AY.os, AY.argv[1]) 
const {ay} = require("./out2")    ; 
console.log(ay)   ; 
}catch(e){
 console.error(e.message);
}