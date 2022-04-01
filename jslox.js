#! /usr/bin/env node

let { exit, warn } = require('./error');
let { Scanner } = require("./Scanner");
let { Parser } = require("./Parser");
let { Interpreter } = require("./Interpreter");
let { AstPrinter } = require("./AstPrinter");
class Lox {
    static interpreter = new Interpreter();
    // hadError
    // hadRuntimeError
    main() {
        if (process.argv.length > 3) {
            exit(65)
            return;
        } else if (process.argv.length == 3) {
            let err_code = this.#runFile(process.argv[2]);
            if (err_code != 0) {
                exit(err_code)
            }
        } else {
            this.#runPrompt();
        }   
    }

    #runFile(path) {
        fs.readFile(path, (err, data) => {
            if (err) {
                if (err["code"] == "ENOENT") {
                    exit(-1, 150);
                } else {
                    exit(-1, 151);
                }
                return;
            }
            exit(this.#run(toString(data)))
        });
    }

    #runPrompt(path) {
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
                exit(0);
            } else {
                warn(0, this.#run(input));
                process.stdout.write("> ");
            }
        });
    }

    #run(source) {
        let scanner = new Scanner(source);
        let tokens = scanner.scanTokens();
        let parser = new Parser(tokens);
        let expression = parser.parse();

        // Stop if there was a syntax error.
        if (hadError) return;

        console.log(new AstPrinter().print(expression));

        // For now, just print the tokens.
        if ((tokens != 0) && (typeof tokens == "number")) {
            return tokens;
        }
        tokens.forEach(token => {
            console.log(token.toString());
        });

        interpreter.interpret(expression);

        return 0;
    }
}

var run = new Lox;
run.main();
