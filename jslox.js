#! /usr/bin/env node
// Copyright (c) 2022 Alex O'Connor
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

const fs = require('graceful-fs');
const {exit, codes} = require('./error');
const readline = require('readline');

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
        var rl = readline.createInterface(process.stdin, process.stdout);
        var exit = false;
        while (!exit) {
            rl.question("> ", (line) => {
                if (line == null){
                    exit = true;
                } else {
                    this.#run(line);
                }
            });
        }
    }

    #run(source) {
        var scanner = new Scanner(source);
        var tokens = scanner.scanTokens();
    
        // For now, just print the tokens.
        tokens.forEach(token => {
            System.out.println(token);            
        });
    }
}

var run = new Lox;
run.main();
