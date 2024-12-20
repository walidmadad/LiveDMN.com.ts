class IMICROS_FEEL_interpreter {
    static _Check(literal_expression, datum) {
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
    static Evaluate(expression, data) {
        return IMICROS_FEEL_interpreter._Interpreter.evaluate(expression, data);
    }
    // const expression = new IMICROS_DMN_Converter.DMNConverter().convert({xml: await this.XML});
    // const expression_ = new IMICROS_DMN_Converter.DMNParser().parse(await this.XML);
    static Parse(column) {
        if (IMICROS_FEEL_interpreter._Interpreter.parse(column.text)) {
            const ast = IMICROS_FEEL_interpreter._Interpreter.ast;
            return ast;
        }
    }
    static Test() {
        console.assert(IMICROS_FEEL_interpreter._Interpreter.parse("a/b**-c-d") === true);
        console.assert(IMICROS_FEEL_interpreter._Interpreter.evaluate("a/b**-c-d", { a: 1, b: 2, c: 4, d: 3 }) === 13);
        // Ne fonctionne pas : 'IMICROS_FEEL_interpreter.Evaluate("< 5", {"?": 0});'
    }
}
IMICROS_FEEL_interpreter._Converter = new IMICROS_DMN_Converter.DMNConverter;
IMICROS_FEEL_interpreter._Interpreter = new IMICROS_FEEL_Interpreter;
export default IMICROS_FEEL_interpreter;
//# sourceMappingURL=IMICROS_FEEL_interpreter.js.map