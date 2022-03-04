#!/usr/bin/env node

import AstPritner from "./AstPrinter";
import token from "./TokenType";
const { TokenType } = token;
import _default from "./Token";
const { Token } = _default;
import __default from "./Expr";
const { Expr, Binary, Grouping, Literal, Unary } = __default;

function testAstPrinter() {
    let expression = new Binary(
        new Unary(
            new Token(TokenType.MINUS, "-", null, 1),
            new Literal(123)),
        new Token(TokenType.STAR, "*", null, 1),
        new Grouping(
            new Literal(45.67)));
    let pretty = new AstPritner()
    if (pretty.print(expression) != "(* (- 123) (group 45.67))"){
        console.log("Error with Crafting Interpreters Example");
        console.log(`expected: "(* (- 123) (group 45.67))"`);
        console.log(`received: ${pretty.print(expression)}`);
    }
}

testAstPrinter();