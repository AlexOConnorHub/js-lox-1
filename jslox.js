#! /usr/bin/env node
// Copyright (c) 2022 Alex O'Connor
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

const fs = require('fs');
const {exit} = require('./error');

class Lox {
    main() {
        if (process.argv.length > 3) {
            console.log("Usage: jlox [script]");
            exit("MISUSE_OF_JSLOX")
        } else if (process.argv.length == 3) {
            this.#runFile(process.argv[2]);
        } else {
            this.#runPrompt();
        }   
    }

    #runFile(path) {
        var file = fs.readFileSync(path, 'utf8');
        this.#run(file);
    }

    async #runPrompt(path) {
        const rl = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout,
            terminal: false
        });
        const it = rl[Symbol.asyncIterator]();
        var line = await it.next();
        while(line["done"]) {
            console.log(line["value"]);
            this.#run(line["value"]);
            var line = await it.next();
        }
    }

    #run(source) {
        console.log(source);
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
