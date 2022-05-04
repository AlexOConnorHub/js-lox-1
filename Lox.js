let { jsLoxError } = require('./error');
let { Scanner } = require("./Scanner");
let { Parser } = require("./Parser");
let { Interpreter } = require("./Interpreter");
class Lox {
    static interpreter = new Interpreter();
    main() {
        if (process.argv.length > 3) {
            let err = new jsLoxError(-1, 65);
            jsLoxError.exit(err.exitCode, err.message);
            return;
        } else if (process.argv.length == 3) {
            this.#runFile(process.argv[2]);
        } else {
            this.#runPrompt();
        }
    }

    #runFile(path) {
        require("fs").readFile(path, (err, data) => {
            if (err) {
                if (err["code"] == "ENOENT") {
                    let err = new jsLoxError(-1, 150);
                    jsLoxError.exit(err.exitCode, err.message);
                } else {
                    let err = new jsLoxError(-1, 151);
                    jsLoxError.exit(err.exitCode, err.message);
                }
                return;
            }
            try {
                this.#run(data.toString());
                jsLoxError.exit(0);
            } catch (error) {
                this.#processErrorRaw(error, true);
            }
        });
    }

    #runPrompt() {
        let reader = require("readline").createInterface({
            input: process.stdin,
            output: process.stdout,
            terminal: true,
            prompt: "> ",
            historySize: 30
        });
        process.stdout.write("> ");
        reader.on('line', (input) => {
            if (input == null){
                jsLoxError.exit(0);
            } else {
                try {
                    this.#run(input);
                } catch (error) {
                    this.#processErrorRaw(error, false);
                }
                process.stdout.write("> ");
            }
        });
    }

    #run(source) {
        let scanner = new Scanner(source);
        let parser = new Parser(scanner.scanTokens());
        let statements = parser.parse();
        Lox.interpreter.interpret(statements);
    }

    #processErrorRaw(errors, toExit) {
        if (Array.isArray(errors)) {
            for (let error of errors) {
                if (errors.indexOf(error) == errors.length - 1) {
                    this.#handlejsLoxError(error, toExit);
                } else if(!this.#handlejsLoxError(error, false)) {
                    console.warn(error);
                    console.warn("WARNING: ERROR CAUGHT WAS NOT jsLoxError");
                }
            };
        } else {
            if (this.#handlejsLoxError(errors, toExit)) {
                return;
            }
            console.warn(errors);
            console.warn("WARNING: ERROR CAUGHT WAS NOT jsLoxError");
        }
    }

    #handlejsLoxError(error, toExit) {
        if (error instanceof jsLoxError) {
            if (toExit) {
                jsLoxError.exit(error.exitCode, error.message);
            } else {
                jsLoxError.warn(error.message);
            }
            return true;
        } else {
            console.warn(error);
            console.warn("WARNING: ERROR CAUGHT WAS NOT jsLoxError");
        }
        return false;
    }
}

module.exports = { Lox };
