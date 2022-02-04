#!/usr/bin/env node

class Expr {};

class Binary extends Expr{
    left;
    operator;
    right;
    constructor ( left, operator, right ) {
super()
    this.left = left;
    this.operator = operator;
    this.right = right;
    }
}

class Grouping extends Expr{
    expression;
    constructor ( expression ) {
super()
    this.expression = expression;
    }
}

class Literal extends Expr{
    value;
    constructor ( value ) {
super()
    this.value = value;
    }
}

class Unary extends Expr{
    operator;
    right;
    constructor ( operator, right ) {
super()
    this.operator = operator;
    this.right = right;
    }
}

module.exports = {
    Expr,
    Binary,
    Grouping,
    Literal,
    Unary,
}
