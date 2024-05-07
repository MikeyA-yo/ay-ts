 const {rand, round, PI, floor, exp, degToRad, radToDeg} = require('./math')
 const {print, timer, Day, interval, read, write, appendFile, dirname} = require('./utils')
 const {AY} = require(__dirname +'/objects/AY');
  try {
let a = "my program variables are nicely scoped" ; 
console.log(a)   ; 
let b = "hello world" ; 
let c = 3 + 3 ; 
let d = round(rand() * 12) ; 
function print5(){ 
for ( let i = 0; i < 5; i++ ) { 
let b2 = round(rand() * 5) ; 
if (d > c){ 
console.log(b)   ; 
}else{ 
print(b2) ; 
} 
} 
} 
print5() ; 
let today = new Day() ; 
let time = today.time() ; 
//l data = read('semi.js') ; 
//write('new.js', data) 
print(`${today.getFullDate()} - ${time}`) 
const {ay} = require("./out2")    ; 
ay.some ; 
}catch(e){
 console.error(e.message);
}