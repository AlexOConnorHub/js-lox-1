import { default as Token } from "./Token";
import _default from "./Expr";
const { Expr, Binary, Grouping, Literal, Unary } = _default;
const TokenType = require("./TokenType").default.TokenType;
import { exit, warn } from "./error";
class Parser {
    constructor(tokens) {
        super();
        this.#tokens = tokens;
        this.#current = 0;
    }

    #equality() {
        let expr = this.#comparison();
    
        while (this.#match(TokenType.BANG_EQUAL, TokenType.EQUAL_EQUAL)) {
            let operator = this.#previous();
            let right = this.#comparison();
            expr = new Binary(expr, operator, right);
        }
    
        return expr;
    }

    #comparison() {
        let expr = this.#term();
    
        while (this.#match(TokenType.GREATER, TokenType.GREATER_EQUAL, TokenType.LESS, TokenType.LESS_EQUAL)) {
            let operator = this.#previous();
            let right = this.#term();
            expr = new Binary(expr, operator, right);
        }
    
        return expr;
    }
    
    #factor() {
        let expr = this.#unary();
    
        while (this.#match(TokenType.SLASH, TokenType.STAR)) {
            let operator = this.#previous();
            let right = this.#unary();
            expr = new Binary(expr, operator, right);
        }
    
        return expr;
    }

    #unary() {
        if (this.#match(TokenType.BANG, TokenType.MINUS)) {
          let operator = this.#previous();
          let right = this.#unary();
          return new Expr.Unary(operator, right);
        }
    
        return this.#primary();
    }

    #primary() {
        if (this.#match(TokenType.FALSE)) return new Expr.Literal(false);
        if (this.#match(TokenType.TRUE)) return new Expr.Literal(true);
        if (this.#match(TokenType.NIL)) return new Expr.Literal(null);
    
        if (this.#match(TokenType.NUMBER, TokenType.STRING)) {
          return new Expr.Literal(this.#previous().literal);
        }
    
        if (this.#match(LEFT_PAREN)) {
          let expr = this.#expression();
          this.#consume(TokenType.RIGHT_PAREN, "Expect ')' after expression.");
          return new Expr.Grouping(expr);
        }
      }

    #term() {
        let expr = this.#factor();
    
        while (this.#match(TokenType.MINUS, TokenType.PLUS)) {
          let operator = this.#previous();
          let right = this.#factor();
          expr = new Binary(expr, operator, right);
        }
    
        return expr;
    }
    
    #match(types) {
        types.forEach(type => {
            if (this.#check(type)) {
                this.#advance();
                return true;
            }            
        }); 
        return false;
    }
    
    #check(type) {
        if (this.#isAtEnd()) return false;
        return this.#peek().type == type;
    }

    #advance() {
        if (!this.#isAtEnd()) this.#current++;
        return this.#previous();
    }

    #isAtEnd() {
        return this.#peek().type == EOF;
    }
    
    #peek() {
        return this.#tokens.get(this.#current);
    }
    
    #previous() {
        return this.#tokens.get(this.#current - 1);
    }

    #expression() {
        return this.#equality();
    }
    
    #consume( type, message) {
        if (this.#check(type)) return this.#advance();

        this.#error(this.#peek(), message);
    }

    #error(token, message) {
        if (token.type == TokenType.EOF) {
            warn(token.line, " at end", message);
        } else {
            warn(token.line, " at '" + token.lexeme + "'", message);
        }
        return new this.ParseError();
    }

    static error(token, message) {
        if (token.type == TokenType.EOF) {
          report(token.line, " at end", message);
        } else {
          report(token.line, " at '" + token.lexeme + "'", message);
        }
    }
}

export default {
    Parser
};