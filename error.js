// Copyright (c) 2022 Alex O'Connor
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

function exit(errorNumber) {
    console.log(`\x1b[6;31;40m${errorNumber}\x1b[0m`);
}

codes = {
    "MISUSE_OF_JSLOX"     : 64,
    "FILE_DOES_NOT_EXIST" : 150,
    "FILE_READ_ERROR"     : 151
}

module.exports = {
    codes,
    exit
};
