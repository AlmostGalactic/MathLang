export interface Token {
    type: TokenType;
    value: string;
}

export enum TokenType {
    IDENTIFIER,
    NUMBER,
    LPAREN,
    RPAREN,
    UNDERSCORE,
    BINOP,
    EOF,

    SIN,
    COS,
    TAN,
    ABS,
    CEIL,
    FLOOR,
    SIGN,
    FLIP,
    ROUND,
    NULL,
}

const KEYWORDS: Record<string, TokenType> = {
    "sin": TokenType.SIN,
    "cos": TokenType.COS,
    "tan": TokenType.TAN,
    "abs": TokenType.ABS,
    "ceil": TokenType.CEIL,
    "floor": TokenType.FLOOR,
    "sign": TokenType.SIGN,
    "null": TokenType.NULL,
    "flip": TokenType.FLIP,
    "round": TokenType.ROUND,
};

function token(value = "", type: TokenType): Token {
    return { type, value } as Token;
}

function isws(src: string) {
    return src == " " || src == "\n" || src == "\t" || src == "\r";
}

function isalpha(str: string) {
    return str.toLowerCase() != str.toUpperCase();
}

function isint(str = "") {
    const c = str.charCodeAt(0);
    const bounds = ["0".charCodeAt(0), "9".charCodeAt(0)];
    return c >= bounds[0] && c <= bounds[1];
}

export function Tokenize(source: string): Token[] {
    const src = source.split("");
    let tokens = new Array<Token>();
    while (src.length > 0) {
        if (isws(src[0])) {
            src.shift();
        } else if (src[0] == "(") {
            tokens.push(token(src.shift(), TokenType.LPAREN));
        } else if (src[0] == ")") {
            tokens.push(token(src.shift(), TokenType.RPAREN));
        } else if (src[0] == "+") {
            tokens.push(token(src.shift(), TokenType.BINOP));
        } else if (src[0] == "-") {
            tokens.push(token(src.shift(), TokenType.BINOP));
        } else if (src[0] == "*") {
            tokens.push(token(src.shift(), TokenType.BINOP));
        } else if (src[0] == "/") {
            tokens.push(token(src.shift(), TokenType.BINOP));
        } else if (src[0] == "^") {
            tokens.push(token(src.shift(), TokenType.BINOP));
        } else if (src[0] == "%") {
            tokens.push(token(src.shift(), TokenType.BINOP));
        } else {
            // Multi-Tokens

            if (isalpha(src[0])) {
                let ident = "";
                while ((src.length > 0 && isalpha(src[0])) || isint(src[0])) {
                    ident += src.shift();
                }

                const reserved = KEYWORDS[ident];

                if (typeof reserved == "number")
                    tokens.push(token(ident, reserved));
                else tokens.push(token(ident, TokenType.IDENTIFIER));
            } else if (isint(src[0]) || src[0] == "0") {
                let num = "";

                let decimals = 0;
                while ((src.length > 0 && isint(src[0])) || src[0] == ".") {
                    num += src.shift();
                    if (src[0] == ".") {
                        decimals++;
                        if (decimals > 1) {
                            console.error(
                                "Cannot have more than 1 decimal per number"
                            );
                            Deno.exit();
                        }
                    }
                }
                tokens.push(token(num, TokenType.NUMBER));
            } else {
                console.error(`Unexpected token: ${src[0]}`);
                Deno.exit(1);
            }
        }
    }

    tokens.push(token("EndOfFile", TokenType.EOF));
    return tokens;
}
