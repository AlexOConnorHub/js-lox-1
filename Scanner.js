let { TokenType } = require("./TokenType");
let { Token } = require("./Token");

class Scanner {
    #source
    #tokens
    #start
    #current
    #line
    #keywords
    constructor(source){
        this.#source = source;
        this.#tokens = Array();
        this.#start = 0;
        this.#current = 0;
        this.#line = 1;
        this.#keywords = {
            "and":    TokenType.AND,
            "class":  TokenType.CLASS,
            "else":   TokenType.ELSE,
            "false":  TokenType.FALSE,
            "for":    TokenType.FOR,
            "fun":    TokenType.FUN,
            "if":     TokenType.IF,
            "nil":    TokenType.NIL,
            "or":     TokenType.OR,
            "print":  TokenType.PRINT,
            "return": TokenType.RETURN,
            "super":  TokenType.SUPER,
            "this":   TokenType.THIS,
            "true":   TokenType.TRUE,
            "var":    TokenType.VAR,
            "while":  TokenType.WHILE
        }
    }
    scanTokens() {
        let err;
        while (!this.#isAtEnd()) {
            // We are at the beginning of the next lexeme.
            this.#start = this.#current;
            err = this.#scanToken();
            if (err  != 0) {
                return err;
            }
        }
        this.#tokens.push(new Token(TokenType.EOF, "", null, this.#line));
        return this.#tokens;
    }

    #scanToken() {
        let c = this.#advance();
        switch (c) {
            case '(': this.#addToken(TokenType.LEFT_PAREN); break;
            case ')': this.#addToken(TokenType.RIGHT_PAREN); break;
            case '{': this.#addToken(TokenType.LEFT_BRACE); break;
            case '}': this.#addToken(TokenType.RIGHT_BRACE); break;
            case ',': this.#addToken(TokenType.COMMA); break;
            case '.': this.#addToken(TokenType.DOT); break;
            case '-': this.#addToken(TokenType.MINUS); break;
            case '+': this.#addToken(TokenType.PLUS); break;
            case ';': this.#addToken(TokenType.SEMICOLON); break;
            case '*': this.#addToken(TokenType.STAR); break;
            case '!': this.#addToken(this.#match('=') ? TokenType.BANG_EQUAL    : TokenType.BANG); break;
            case '=': this.#addToken(this.#match('=') ? TokenType.EQUAL_EQUAL   : TokenType.EQUAL); break;
            case '<': this.#addToken(this.#match('=') ? TokenType.LESS_EQUAL    : TokenType.LESS); break;
            case '>': this.#addToken(this.#match('=') ? TokenType.GREATER_EQUAL : TokenType.GREATER); break;
            case '/': 
                if (this.#match('/')) {
                    // A comment goes until the end of the line.
                    while (this.#peek() != '\n' && !this.#isAtEnd()) this.#advance();
                } else {
                    this.#addToken(TokenType.SLASH);
                }
                break;
            case ' ': case '\r': case '\t': break; // Ignore whitespace.
            case '\n': line++; break;
            case '"': this.#string(); break;
            default:             
                if (this.#isDigit(c)) {
                    this.#number();
                } else if (this.#isAlpha(c)) {
                    this.#identifier();
                } else {
                    return 63;
                }
        }
        return 0;
    }

    #isAtEnd() {
        return this.#current >= this.#source.length;
    }

    #advance() {
        return this.#source[this.#current++];
    }

    #addToken(type, literal) {
        let text = this.#source.substring(this.#start, this.#current);
        this.#tokens.push(new Token(type, text, literal, this.#line));
    }

    #match(expected) {
        if (this.#isAtEnd()) return false;
        if (this.#source[this.#current] != expected) return false;
        this.#current++;
        return true;
      }

    #peek() {
        if (this.#isAtEnd()) return '\0';
        return this.#source[this.#current];
    }

    #string() {
        while (this.#peek() != '"' && !this.#isAtEnd()) {
            if (this.#peek() == '\n') this.#line++;
            this.#advance();
        }
    
        if (this.#isAtEnd()) {
            return 62;
        }
    
        // The closing ".
        this.#advance();
    
        // Trim the surrounding quotes./site/documentation
        let value = this.#source.substring(this.#start + 1, this.#current - 1);
        this.#addToken(TokenType.STRING, value);
    }

    #isDigit(c) {
        return c >= '0' && c <= '9';
    }

    #number() {
        while (this.#isDigit(this.#peek())) this.#advance();
    
        // Look for a fractional part.
        if (this.#peek() == '.' && this.#isDigit(this.#peekNext())) {
            // Consume the "."
            this.#advance();
        
            while (this.#isDigit(this.#peek())) this.#advance();
        }
    
        this.#addToken(TokenType.NUMBER, +this.#source.substring(this.#start, this.#current));
    }

    #peekNext() {
        if (this.#current + 1 >= this.#source.length) return '\0';
        return this.#source[this.#current + 1];
    } 

    #identifier() {
        while (this.#isAlphaNumeric(this.#peek()))
        {
            this.#advance();
        }
        let text = this.#source.substring(this.#start, this.#current);
        let type = this.#keywords[text];
        if (type == null) type = TokenType.IDENTIFIER;
        this.#addToken(type);
    }

    #isAlpha(c) {
        return (c >= 'a' && c <= 'z') ||
               (c >= 'A' && c <= 'Z') ||
                c == '_';
    }
    
    #isAlphaNumeric(c) {
        return this.#isAlpha(c) || this.#isDigit(c);
    }
}
  
module.exports = { Scanner };
