function isQuoted(str){
    if (str.length >= 2) {
       // Check if the first and last characters are both quotation marks
       if (str.charAt(0) == '"' && str.charAt((str.length - 1)) == '"') {
           return true; // String is quoted
       } else if (str.charAt(0) === "'" && str.charAt((str.length - 1)) == "'") {
           return true; // String is quoted
       }
   }
   return false; // String is not quoted
}
console.log("'hello'".indexOf('l'))