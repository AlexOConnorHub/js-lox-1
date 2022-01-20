// Copyright (c) 2022 Alex O'Connor
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

function exit(error) {
    console.log(`\x1b[6;31;40m${error}\x1b[0m`);
    process.exit(codes[error]);
}

codes = {
    "MISUSE_OF_JSLOX"     : 64,
    "FILE_DOES_NOT_EXIST" : 150,
    "FILE_READ_ERROR"     : 151,
    "EXIT_PROMPT"         : 0
}

module.exports = {
    exit
};
