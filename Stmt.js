class Expression {
    constructor ( expression ) {
        this.expression = expression;
    }
    accept (visitor) {
        return visitor.visitExpressionStmt(this);
    }
}

class Print {
    constructor ( expression ) {
        this.expression = expression;
    }
    accept (visitor) {
        return visitor.visitPrintStmt(this);
    }
}

module.exports = {
    Expression,
    Print,
}
