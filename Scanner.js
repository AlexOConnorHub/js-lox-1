// Copyright (c) 2022 Alex O'Connor
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

const TokenType = require("./TokenType")

class Scanner {
    constructor(source){
        this.#source = source;
        this.#tokens = Array();
    }

    scanTokens() {
        while (!isAtEnd()) {
          // We are at the beginning of the next lexeme.
          start = current;
          scanToken();
        }
    
        this.#tokens.push(new Token(EOF, "", null, line));
        return tokens;
      }
}
  