class AstPrinter  {
    print(expr) {   
        return expr.accept(this);
    }

    visitBinaryExpr (expr) {
        return this.#parenthesize(expr.operator.lexeme, expr.left, expr.right);
    }

    visitGroupingExpr (expr) {
        return this.#parenthesize("group", expr.expression);
    }

    visitLiteralExpr (expr) {
        if (expr.value == null) return "nil";
        return expr.value.toString();
    }

    visitUnaryExpr (expr) {
        return this.#parenthesize(expr.operator.lexeme, expr.right);
    } 

    #parenthesize(theName) {
        let exprs = Array.prototype.slice.call(arguments, 1)
        let data = `(${theName}`;
        exprs.forEach(expr => {
            data += ` ${expr.accept(this)}`;
        });
        data += ")";
        return data;
    }
}

module.exports = { AstPrinter };
