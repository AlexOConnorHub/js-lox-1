#!/usr/bin/env node
const { AstPrinter } = require("./AstPrinter");
const { TokenType } = require("./TokenType");
const { Parser } = require("./Parser");
const { Scanner } = require("./Scanner");
const { Token } = require("./Token");
const { Binary, Grouping, Literal, Unary } = require("./Expr");
const { Interpreter } = require("./Interpreter");
const util = require("util");
const fs = require("fs");

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

function testBasicScanner() {
    // Test string
    let scanner = new Scanner('"Hello World!"');
    let resp = scanner.scanTokens();
    assert(2, resp.length, "Basic Scanner String");
    assert(TokenType.STRING, resp[0].type, "Basic Scanner String");
    assert("Hello World!", resp[0].literal, "Basic Scanner String");
    assert(TokenType.EOF, resp[1].type, "Basic Scanner String");

    // Test number
    scanner = new Scanner("123");
    resp = scanner.scanTokens();
    assert(2, resp.length, "Basic Scanner Number");
    assert(TokenType.NUMBER, resp[0].type, "Basic Scanner Number");
    assert(123, resp[0].literal, "Basic Scanner Number");
    assert(TokenType.EOF, resp[1].type, "Basic Scanner Number");

    // Test boolean
    scanner = new Scanner("true");
    resp = scanner.scanTokens();
    assert(2, resp.length, "Basic Scanner Boolean");
    assert(TokenType.TRUE, resp[0].type, "Basic Scanner Boolean");
    assert(TokenType.EOF, resp[1].type, "Basic Scanner Boolean");

    scanner = new Scanner("false");
    resp = scanner.scanTokens();
    assert(2, resp.length, "Basic Scanner Boolean");
    assert(TokenType.FALSE, resp[0].type, "Basic Scanner Boolean");
    assert(TokenType.EOF, resp[1].type, "Basic Scanner Boolean");

    // Test null
    scanner = new Scanner("nil");
    resp = scanner.scanTokens();
    assert(2, resp.length, "Basic Scanner Null");
    assert(TokenType.NIL, resp[0].type, "Basic Scanner Null");
    assert(TokenType.EOF, resp[1].type, "Basic Scanner Null");

    // Test unary
    scanner = new Scanner("-123");
    resp = scanner.scanTokens();
    assert(3, resp.length, "Basic Scanner Unary");
    assert(TokenType.MINUS, resp[0].type, "Basic Scanner Unary");
    assert(TokenType.NUMBER, resp[1].type, "Basic Scanner Unary");
    assert(123, resp[1].literal, "Basic Scanner Unary");
    assert(TokenType.EOF, resp[2].type, "Basic Scanner Unary");

    // Test grouping
    scanner = new Scanner("(5 + 5)");
    resp = scanner.scanTokens();
    assert(6, resp.length, "Basic Scanner Grouping");
    assert(TokenType.LEFT_PAREN, resp[0].type, "Basic Scanner Grouping");
    assert(TokenType.NUMBER, resp[1].type, "Basic Scanner Grouping");
    assert(5, resp[1].literal, "Basic Scanner Grouping");
    assert(TokenType.PLUS, resp[2].type, "Basic Scanner Grouping");
    assert(TokenType.NUMBER, resp[3].type, "Basic Scanner Grouping");
    assert(5, resp[3].literal, "Basic Scanner Grouping");
    assert(TokenType.RIGHT_PAREN, resp[4].type, "Basic Scanner Grouping");
    assert(TokenType.EOF, resp[5].type, "Basic Scanner Grouping");

    // Test binary
    scanner = new Scanner("5 + 5");
    resp = scanner.scanTokens();
    assert(4, resp.length, "Basic Scanner Binary");
    assert(TokenType.NUMBER, resp[0].type, "Basic Scanner Binary");
    assert(5, resp[0].literal, "Basic Scanner Binary");
    assert(TokenType.PLUS, resp[1].type, "Basic Scanner Binary");
    assert(TokenType.NUMBER, resp[2].type, "Basic Scanner Binary");
    assert(5, resp[2].literal, "Basic Scanner Binary");
    assert(TokenType.EOF, resp[3].type, "Basic Scanner Binary");
}

