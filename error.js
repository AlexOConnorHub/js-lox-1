let codes = {
    0   : "",
    62  : "Unterminated string",
    63  : "Unexpected character",
    64  : "Usage: generate_ast <output directory>",
    65  : "Misuse of JSLoX",
    70  : "Runtime error",
    150 : "File does not exist",
    151 : "File read error"
}
class jsLoxError {
    constructor(lineNumber, error, errorNumber, token) {
        if (lineNumber != null) {
            this.message == `\x1b[6;31;40m[line ${line}] Error: $error$\x1b[0m`;
        } else {
            `\x1b[6;31;40mError: $error$\x1b[0m`;
        }
        if (typeof error == "string") {
            if (token != null) {
                this.message.replace("$error$", `at ${token.lexeme} ${message}`);
            } else {
                this.message.replace("$error$", error);
            }
        } else if (typeof error == "number") {
                this.message.replace("$error$", codes[error]);
                this.exitCode = errorNumber;
        }
        if (errorNumber != null) {
            this.exitCode = errorNumber;
        }
    }

    static exit(exitCode, message) {
        if (exitCode != 0) {
            this.warn(message);
        }
        process.exit(exitCode);
    }

    static warn(message) {
        console.error(message);
    }
}

module.exports = {
    jsLoxError
};
