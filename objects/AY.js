const AY = {
  isAy: true,
  type(b) {
    return typeof b;
  },
  os: process.platform,
  argv: process.argv.slice(1),
  print(...args) {
    let arg = "";
    args.forEach((ar) => {
      arg += ar;
      arg += " ";
    });
    console.log(arg);
  },
  read(out, mode) {
    return fs.readFileSync(out, mode);
  },
};
module.exports = {
  AY,
};
