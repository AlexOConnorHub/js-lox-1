#!/usr/env/bin node

function exit(line, errorNumber) {
    warn(line, errorNumber);
    process.exit(errorNumber);
}

function warn(line, errorNumber) {
    if (errorNumber != 0){
        console.error(`\x1b[6;31;40m[line ${line}] Error: ${codes[errorNumber]}\x1b[0m`);
    }
}

codes = {
    0   : "",
    62  : "Unterminated string",
    63  : "Unexpected character",
    64  : "Usage: generate_ast <output directory>",
    65  : "Misuse of JSLoX",
    150 : "File does not exist",
    151 : "File read error"
}

module.exports = {
    exit,
    warn
};
