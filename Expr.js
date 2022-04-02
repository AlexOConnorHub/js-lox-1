#!/usr/bin/env node

class Binary{
    constructor ( left, operator, right ) {
        this.left = left;
        this.operator = operator;
        this.right = right;
    }
    accept (visitor) {
        return visitor.visitBinaryExpr(this);
    }
}

class Grouping{
    constructor ( expression ) {
        this.expression = expression;
    }
    accept (visitor) {
        return visitor.visitGroupingExpr(this);
    }
}

class Literal{
    constructor ( value ) {
        this.value = value;
    }
    accept (visitor) {
        return visitor.visitLiteralExpr(this);
    }
}

class Unary{
    constructor ( operator, right ) {
        this.operator = operator;
        this.right = right;
    }
    accept (visitor) {
        return visitor.visitUnaryExpr(this);
    }
}

module.exports = {
    Binary,
    Grouping,
    Literal,
    Unary,
}
