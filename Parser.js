const { Binary, Unary, Grouping, Literal } = require("./Expr");
const { TokenType } = require("./TokenType");

let { jsLoxError } = require("./error");
class Parser {
    constructor(tokens) {
        this.tokens = tokens;
        this.current = 0;
    }

    #equality() {
        let expr = this.#comparison();
    
        while (this.#match([TokenType.BANG_EQUAL, TokenType.EQUAL_EQUAL])) {
            let operator = this.#previous();
            let right = this.#comparison();
            expr = new Binary(expr, operator, right);
        }
    
        return expr;
    }

    #comparison() {
        let expr = this.#term();
    
        while (this.#match([TokenType.GREATER, TokenType.GREATER_EQUAL, TokenType.LESS, TokenType.LESS_EQUAL])) {
            let operator = this.#previous();
            let right = this.#term();
            expr = new Binary(expr, operator, right);
        }
    
        return expr;
    }
    
    #factor() {
        let expr = this.#unary();
    
        while (this.#match([TokenType.SLASH, TokenType.STAR])) {
            let operator = this.#previous();
            let right = this.#unary();
            expr = new Binary(expr, operator, right);
        }
    
        return expr;
    }

    #unary() {
        if (this.#match([TokenType.BANG, TokenType.MINUS])) {
          let operator = this.#previous();
          let right = this.#unary();
          return new Unary(operator, right);
        }
    
        return this.#primary();
    }

    #primary() {
        if (this.#match([TokenType.FALSE])) return new Literal(false);
        if (this.#match([TokenType.TRUE])) return new Literal(true);
        if (this.#match([TokenType.NIL])) return new Literal(null);
    
        if (this.#match([TokenType.NUMBER, TokenType.STRING])) {
          return new Literal(this.#previous().literal);
        }
    
        if (this.#match([TokenType.LEFT_PAREN])) {
          let expr = this.#expression();
          this.#consume(TokenType.RIGHT_PAREN, "Expect ')' after expression.");
          return new Grouping(expr);
        }

        throw this.#error(this.#peek(), "Expect expression.");
      }

    #term() {
        let expr = this.#factor();
    
        while (this.#match([TokenType.MINUS, TokenType.PLUS])) {
          let operator = this.#previous();
          let right = this.#factor();
          expr = new Binary(expr, operator, right);
        }
    
        return expr;
    }
    
    #match(types) {
        for (let type of types) {
            if (this.#check(type)) {
                this.#advance();
                return true;
            }
        }
        return false;
    }
    
    #check(type) {
        if (this.#isAtEnd()) return false;
        return this.#peek().type == type;
    }

    #advance() {
        if (!this.#isAtEnd()) this.current++;
        return this.#previous();
    }

    #isAtEnd() {
        return this.#peek().type == TokenType.EOF;
    }
    
    #peek() {
        return this.tokens[this.current];
    }
    
    #previous() {
        return this.tokens[this.current - 1];
    }

    #expression() {
        return this.#equality();
    }
    
    #consume( type, message) {
        if (this.#check(type)) return this.#advance();

        throw this.#error(this.#peek(), message);
    }

    #error(token, message) {
        if (token.type == TokenType.EOF) {
            return (new jsLoxError(token.line, `${message} at end."`));
        } else {
            return (new jsLoxError(token.line, message, token));
        }
    }

    #synchronize() {
        this.#advance();
    
        while (!this.#isAtEnd()) {
          if (this.#previous().type == TokenType.SEMICOLON) return;
    
          switch (this.#peek().type) {
            case TokenType.CLASS:
            case TokenType.FUN:
            case TokenType.VAR:
            case TokenType.FOR:
            case TokenType.IF:
            case TokenType.WHILE:
            case TokenType.PRINT:
            case TokenType.RETURN:
              return;
          }
    
          this.#advance();
        }
    }
    
    parse() {
        try {
          return this.#expression();
        } catch (error) {
          throw error;
        }
      }
}

module.exports = { Parser };
