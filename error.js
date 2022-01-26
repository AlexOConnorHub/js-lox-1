// Copyright (c) 2022 Alex O'Connor
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

function exit(line, errorNumber) {
    warn(line, errorNumber);
    process.exit(errorNumber);
}

function warn(line, errorNumber) {
    if (errorNumber != 0){
        console.log(`\x1b[6;31;40m[line ${line}] Error: ${codes[errorNumber]}\x1b[0m`);
    }
}

codes = {
    0   : "",
    62  : "Unterminated string",
    63  : "Unexpected character",
    64  : "Misuse of JSLoX",
    150 : "File does not exist",
    151 : "File read error"
}

module.exports = {
    exit,
    warn
};
