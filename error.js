let codes = {
    0   : "",
    62  : "Unterminated string",
    63  : "Unexpected character",
    64  : "Usage: generate_ast <output directory>",
    65  : "Misuse of JSLoX",
    70  : "Runtime error",
    71  : "Operands must be two numbers or two strings",
    72  : "Operand must be a number",
    73  : "Operands must be numbers",
    150 : "File does not exist",
    151 : "File read error"
}
class jsLoxError {
    constructor(lineNumber, error, errorNumber, token) {
        let err = "Error: ";
        while (error.indexOf('\b') == 0) {
            err = err.slice(0, -1);
            error = error.slice(1);
        }
        if (lineNumber != null) {
            this.message = `\x1b[6;31;40m[line ${lineNumber}] ${err}$error$\x1b[0m`;
        } else {
           this.message = `\x1b[6;31;40m${err}$error$\x1b[0m`;
        }
        if (typeof error == "string") {
            if (token != null) {
                this.message = this.message.replace("$error$", `at ${token.lexeme} ${message}`);
            } else {
                this.message = this.message.replace("$error$", error);
            }
        } else if (typeof error == "number") {
            this.message = this.message.replace("$error$", codes[error]);
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
