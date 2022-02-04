#!/usr/bin/env node

const {TokenType} = require("./TokenType");
const {Token} = require("./Token");
const { Expr, Binary, Grouping, Literal, Unary } = require("./Expr")


class AstPrinter {
    print(expr) {
        return expr.accept(this)
    }

    visitBinaryExpr(expr) {
        return parenthesize(expr.operator.lexeme,
            expr.left, expr.right);
    }
    
    visitGroupingExpr(expr) {
        return parenthesize("group", expr.expression);
    }
    
    visitLiteralExpr(expr) {
        if (expr.value == null) return "nil";
        return expr.value.toString();
    }

    visitUnaryExpr(expr) {
        return parenthesize(expr.operator.lexeme, expr.right);
    } 

    #parenthesize(name, exprs) {
        data = `(${name}`;

        exprs.forEach(expr => {
            data += " ";
            data += expr.accept(this);
        });
        data += ")";
    
        return data;
    }
}

function main(args) {
    expression = new Binary(
        new Unary(
            new Token(TokenType.MINUS, "-", null, 1),
            new Literal(123)),
        new Token(TokenType.STAR, "*", null, 1),
        new Grouping(
            new Literal(45.67)));

    console.log(new AstPrinter().print(expression));
}

main();