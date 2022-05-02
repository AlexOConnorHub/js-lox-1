class Block {
    constructor ( statements ) {
        this.statements = statements;
    }
    accept (visitor) {
        return visitor.visitBlockStmt(this);
    }
}

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

class Var {
    constructor ( name, initializer ) {
        this.name = name;
        this.initializer = initializer;
    }
    accept (visitor) {
        return visitor.visitVarStmt(this);
    }
}

module.exports = {
    Block,
    Expression,
    Print,
    Var,
}
