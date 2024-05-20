import Parser from './frontend/parser.ts';
import { evaluate } from "./runtime/interpreter.ts"
import { Value } from "./runtime/values.ts"
// REPL

function repl() {
    let input = "";
    const parser = new Parser();
    while (input != "exit") {
        input = prompt(">> ") || "exit";
        if (!(input == "exit")) {
            const ast = parser.produceAST(input);
            console.clear();
            const result = evaluate(ast)
            console.log((result as Value).value);
        }
    }
}

repl();