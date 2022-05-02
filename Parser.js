const { Assign, Binary, Unary, Grouping, Literal, Variable } = require("./Expr");
const { Block, Expression, Print, Var } = require("./Stmt");
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

        if (this.#match([TokenType.IDENTIFIER])) {
            return new Variable(this.#previous());
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
        return this.#assignment();
    }
    
    #consume( type, message) {
        if (this.#check(type)) return this.#advance();

        throw this.#error(this.#peek(), message);
    }

    #error(token, message) {
        if (token.type == TokenType.EOF) {
            return (new jsLoxError(token.line, `\b\b at end: ${message}"`));
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

    #assignment() {
        let expr = this.#equality();
        if (this.#match([TokenType.EQUAL])) {
            let equals = this.#previous();
            let value = this.#assignment();
    
            if (typeof expr == Variable) {
                return new Assign(expr.name, value);
            }
            throw [equals, "Invalid assignment target.",]; 
        }
    
        return expr;
    }
    
    parse() {
        let statements = [];
        while (!this.#isAtEnd()) {
            statements.push(this.#declaration());
            // statements.push(this.#statement());
        }
        return statements; 
    }

    #declaration() {
        try {
            if (this.#match([TokenType.VAR])) {
                return this.#varDeclaration();
            }
            return this.#statement();
        } catch (error) {
            this.#synchronize();
            return null;
        }
    }

    #varDeclaration() {
        let name = this.#consume(TokenType.IDENTIFIER, "Expect variable name.");
        let initializer = null;
        if (this.#match([TokenType.EQUAL])) {
            initializer = this.#expression();
        }
        // var hell = "Anywhere near Alex!";
        this.#consume(TokenType.SEMICOLON, "Expect ';' after variable declaration.");
        return new Var(name, initializer);
    }

    #statement() {
        if (this.#match([TokenType.PRINT])) {
            return this.#printStatement();
        }
        if (this.#match([TokenType.LEFT_BRACE])) {
            return new Block(this.#block());
        }
        return this.#expressionStatement();
    }

    #printStatement() {
        let value = this.#expression();
        this.#consume(TokenType.SEMICOLON, "Expect ';' after value.");
        return new Print(value);
    }    
    
    #expressionStatement() {
        let expr = this.#expression();
        this.#consume(TokenType.SEMICOLON, "Expect ';' after expression.");
        return new Expression(expr);
    }

    #block() {
        let statements = [];
    
        while (!this.#check(TokenType.RIGHT_BRACE) && !this.#isAtEnd()) {
            statements.push(this.#declaration());
        }
    
        this.#consume(TokenType.RIGHT_BRACE, "Expect '}' after block.");
        return statements;
    }
}

module.exports = { Parser };
