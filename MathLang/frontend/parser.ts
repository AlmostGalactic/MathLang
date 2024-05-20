import {
    Stmt,
    Program,
    Expr,
    BinaryExpr,
    NumericLiteral,
    NullLiteral,
    Identifier,
    MathKeyword
} from "./ast.ts";
import { Tokenize, Token, TokenType } from "./lexer.ts";

export default class Parser {
    private tokens: Token[] = [];

    private not_eof(): boolean {
        return this.tokens[0].type != TokenType.EOF;
    }

    private at(): Token {
        return this.tokens[0] as Token;
    }

    private eat(): Token {
        const prev = this.tokens.shift() as Token;
        return prev;
    }

    private expect(type: TokenType, err: any) {
        const prev = this.tokens.shift() as Token;

        if (!prev || prev.type != type) {
            console.error("Parser Error:\n", err, prev, "\nExpecting: ", type);
            Deno.exit(1);
        }

        return prev;
    }

    public produceAST(sourceCode: string): Program {
        this.tokens = Tokenize(sourceCode);
        const program: Program = {
            kind: "Program",
            body: [],
        };

        while (this.not_eof()) {
            program.body.push(this.parse_stmt());
        }

        return program;
    }

    private parse_stmt(): Stmt {
        return this.parse_expr();
    }

    private parse_expr(): Expr {
        return this.parse_additive_expr();
    }

    private parse_additive_expr(): Expr {
        let left = this.parse_multiplicative_expr();

        while (this.at().value == "+" || this.at().value == "-") {
            const operator = this.eat().value;
            const right = this.parse_multiplicative_expr();
            left = {
                kind: "BinaryExpr",
                left,
                right,
                operator,
            } as BinaryExpr;
        }

        return left;
    }

    private parse_multiplicative_expr(): Expr {
        let left = this.parse_exponent_expr();

        while (
            this.at().value == "*" ||
            this.at().value == "/" ||
            this.at().value == "%"
        ) {
            const operator = this.eat().value;
            const right = this.parse_exponent_expr();
            left = {
                kind: "BinaryExpr",
                left,
                right,
                operator,
            } as BinaryExpr;
        }

        return left;
    }

    private parse_exponent_expr(): Expr {
        let left = this.parse_math_keys();

        while (this.at().value == "^") {
            const operator = this.eat().value;
            const right = this.parse_math_keys();
            left = {
                kind: "BinaryExpr",
                left,
                right,
                operator,
            } as BinaryExpr;
        }

        return left;
    }

    private parse_math_keys() {
        switch (this.at().type){
            case TokenType.SIN:
                this.eat();
                return { kind: "MathKeyword", key: TokenType.SIN, arg: this.parse_expr() } as MathKeyword
            case TokenType.COS:
                this.eat();
                return { kind: "MathKeyword", key: TokenType.COS, arg: this.parse_expr() } as MathKeyword
            case TokenType.ABS:
                this.eat();
                return { kind: "MathKeyword", key: TokenType.ABS, arg: this.parse_expr() } as MathKeyword
            case TokenType.CEIL:
                this.eat();
                return { kind: "MathKeyword", key: TokenType.CEIL, arg: this.parse_expr() } as MathKeyword
            case TokenType.FLOOR:
                this.eat();
                return { kind: "MathKeyword", key: TokenType.FLOOR, arg: this.parse_expr() } as MathKeyword
            case TokenType.SIGN:
                this.eat();
                return { kind: "MathKeyword", key: TokenType.SIGN, arg: this.parse_expr() } as MathKeyword
            case TokenType.FLIP:
                this.eat();
                return { kind: "MathKeyword", key: TokenType.FLIP, arg: this.parse_expr() } as MathKeyword
            case TokenType.ROUND:
                this.eat();
                return { kind: "MathKeyword", key: TokenType.ROUND, arg: this.parse_expr() } as MathKeyword

            default:
                return this.parse_primary_expr();
        }
    }
    private parse_primary_expr(): Expr {
        const tk = this.at().type;

        switch (tk) {
            case TokenType.IDENTIFIER:
                return {
                    kind: "Identifier",
                    symbole: this.eat().value,
                } as Identifier;

            case TokenType.NULL:
                this.eat();
                return { kind: "NullLiteral", value: "null" } as NullLiteral

            case TokenType.NUMBER:
                return {
                    kind: "NumericLiteral",
                    value: parseFloat(this.eat().value),
                } as NumericLiteral;

            case TokenType.LPAREN: {
                this.eat();
                const value = this.parse_expr();
                this.expect(
                    TokenType.RPAREN,
                    `Unexpected token found. Expecting Closing Parenthesis`
                );
                return value;
            }

            default:
                console.error(
                    `Unexpected token found during parsing: ${this.at()}`
                );
                Deno.exit(1);
        }
    }
}
