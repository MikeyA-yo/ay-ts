let defined = [];
function isQuoted(str) {
  if (str.length >= 2) {
    // Check if the first and last characters are both quotation marks ;
    if (str.charAt(0) == '"' && str.charAt(str.length - 1) == '"') {
      return true; // String is quoted ;
    } else if (str.charAt(0) === "'" && str.charAt(str.length - 1) == "'") {
      return true; // String is quoted ;
    }
  }
  return false; // String is not quoted ;
}
function parseStr(inputString) {
  let regex = /(["'`])(.*?)\1|\S+/g;
  let matches = inputString.match(regex);
  if (matches) {
    return matches;
  } else {
    return [];
  }
}
function parse(codes) {
  return codes.split("\n");
}
function objectChecker(code) {
  let lines = parse(code);
  let lineCount;
  lines.forEach((line) => {
    let term = parseStr(line);
    for (let i = 0; i < term.length; i++) {
      if (!isQuoted(term[i]) && term[i].includes(".")) {
        //first get number of '.' that it indexes into ;
        let j;
        let numberOfObjectiveIndex;
        while (j < term[i].length) {
          if (term[i][j] == ".") numberOfObjectiveIndex++;
          j++;
        }
        //use number of '.' to get every object property ;
        if (numberOfObjectiveIndex == 1) {
          // object itself ;
          let obj = term[i].slice(0, term[i].indexOf("."));
          if (typeof obj != object) {
            console.log(`${obj} is not an object\n at ${lineCount}`);
            process.exit(1);
          }
          // prop ;
          let prop = term[i].slice(term[i].indexOf("."));
          let arrayOfProps = [];
          for (let key in obj) {
            arrayOfProps.push(key);
          }
          if (!arrayOfProps.includes(prop)) {
            console.log(
              `${prop} is not a property of ${obj}\n at ${lineCount}`
            );
          } else {
            return true;
          }
        }
        // to do handle multiple object cases ;
      }
    }
  });
  lineCount++;
}
module.exports = {objectChecker}