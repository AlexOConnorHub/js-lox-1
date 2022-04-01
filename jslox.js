#! /usr/bin/env node
let { jsLoxError } = require('./error');
let { Scanner } = require("./Scanner");
let { Parser } = require("./Parser");
let { Interpreter } = require("./Interpreter");
let { AstPrinter } = require("./AstPrinter");
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
                    jsLoxError.warn(error.message);
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

        console.log(new AstPrinter().print(expression));

        // For now, just print the tokens.
        if ((tokens != 0) && (typeof tokens == "number")) {
            return tokens;
        }
        tokens.forEach(token => {
            console.log(token.toString());
        });
        try {
            interpreter.interpret(expression);
        } catch (error) {
            return error;
        }

        return 0;
    }
}

var run = new Lox;
run.main();
