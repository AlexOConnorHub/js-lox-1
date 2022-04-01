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
            jsLoxError.exit(65)
            return;
        } else if (process.argv.length == 3) {
            let err_code = this.#runFile(process.argv[2]);
        } else {
            this.#runPrompt();
        }   
    }

    #runFile(path) {
        fs.readFile(path, (err, data) => {
            if (err) {
                if (err["code"] == "ENOENT") {
                    jsLoxError.exit(-1, 150);
                } else {
                    jsLoxError.exit(-1, 151);
                }
                return;
            }
            this.#run(toString(data));
            // Handle error
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
                this.#run(input);
                // Handle error

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
