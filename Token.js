// Copyright (c) 2022 Alex O'Connor
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

const TokenType = require("./TokenType");

class Token {  
    constructor(type, lexeme, literal, line){
      this.type = type;
      this.lexeme = lexeme;
      this.literal = literal;
      this.line = line;
    }

    toString() {
      return type + " " + lexeme + " " + literal;
    }
  }
  
  module.exports = {
      Token
  }