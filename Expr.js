#!/usr/bin/env node
// Copyright (c) 2022 Alex O'Connor
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

class Binary {
    left;
    operator;
    right;
    constructor ( left, operator, right ) {
    this.left = left;
    this.operator = operator;
    this.right = right;
    }
}

class Grouping {
    expression;
    constructor ( expression ) {
    this.expression = expression;
    }
}

class Literal {
    value;
    constructor ( value ) {
    this.value = value;
    }
}

class Unary {
    operator;
    right;
    constructor ( operator, right ) {
    this.operator = operator;
    this.right = right;
    }
}

module.exports = {
    Binary,
    Grouping,
    Literal,
    Unary,
}
