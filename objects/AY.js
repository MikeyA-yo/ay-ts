const AY = {
    isAy : true,
    type(b){
        return typeof b;
    },
    os: process.platform,
    argv: process.argv.slice(1)
}
module.exports = {
    AY
}