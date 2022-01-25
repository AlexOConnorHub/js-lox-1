#! /usr/bin/env node
// Copyright (c) 2022 Alex O'Connor
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

const {exit} = require('./error');
let reader;
class Lox {
    main() {
        if (process.argv.length > 3) {
            console.log("Usage: jlox [script]");
            exit(codes["MISUSE_OF_JSLOX"])
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
                    exit(codes["FILE_DOES_NOT_EXIST"])
                } else {
                    exit(codes["FILE_READ_ERROR"])
                }
                return;
            }

            this.#run(toString(data));
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
                exit("EXIT");
            } else {
                this.#run(input);
                process.stdout.write("> ");
            }
        });
    }

    #run(source) {
        // console.log(source);
        // var scanner = new Scanner(source);
        // var tokens = scanner.scanTokens();
    
        // // For now, just print the tokens.
        // tokens.forEach(token => {
        //     System.out.println(token);            
        // });
    }
}

var run = new Lox;
run.main();