function testNestingScanner() {
    let scanner = new Scanner("!-8");
    let resp = scanner.scanTokens();
    assert(4, resp.length, "Nesting Scanner");
    assert(TokenType.BANG, resp[0].type, "Nesting Scanner");
    assert(TokenType.MINUS, resp[1].type, "Nesting Scanner");
    assert(TokenType.NUMBER, resp[2].type, "Nesting Scanner");
    assert(8, resp[2].literal, "Nesting Scanner");
    assert(TokenType.EOF, resp[3].type, "Nesting Scanner");

    scanner = new Scanner("-5 + (5 * 9)");
    resp = scanner.scanTokens();
    assert(9, resp.length, "Nesting Scanner");
    assert(TokenType.MINUS, resp[0].type, "Nesting Scanner");
    assert(TokenType.NUMBER, resp[1].type, "Nesting Scanner");
    assert(5, resp[1].literal, "Nesting Scanner");
    assert(TokenType.PLUS, resp[2].type, "Nesting Scanner");
    assert(TokenType.LEFT_PAREN, resp[3].type, "Nesting Scanner");
    assert(TokenType.NUMBER, resp[4].type, "Nesting Scanner");
    assert(5, resp[4].literal, "Nesting Scanner");
    assert(TokenType.STAR, resp[5].type, "Nesting Scanner");
    assert(TokenType.NUMBER, resp[6].type, "Nesting Scanner");
    assert(9, resp[6].literal, "Nesting Scanner");
    assert(TokenType.RIGHT_PAREN, resp[7].type, "Nesting Scanner");
    assert(TokenType.EOF, resp[8].type, "Nesting Scanner");

    scanner = new Scanner("((57 / (2 - -4)) <= (-8 * -9)) != true");
    resp = scanner.scanTokens();
    assert(23, resp.length, "Nesting Scanner");
    assert(TokenType.LEFT_PAREN, resp[0].type, "Nesting Scanner");
    assert(TokenType.LEFT_PAREN, resp[1].type, "Nesting Scanner");
    assert(TokenType.NUMBER, resp[2].type, "Nesting Scanner");
    assert(57, resp[2].literal, "Nesting Scanner");
    assert(TokenType.SLASH, resp[3].type, "Nesting Scanner");
    assert(TokenType.LEFT_PAREN, resp[4].type, "Nesting Scanner");
    assert(TokenType.NUMBER, resp[5].type, "Nesting Scanner");
    assert(2, resp[5].literal, "Nesting Scanner");
    assert(TokenType.MINUS, resp[6].type, "Nesting Scanner");
    assert(TokenType.MINUS, resp[7].type, "Nesting Scanner");
    assert(TokenType.NUMBER, resp[8].type, "Nesting Scanner");
    assert(4, resp[8].literal, "Nesting Scanner");
    assert(TokenType.RIGHT_PAREN, resp[9].type, "Nesting Scanner");
    assert(TokenType.RIGHT_PAREN, resp[10].type, "Nesting Scanner");
    assert(TokenType.LESS_EQUAL, resp[11].type, "Nesting Scanner");
    assert(TokenType.LEFT_PAREN, resp[12].type, "Nesting Scanner");
    assert(TokenType.MINUS, resp[13].type, "Nesting Scanner");
    assert(TokenType.NUMBER, resp[14].type, "Nesting Scanner");
    assert(8, resp[14].literal, "Nesting Scanner");
    assert(TokenType.STAR, resp[15].type, "Nesting Scanner");
    assert(TokenType.MINUS, resp[16].type, "Nesting Scanner");
    assert(TokenType.NUMBER, resp[17].type, "Nesting Scanner");
    assert(9, resp[17].literal, "Nesting Scanner");
    assert(TokenType.RIGHT_PAREN, resp[18].type, "Nesting Scanner");
    assert(TokenType.RIGHT_PAREN, resp[19].type, "Nesting Scanner");
    assert(TokenType.BANG_EQUAL, resp[20].type, "Nesting Scanner");
    assert(TokenType.TRUE, resp[21].type, "Nesting Scanner");
    assert(TokenType.EOF, resp[22].type, "Nesting Scanner");
}

function testParser() {
    let scanner = new Scanner("((57 / (2 - -4)) <= (-8 * -9)) != true");
    let parser = new Parser(scanner.scanTokens());
    let expressions = parser.parse();

    // Top level
    assert(true, expressions instanceof Binary, "Parser");

    // Second level
    assert(true, expressions.left instanceof Grouping, "Parser");
    assert(true, expressions.operator instanceof Token, "Parser");
    assert(true, expressions.right instanceof Literal, "Parser");

    // Third level
    assert(true, expressions.left.expression instanceof Binary, "Parser");

    // Fourth level
    assert(true, expressions.left.expression.left instanceof Grouping, "Parser");
    assert(true, expressions.left.expression.operator instanceof Token, "Parser");
    assert(true, expressions.left.expression.right instanceof Grouping, "Parser");

    // Fifth level
    assert(true, expressions.left.expression.left.expression instanceof Binary, "Parser");
    assert(true, expressions.left.expression.right.expression instanceof Binary, "Parser");
    
    // Sixth level
    assert(true, expressions.left.expression.left.expression.left instanceof Literal, "Parser");
    assert(true, expressions.left.expression.left.expression.operator instanceof Token, "Parser");
    assert(true, expressions.left.expression.left.expression.right instanceof Grouping, "Parser");
    assert(true, expressions.left.expression.right.expression.left instanceof Unary, "Parser");
    assert(true, expressions.left.expression.right.expression.operator instanceof Token, "Parser");
    assert(true, expressions.left.expression.right.expression.right instanceof Unary, "Parser");

    // Seventh level
    assert(true, expressions.left.expression.left.expression.right.expression instanceof Binary, "Parser");
    assert(true, expressions.left.expression.right.expression.left.operator instanceof Token, "Parser");
    assert(true, expressions.left.expression.right.expression.left.right instanceof Literal, "Parser");
    assert(true, expressions.left.expression.right.expression.right.operator instanceof Token, "Parser");
    assert(true, expressions.left.expression.right.expression.right.right instanceof Literal, "Parser");

    // Eighth level
    assert(true, expressions.left.expression.left.expression.right.expression.left instanceof Literal, "Parser");
    assert(true, expressions.left.expression.left.expression.right.expression.operator instanceof Token, "Parser");
    assert(true, expressions.left.expression.left.expression.right.expression.right instanceof Unary, "Parser");

    // Ninth level
    assert(true, expressions.left.expression.left.expression.right.expression.right.operator instanceof Token, "Parser");
    assert(true, expressions.left.expression.left.expression.right.expression.right.right instanceof Literal, "Parser");
}

