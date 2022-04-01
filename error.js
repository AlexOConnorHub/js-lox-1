#!/usr/env/bin node

class jsLoxError {
    constructor(line, message, errorNumber) {
        this.errorMessage = message;
        this.errorNumber = errorNumber;
        this.line = line;
        this.message = `\x1b[6;31;40m[line ${line}] Error: ${codes[errorNumber]}\x1b[0m`;
    }

    static exit(line, errorNumber) {
        warn(line, errorNumber);
        process.exit(errorNumber);
    }

    static warn(line, errorNumber) {
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
        70  : "Runtime error",
        150 : "File does not exist",
        151 : "File read error"
    }
}

module.exports = {
    jsLoxError
};
