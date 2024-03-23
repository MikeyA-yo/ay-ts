 const {rand, round, PI, floor, exp, degToRad, radToDeg} = require('./math')
 const {print, timer, Day, interval, read, write, appendFile, dirname} = require('./utils')
  try {
for ( let i = 0; i < 200; i++){  
 i % 3 == 0 ? console.log('fizz')   : i % 5 == 0 ? console.log('buzz')   : console.log(i)   ; 
}  
print(dirname()); 
}catch(e){
 console.error(e.message);
}