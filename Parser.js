const { Expr, Binary, Grouping, Literal, Unary } = require("./Expr");

class Parser {
    constructor(tokens) {
        super();
        this.#tokens = tokens;
        this.#current = 0;
    }

    #equality() {
        let expr = this.#comparison();
    
        while (this.#match(BANG_EQUAL, EQUAL_EQUAL)) {
            let operator = this.#previous();
            let right = this.#comparison();
            expr = new Binary(expr, operator, right);
        }
    
        return expr;
    }

    #comparison() {
        let expr = this.#term();
    
        while (this.#match(GREATER, GREATER_EQUAL, LESS, LESS_EQUAL)) {
            let operator = this.#previous();
            let right = this.#term();
            expr = new Binary(expr, operator, right);
        }
    
        return expr;
    }
    
    #factor() {
        let expr = this.#unary();
    
        while (this.#match(SLASH, STAR)) {
            let operator = previous();
            let right = unary();
            expr = new Binary(expr, operator, right);
        }
    
        return expr;
    }

    #unary() {
        if (this.#match(BANG, MINUS)) {
          let operator = previous();
          let right = unary();
          return new Expr.Unary(operator, right);
        }
    
        return this.#primary();
    }

    #term() {
        let expr = factor();
    
        while (this.#match(MINUS, PLUS)) {
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
  }