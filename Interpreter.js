const TokenType = require("./TokenType").default.TokenType;

class Interpreter {

    interpret(expression) { 
        try {
            value = this.#evaluate(expression);
            console.log(this.#stringify(value));
        } catch (error) {
            // Lox.runtimeError(error);
        }
    }
    
    #stringify(object) {
        return (object == null)? "nil": String(object);    
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
        left = this.#evaluate(expr.left);
        right = this.#evaluate(expr.right); 

        switch (expr.operator.type) {
            case GREATER:
                this.#checkNumberOperands(expr.operator, left, right);
                return left > right;
            case GREATER_EQUAL:
                this.#checkNumberOperands(expr.operator, left, right);
                return left >= right;
            case LESS:
                this.#checkNumberOperands(expr.operator, left, right);
                return left < right;
            case LESS_EQUAL:
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
            case PLUS:
                if (typeof left == "double" && typeof right == "double") {
                    return left + right;
                } else if (typeof left == string && typeof right == string) {
                    return left + right;
                }                
                throw "Operands must be two numbers or two strings.";
            case TokenType.BANG_EQUAL: 
                return !this.#isEqual(left, right);
            case TokenType.EQUAL_EQUAL: 
                return this.#isEqual(left, right);

        }

        // Unreachable.
        return null;
    }

    #checkNumberOperand(operator, operand) {
        if (typeof operand == double) return;
        throw "Operand must be a number.";
    }

    #checkNumberOperands( operator, left, right) {
        if (typeof left == "double" && typeof right == "double") return;
        throw "Operands must be numbers.";
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
