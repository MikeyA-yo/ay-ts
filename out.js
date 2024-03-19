 const {rand, round, PI, floor, exp, degToRad, radToDeg} = require('./math')
 const {print, timer, Day, interval, read, write, appendFile, dirName} = require('./utils')
 function dirname(){
    return dirName('/myprogram.ay')
} try {
print(dirname()); 
}catch(e){
 console.error(e.message);
}