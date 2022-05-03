class Assign {
    constructor ( name, value ) {
        this.name = name;
        this.value = value;
    }
    accept (visitor) {
        return visitor.visitAssignExpr(this);
    }
}

class Binary {
    constructor ( left, operator, right ) {
        this.left = left;
        this.operator = operator;
        this.right = right;
    }
    accept (visitor) {
        return visitor.visitBinaryExpr(this);
    }
}

class Grouping {
    constructor ( expression ) {
        this.expression = expression;
    }
    accept (visitor) {
        return visitor.visitGroupingExpr(this);
    }
}

class Literal {
    constructor ( value ) {
        this.value = value;
    }
    accept (visitor) {
        return visitor.visitLiteralExpr(this);
    }
}

class Logical {
    constructor ( left, operator, right ) {
        this.left = left;
        this.operator = operator;
        this.right = right;
    }
    accept (visitor) {
        return visitor.visitLogicalExpr(this);
    }
}

class Unary {
    constructor ( operator, right ) {
        this.operator = operator;
        this.right = right;
    }
    accept (visitor) {
        return visitor.visitUnaryExpr(this);
    }
}

class Variable {
    constructor ( name ) {
        this.name = name;
    }
    accept (visitor) {
        return visitor.visitVariableExpr(this);
    }
}

module.exports = {
    Assign,
    Binary,
    Grouping,
    Literal,
    Logical,
    Unary,
    Variable,
}
