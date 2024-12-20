/**
 * https://github.com/al66/imicros-feel-interpreter
 */
import {
    DMN_LiteralExpression,
    DMN_UnaryTests
} from "../common/Settings.js";

// const Get_attributes = (object: any) => {
//     return Object.getOwnPropertyNames(object);
// };
// const Get_functions = (object: any) => {
//     const functions = [];
//     for (const f in object)
//         if (typeof object[f] === "function" /*&& object.hasOwnProperty(f)*/) // Inherited functions (with comment) as well...
//             functions.push(f);
//     return functions;
// };

declare const IMICROS_DMN_Converter: any;
declare const IMICROS_FEEL_Interpreter: any;

export default class IMICROS_FEEL_interpreter {
    private static readonly _Converter = new IMICROS_DMN_Converter.DMNConverter;
    private static readonly _Interpreter = new IMICROS_FEEL_Interpreter;

    private static _Check(literal_expression: DMN_LiteralExpression, datum: Object): boolean {
        // See also: 'https://github.com/al66/cond-table'
        const keys = Object.keys(datum);

        const index = literal_expression.hasOwnProperty('label')
            ? keys.indexOf(literal_expression.text)
            : -1;
        if (index !== -1) {
            const value = Object.values(datum)[index];

        }
        return true;
    }

    public static Evaluate(expression: string, data: Object): any {
        return IMICROS_FEEL_interpreter._Interpreter.evaluate(expression, data);
    }

    // const expression = new IMICROS_DMN_Converter.DMNConverter().convert({xml: await this.XML});
    // const expression_ = new IMICROS_DMN_Converter.DMNParser().parse(await this.XML);
    public static Parse(column: DMN_UnaryTests | DMN_LiteralExpression): Array<Object> | undefined {
        if (IMICROS_FEEL_interpreter._Interpreter.parse(column.text)) {
            const ast: Array<Object> = IMICROS_FEEL_interpreter._Interpreter.ast;
            return ast;
        }
    }

    public static Test(): void {
        console.assert(IMICROS_FEEL_interpreter._Interpreter.parse("a/b**-c-d") === true);
        console.assert(IMICROS_FEEL_interpreter._Interpreter.evaluate("a/b**-c-d", {a: 1, b: 2, c: 4, d: 3}) === 13);
        // Ne fonctionne pas : 'IMICROS_FEEL_interpreter.Evaluate("< 5", {"?": 0});'
    }
}
