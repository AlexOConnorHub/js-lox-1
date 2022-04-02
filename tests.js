#!/usr/bin/env node
const { AstPritner } = require("./AstPrinter");
const { Token } = require("./Token");
const { Binary, Grouping, Literal, Unary } = require("./Expr");
const { TokenType } = require("./TokenType");
const { Interpreter } = require("./Interpreter");

let testCount = 0;
let failed = 0;

function assert(expected, actual, errorMessage) {
    testCount++;
    if (expected !== actual) {
        failed++;
        console.log(`Error: ${errorMessage}`);
        console.log(`Expected: ${expected}`);
        console.log(`Received: ${actual}`);
    }
}

function testToken() {
    let token;
    for (let [Tok, literal] of Object.entries(TokenType)) {
        token = new Token(Tok, literal, null, 1);
        assert(Tok, token.type, "Token");
        assert(literal, token.lexeme, "Token");
        assert(null, token.literal, "Token");
        assert(1, token.line, "Token");
    };

    token = new Token(TokenType.IDENTIFIER, "foobar", "foobar", 1);
    assert(TokenType.IDENTIFIER, token.type, "Token");
    assert("foobar", token.lexeme, "Token");
    assert("foobar", token.literal, "Token");
    assert(1, token.line, "Token");

    token = new Token(TokenType.STRING, "foobar", "foobar", 1);
    assert(TokenType.STRING, token.type, "Token");
    assert("foobar", token.lexeme, "Token");
    assert("foobar", token.literal, "Token");
    assert(1, token.line, "Token");

    token = new Token(TokenType.NUMBER, "123", 123, 11);
    assert(TokenType.NUMBER, token.type, "Token");
    assert("123", token.lexeme, "Token");
    assert(123, token.literal, "Token");
    assert(11, token.line, "Token");
}

function testBasicExpr() {
    let expression = new Binary("left", "operator", "right");
    assert("left", expression.left, "Basic Binary Expression");
    assert("operator", expression.operator, "Basic Binary Expression");
    assert("right", expression.right, "Basic Binary Expression");

    expression = new Grouping("expression");
    assert("expression", expression.expression, "Basic Grouping Expression");
    
    expression = new Literal("value");
    assert("value", expression.value, "Basic Literal Expression");

    expression = new Unary("operator", "right");
    assert("operator", expression.operator, "Basic Unary Expression");
    assert("right", expression.right, "Basic Unary Expression");
}

function testNestingExpr() {
    let expression = new Unary("!", new Unary(new Token(TokenType.MINUS, "-", null, 1), new Literal(5)));
    assert("!", expression.operator, "Nesting Unary Expression");
    assert(TokenType.MINUS, expression.right.operator.type, "Nesting Unary Expression");
    assert(5, expression.right.right.value, "Nesting Unary Expression");
    
    expression = new Binary("5", "+", new Binary(new Literal(5), "-", "5"));
    assert("5", expression.left, "Nesting Binary Expression");
    assert("+", expression.operator, "Nesting Binary Expression");
    assert(5, expression.right.left.value, "Nesting Binary Expression");
    assert("-", expression.right.operator, "Nesting Binary Expression");
    assert("5", expression.right.right, "Nesting Binary Expression");

    expression = new Grouping(new Binary("5", "+", new Literal(5)));
    assert("5", expression.expression.left, "Nesting Grouping Expression");
    assert("+", expression.expression.operator, "Nesting Grouping Expression");
    assert(5, expression.expression.right.value, "Nesting Grouping Expression");
}

function testAstPrinter() {
    let pretty = new AstPritner()
    let expression = new Binary(
        new Unary(new Token(TokenType.MINUS, "-", null, 1), new Literal(123)),
        new Token(TokenType.STAR, "*", null, 1),
        new Grouping( new Literal(45.67) )
    );
    assert("(* (- 123) (group 45.67))", pretty.print(expression), "AST Printer");

    expression = new Unary(new Token(TokenType.BANG, "!", null, 1), new Unary(new Token(TokenType.MINUS, "-", null, 1), new Literal(5)));
    assert("(! (- 5))", pretty.print(expression), "AST Printer");

    expression = new Grouping(new Binary(new Literal(5), new Token(TokenType.PLUS, "+", null, 1), new Literal(5)));
    assert("(group (+ 5 5))", pretty.print(expression), "AST Printer");
}

function testInterpreter() {
    let expression = new Binary(
        new Unary(new Token(TokenType.MINUS, "-", null, 1), new Literal(123)),
        new Token(TokenType.STAR, "*", null, 1),
        new Grouping( new Literal(45.67) )
    );
    let interpreter = new Interpreter(expression);
    interpreter.interpret(expression);
    assert(15129.67, expression.evaluate(), "Interpreter");

    expression = new Unary(new Token(TokenType.BANG, "!", null, 1), new Unary(new Token(TokenType.MINUS, "-", null, 1), new Literal(5)));
    assert(true, expression.evaluate(), "Interpreter");

    expression = new Grouping(new Binary(new Literal(5), new Token(TokenType.PLUS, "+", null, 1), new Literal(5)));
    assert(10, expression.evaluate(), "Interpreter");
}

function test() {
    testToken();
    testBasicExpr();
    testNestingExpr();
    testAstPrinter();
    testInterpreter();
    if (process.argv.length > 2 && (process.argv[2] === "--verbose" || process.argv[2] === "-v")) {
        console.log(`${testCount - failed} of ${testCount} tests passed.`);
    }
}

test();
