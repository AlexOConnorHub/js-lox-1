#! /usr/bin/env node
// Copyright (c) 2022 Alex O'Connor
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

const {exit, warn} = require('./error');
const { Scanner } = require("./Scanner");
let reader;
class Lox {
    main() {
        if (process.argv.length > 3) {
            console.log("Usage: jlox [script]");
            exit(codes["MISUSE_OF_JSLOX"])
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
        reader = require("readline").createInterface({
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
        // For now, just print the tokens.
        if ((tokens != 0) && (typeof tokens == "number")) {
            return tokens;
        }
        console.log(tokens);
        tokens.forEach(token => {
            console.log(token.toString());
        });
        return 0;
    }
}

var run = new Lox;
run.main();