function testAstPrinter() {
    let pretty = new AstPrinter()
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

function testBasicInterpreter() {
    let scanner = new Scanner("1 + 1");
    let resp = scanner.scanTokens();
    let parser = new Parser(resp);
    let expression = parser.parse();
    let interpreter = new Interpreter();
    let final = interpreter.interpret(expression);
    assert("2", final, "Basic Interpreter");

    scanner = new Scanner("1 - 1");
    resp = scanner.scanTokens();
    parser = new Parser(resp);
    expression = parser.parse();
    final = interpreter.interpret(expression);
    assert("0", final, "Basic Interpreter");

    scanner = new Scanner("2 * 2");
    resp = scanner.scanTokens();
    parser = new Parser(resp);
    expression = parser.parse();
    final = interpreter.interpret(expression);
    assert("4", final, "Basic Interpreter");

    scanner = new Scanner("1 / 2");
    resp = scanner.scanTokens();
    parser = new Parser(resp);
    expression = parser.parse();
    final = interpreter.interpret(expression);
    assert("0.5", final, "Basic Interpreter");

    scanner = new Scanner('"hello"');
    resp = scanner.scanTokens();
    parser = new Parser(resp);
    expression = parser.parse();
    final = interpreter.interpret(expression);
    assert("hello", final, "Basic Interpreter");

    scanner = new Scanner('1 - -1');
    resp = scanner.scanTokens();
    parser = new Parser(resp);
    expression = parser.parse();
    final = interpreter.interpret(expression);
    assert("2", final, "Basic Interpreter");

    scanner = new Scanner('true == true');
    resp = scanner.scanTokens();
    parser = new Parser(resp);
    expression = parser.parse();
    final = interpreter.interpret(expression);
    assert("true", final, "Basic Interpreter");

    scanner = new Scanner('true == false');
    resp = scanner.scanTokens();
    parser = new Parser(resp);
    expression = parser.parse();
    final = interpreter.interpret(expression);
    assert("false", final, "Basic Interpreter");

    scanner = new Scanner('true != true');
    resp = scanner.scanTokens();
    parser = new Parser(resp);
    expression = parser.parse();
    final = interpreter.interpret(expression);
    assert("false", final, "Basic Interpreter");

    scanner = new Scanner('true != false');
    resp = scanner.scanTokens();
    parser = new Parser(resp);
    expression = parser.parse();
    final = interpreter.interpret(expression);
    assert("true", final, "Basic Interpreter");

    scanner = new Scanner('3 > 2');
    resp = scanner.scanTokens();
    parser = new Parser(resp);
    expression = parser.parse();
    final = interpreter.interpret(expression);
    assert("true", final, "Basic Interpreter");

    scanner = new Scanner('3 < 6');
    resp = scanner.scanTokens();
    parser = new Parser(resp);
    expression = parser.parse();
    final = interpreter.interpret(expression);
    assert("true", final, "Basic Interpreter");

    scanner = new Scanner('4 >= 4');
    resp = scanner.scanTokens();
    parser = new Parser(resp);
    expression = parser.parse();
    final = interpreter.interpret(expression);
    assert("true", final, "Basic Interpreter");

    scanner = new Scanner('4 <= 4');
    resp = scanner.scanTokens();
    parser = new Parser(resp);
    expression = parser.parse();
    final = interpreter.interpret(expression);
    assert("true", final, "Basic Interpreter");
}

function test() {
    if (process.argv.length > 2 && (process.argv[2] == "--help" || process.argv[2] == "-h")) {
        console.log("Usage: node test.js [--verbose|-v] [--help|-h]");
        return;
    }

    testToken();
    testBasicExpr();
    testNestingExpr();
    testBasicScanner();
    testNestingScanner();
    testParser();
    testAstPrinter();
    testBasicInterpreter();

    if (process.argv.length > 2 && (process.argv[2] == "--verbose" || process.argv[2] == "-v")) {
        console.log(`${testCount - failed} of ${testCount} tests passed.`);
    }
}

test();
