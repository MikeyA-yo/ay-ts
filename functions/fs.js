const { readFileSync, writeFileSync } = require("node:fs");

function read(path, options = "utf-8"){
    return readFileSync(path, options)
}

function write(file, data){
    return writeFileSync(file, data);
}