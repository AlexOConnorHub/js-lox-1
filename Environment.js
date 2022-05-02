const { jsLoxError } = require("./error");

class Environment {
    #values
    #enclosing
    constructor(enclosing) {
        this.#values = {};
        this.#enclosing = (enclosing === undefined)? null: enclosing;
    }

    get(name) {
        if (this.#values[name] !== undefined) {
            return this.#values[name.lexeme];
        }
    
        if (this.#enclosing !== null) return this.#enclosing.get(name);

        throw new jsLoxError(null,  "Undefined variable '" + name.lexeme + "'.", 1, name); // TODO: Make sure works
    }
    
    define(name, value) {
        this.#values[name] = value;
    }

    assign(name, value) {
        if (this.#values[name.lexeme] === undefined) {
            this.#values[name.lexeme] = value;
            return;
        }

        if (this.#enclosing !== null) {
            this.#enclosing.assign(name, value);
            return;
        }
    
        throw new jsLoxError(null,  "Undefined variable '" + name.lexeme + "'.", 1, name); // TODO: Make sure works
      }
}

module.exports = { Environment };
