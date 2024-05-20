import { ValueTypes, RuntimeValue, NumberValue, NullValue } from "./values.ts";
import { NumericLiteral, Stmt, Expr } from "../frontend/ast.ts";
import { BinaryExpr, Program, MathKeyword } from "../frontend/ast.ts";
import { TokenType, Token } from "../frontend/lexer.ts";

function eval_program(program: Program): RuntimeValue {
    let lastEvaluated: RuntimeValue = {
        type: "null",
        value: "null",
    } as NullValue;

    for (const statement of program.body) {
        lastEvaluated = evaluate(statement);
    }

    return lastEvaluated;
}

function eval_numeric_binary_expr(
    lhs: NumberValue,
    rhs: NumberValue,
    operator: string
): NumberValue {
    let result = 0;
    if (operator == "+") result = lhs.value + rhs.value;
    else if (operator == "-") result = lhs.value - rhs.value;
    else if (operator == "*") result = lhs.value * rhs.value;
    else if (operator == "/") {
        if (rhs.value == 0) {
            console.error("Cannot divide by 0");
            Deno.exit(1);
        } else result = lhs.value / rhs.value;
    } else if (operator == "%") result = lhs.value % rhs.value;
    else if (operator == "^") result = lhs.value ** rhs.value;

    return { value: result, type: "number" };
}

function eval_math_expr(astNode: MathKeyword): RuntimeValue {
    const key = astNode.key;
    const arg = evaluate(astNode.arg);

    if (arg.type == "number") {
        return eval_math_key_expr(key, arg as NumberValue);
    }

    return { type: "null", value: "null" } as NullValue;
}

function eval_math_key_expr(key: TokenType, arg: NumberValue): NumberValue {
    let result = 0;

    if (key == TokenType.SIN) {
        result = Math.sin(arg.value);
    } else if (key == TokenType.COS) {
        result = Math.cos(arg.value);
    } else if (key == TokenType.ABS) {
        result = Math.abs(arg.value);
    } else if (key == TokenType.CEIL) {
        result = Math.ceil(arg.value);
    } else if (key == TokenType.FLOOR) {
        result = Math.floor(arg.value);
    } else if (key == TokenType.SIGN) {
        result = Math.sign(arg.value);
    } else if (key == TokenType.FLIP) {
        result = (arg.value*-1);
    } else if (key == TokenType.ROUND) {
        result = Math.round(arg.value);
    }

    return { value: result, type: "number" };
}

function eval_binary_expr(binop: BinaryExpr): RuntimeValue {
    const lhs = evaluate(binop.left);
    const rhs = evaluate(binop.right);

    if (lhs.type == "number" && rhs.type == "number") {
        return eval_numeric_binary_expr(
            lhs as NumberValue,
            rhs as NumberValue,
            binop.operator as string
        );
    }

    return { type: "null", value: "null" } as NullValue;
}

export function evaluate(astNode: Stmt): RuntimeValue {
    switch (astNode.kind) {
        case "NumericLiteral":
            return {
                value: (astNode as NumericLiteral).value,
                type: "number",
            } as NumberValue;

        case "BinaryExpr":
            return eval_binary_expr(astNode as BinaryExpr);

        case "Program":
            return eval_program(astNode as Program);

        case "MathKeyword":
            return eval_math_expr(astNode as MathKeyword);

        case "NullLiteral":
            return { value: "null", type: "null" } as NullValue;

        default:
            console.error(
                "This AST Node has not yet been setup for evaluation.",
                astNode
            );
            Deno.exit(0);
    }
}
