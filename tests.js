#!/usr/bin/env node
let { AstPritner } = require("./AstPrinter");
const { TokenType } = require("./TokenType");
const { Token } = require("./Token");
const { Binary, Grouping, Literal, Unary } = require("./Expr");

function testAstPrinter() {
    let expression = new Binary(
        new Unary(
            new Token(TokenType.MINUS, "-", null, 1),
            new Literal(123)
        ),
        new Token(TokenType.STAR, "*", null, 1),
        new Grouping( new Literal(45.67) )
    );
    let pretty = new AstPritner()
    if (pretty.print(expression) != "(* (- 123) (group 45.67))"){
        console.log("Error with Crafting Interpreters Example");
        console.log(`expected: "(* (- 123) (group 45.67))"`);
        console.log(`received: ${pretty.print(expression)}`);
    }
}

testAstPrinter();
