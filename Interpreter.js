const { jsLoxError } = require("./error");
const { TokenType } = require("./TokenType");
const { Environment } = require("./Environment");

class Interpreter {
    #environment;
    constructor() {
        this.#environment = new Environment();
    }
    interpret(statements) { 
        try {
            for (let statement of statements) {
                this.#execute(statement);
            }
        } catch (error) {
            throw error
        }
    }
    
    #stringify(object) {
        return (object == null) ? "nil" : String(object);    
    }

    visitLiteralExpr(expr) {
        return expr.value;
    }

    visitGroupingExpr(expr) {
        return this.#evaluate(expr.expression);
    }

    visitUnaryExpr(expr) {
        let right = this.#evaluate(expr.right);
        switch (expr.operator.type) {
            case TokenType.BANG:
                return !this.#isTruthy(right);
            case TokenType.MINUS:
                this.#checkNumberOperand(expr.operator, right);
                return -right;
        }
        return null;
    }

    visitBinaryExpr(expr) {
        let left = this.#evaluate(expr.left);
        let right = this.#evaluate(expr.right); 
        switch (expr.operator.type) {
            case TokenType.GREATER:
                this.#checkNumberOperands(expr.operator, left, right);
                return left > right;
            case TokenType.GREATER_EQUAL:
                this.#checkNumberOperands(expr.operator, left, right);
                return left >= right;
            case TokenType.LESS:
                this.#checkNumberOperands(expr.operator, left, right);
                return left < right;
            case TokenType.LESS_EQUAL:
                this.#checkNumberOperands(expr.operator, left, right);
                return left <= right;
            case TokenType.MINUS:
                this.#checkNumberOperands(expr.operator, left, right);
                return left - right;
            case TokenType.SLASH:
                this.#checkNumberOperands(expr.operator, left, right);
                return left / right;
            case TokenType.STAR:
                this.#checkNumberOperands(expr.operator, left, right);
                return left * right;
            case TokenType.PLUS:
                if (typeof left == "number" && typeof right == "number") {
                    return left + right;
                } else if (typeof left == "string" && typeof right == "string") {
                    return left + right;
                }                
                throw new jsLoxError(-1, 71); // TODO: Actually get lineNumber
            case TokenType.BANG_EQUAL: 
                return !this.#isEqual(left, right);
            case TokenType.EQUAL_EQUAL: 
                return this.#isEqual(left, right);

        }
        // Unreachable.
        return null;
    }

    visitVarStmt(stmt) {
        let value = null;
        if (stmt.initializer != null) {
            value = this.#evaluate(stmt.initializer);
        }
        this.#environment.define(stmt.name.lexeme, value);
        return null;
    }

    visitVariableExpr(expr) {
        return this.#environment.get(expr.name);
    }

    visitExpressionStmt(stmt) {
        this.#evaluate(stmt.expression);
        return null;
    }

    visitPrintStmt(stmt) {
        let value = this.#evaluate(stmt.expression);
        console.log(this.#stringify(value));
        return null;
    }

    visitBlockStmt(stmt) {
        this.executeBlock(stmt.statements, new Environment(this.#environment));
        return null;
    }

    visitAssignExpr(expr) {
        let value = this.#evaluate(expr.value);
        this.#environment.assign(expr.name, value);
        return value;
    }

    executeBlock( statements, environment) {
        let previous = this.#environment;
        try {
            this.#environment = environment;
            for (let statement of statements) {
                this.#execute(statement);
            }
        } finally {
            this.#environment = previous;
        }
    }

    #execute(stmt) {
        stmt.accept(this);
    }

    #checkNumberOperand(operator, operand) {
        if (typeof operand == "number") return;
        throw new jsLoxError(-1, 72); // TODO: Actually get lineNumber
    }

    #checkNumberOperands( operator, left, right) {
        if (typeof left == "number" && typeof right == "number") return;
        throw new jsLoxError(-1, 73); // TODO: Actually get lineNumber
    }

    #evaluate(expr) {
        return expr.accept(this);
    }

    #isTruthy(object) {
        if (object == null) return false;
        if (typeof object == "boolean") return object;
        return true;
    }

    #isEqual(a, b) {
        if (a == null && b == null) return true;
        if (a == null) return false;
    
        return a == b;
    }
}

module.exports = {
    Interpreter
};
