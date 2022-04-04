#! /usr/bin/env node
let { jsLoxError } = require('./error');
let { Scanner } = require("./Scanner");
let { Parser } = require("./Parser");
let { Interpreter } = require("./Interpreter");
class Lox {
    static interpreter = new Interpreter();
    hadError = false;
    hadRuntimeError = false;
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
        this.interpreter = new Interpreter();
        fs.readFile(path, (err, data) => {
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
            let ret = this.#run(toString(data));
            if (ret instanceof jsLoxError) {
                jsLoxError.warn(error.message);
            }
            jsLoxError.exit(0);
        });
    }

    #runPrompt() {
        this.interpreter = new Interpreter();
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
                let ret = this.#run(input);
                if (ret instanceof jsLoxError) {
                    jsLoxError.warn(ret.message);
                } else if (ret != 0) {
                    throw ret;
                }
                process.stdout.write("> ");
            }
        });
    }

    #run(source) {
        let scanner = new Scanner(source);
        let tokens = scanner.scanTokens();
        let parser = new Parser(tokens);
        let expression;
        try {
            expression = parser.parse();
        } catch (error) {
            // Stop if there was a syntax error.
            return error;
        }

        try {
            this.interpreter.interpret(expression);
        } catch (error) {
            return error;
        }

        return 0;
    }
}

var run = new Lox;
run.main();
