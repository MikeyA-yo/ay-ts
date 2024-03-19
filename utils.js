const fs = require('node:fs');
const path = require('node:path');
function print(...a){
    let b= '';
    a.forEach( te =>{
      b += te;
      b += ' ';  
    })
    console.log(b);
}
function timer(cb, ms){
  return setTimeout(cb, ms);
}
function interval(cb, ms){
  return setInterval(cb,ms);
}
class Day extends Date{
    getFormattedDate() {
        const months = [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ];
        return `${this.getDate()}-${months[this.getMonth()]}-${this.getFullYear()}`;
      }
    time(){
        return this.toLocaleTimeString();
    }
    getFullDate(){
        return this.toLocaleDateString();
    } 
    getFormalDate(){
        return this.toDateString();
    } 
}
function read(out, mode){
  return fs.readFileSync(out, mode);
}
function write(path, data){
  return fs.writeFileSync(path, data);
}
function appendFile(path, data){
  return fs.appendFileSync(path, data);
}
function dirName(p){
   return path.dirname(p);
}
module.exports = {
    print,
    timer,
    Day,
    interval,
    read,
    write,
    appendFile,
    dirName
}