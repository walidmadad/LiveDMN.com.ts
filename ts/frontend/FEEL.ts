import {
    _DMiNer_,
    DMiNer_error,
    DMN_type_reference_,
    DMN_Decision,
    DMN_DecisionRule,
    DMN_InputClause,
    DMN_OutputClause,
    DMN_LiteralExpression,
    Is_DMN_type_reference_,
    Is_DMN_DecisionTable,
    Is_DMN_LiteralExpression,
    Is_DMN_UnaryTests,
    Name_of_DMN_Decision,
    Name_of_DMN_InputClause,
    Name_of_DMN_OutputClause,
    Type_of_DMN_OutputClause,
    Hit_policy,
    Trace
} from "../common/Settings.js";
import IMICROS_FEEL_interpreter from "./IMICROS_FEEL_interpreter.js";

declare const FEELin: any;

// window.alert(FEELin.unaryTest("< 5", {"?": 0}));

export default class FEEL {
    private static readonly _FEEL_EXPRESSION = "FEEL_EXPRESSION";
    private static readonly _HYPHEN = "-";
    private static readonly _Rejected_rules: Set<DMN_DecisionRule> = new Set;

    public static Evaluate(decision: DMN_Decision, data: Array<Object>): Promise<void> | never {
        if (Is_DMN_DecisionTable(decision.decisionLogic)) {
            const decision_table = decision.decisionLogic;
            data.forEach(datum => {
                    FEEL._Rejected_rules.clear();
                    const keys = Object.keys(datum);
                    decision_table.input!.every((input_clause: DMN_InputClause, input_clause_index) => {
                        const index = keys.indexOf(Name_of_DMN_InputClause(input_clause));
                        if (index !== -1) {
                            const value = Object.values(datum)[index];
                            let evaluation = true;
                            if (input_clause.hasOwnProperty('inputValues') && Is_DMN_UnaryTests(input_clause.inputValues!)) {
                                // if (Array.isArray(value))
                                //     value.every(item => {
                                //         evaluation &&= FEELin.unaryTest(input_clause.inputValues!.text, {'?': item});
                                //         if (evaluation) return true; // Next 'item' for 'every'...
                                //         return false;
                                //     });
                                // else
                                if (!(typeof value === 'string') || !(value === FEEL._HYPHEN)) {
                                    // https://nikku.github.io/feel-playground/?e=%22C%2B%2B%22%2C%22Java%22%2C%22TypeScript%22&c=%7B%0A++%22%3F%22%3A+%22TypeScript%22%0A%7D&t=unaryTests&st=true
                                    evaluation = FEELin.unaryTest(input_clause.inputValues!.text, {'?': value});
                                    // https://github.com/al66/imicros-feel-interpreter/issues/2#issuecomment-2067734860
                                    // evaluation = IMICROS_FEEL_interpreter.Evaluate('? in (' + input_clause.inputValues!.text + ')', {'?': value});
                                }
                                if (!evaluation) {
                                    decision_table.rule!.forEach(rule => FEEL._Rejected_rules.add(rule));
                                    return false; // 'break' because of 'every'...
                                }
                            }
                            if (input_clause.hasOwnProperty('inputExpression') && Is_DMN_LiteralExpression(input_clause.inputExpression!)) {
                                const literal_expression: DMN_LiteralExpression = input_clause.inputExpression as DMN_LiteralExpression;
                                if (literal_expression.text === Object.keys(datum)[index] && Is_DMN_type_reference_(literal_expression.typeRef))
                                    evaluation &&= (literal_expression.typeRef as string) === typeof value;
                            }
                            decision_table.rule!.filter(rule => !FEEL._Rejected_rules.has(rule)).forEach((rule) => {
                                // https://docs.camunda.io/docs/components/modeler/feel/language-guide/feel-unary-tests
                                // https://nikku.github.io/feel-playground/?e=%3C+10&c=%7B%0A++%22%3F%22+%3A+5%0A%7D%0A&t=unaryTests&st=true
                                const column = rule.inputEntry[input_clause_index];

                                /**
                                 * 2 lines are weird:
                                 */
                                    // const TRUE = FEELin.unaryTest("true", {'?': true}); // OK
                                    // const TRUE_ = FEELin.unaryTest("true", {'?': false}); // https://nikku.github.io/feel-playground/?e=true&c=%7B%0A++%22%3F%22+%3A+false%0A%7D%0A&t=unaryTests&st=true
                                    // const FALSE = FEELin.unaryTest("false", {'?': false}); // https://nikku.github.io/feel-playground/?e=false&c=%7B%0A++%22%3F%22+%3A+false%0A%7D%0A&t=unaryTests&st=true
                                    // const FALSE_ = FEELin.unaryTest("false", {'?': true}); // OK

                                let evaluation = false;
                                try { // 'feelin' does not support 'matches' for regular expressions...
                                    evaluation = value !== false // See bug above...
                                        ? FEELin.unaryTest(column.text, {'?': value})
                                        : column.text === 'false' || column.text === FEEL._HYPHEN;
                                } catch (Error: unknown) {
                                    // Doesn't work (simple equality test is enough):
                                    // IMICROS_FEEL_interpreter.Evaluate('? in (' + '"A"' + ')',{'?': "A"});
                                    // Doesn't work as well (hyphen):
                                    // IMICROS_FEEL_interpreter.Evaluate('? in (' + '"A","B"' + ')', {'?': "-"});
                                    evaluation = IMICROS_FEEL_interpreter.Evaluate(column.text, {'?': value});
                                }

                                if (Is_DMN_UnaryTests(column) && !evaluation)
                                    FEEL._Rejected_rules.add(rule);
                            });
                        } else {
                            // Key name in 'data' does not exist in decision table:
                            decision_table.rule!.forEach(rule => FEEL._Rejected_rules.add(rule));
                            return false; // 'break' because of 'every'...
                        }
                        return true; // Required because of 'every'...
                    });
                    const unique = decision_table.rule!.filter(rule => !FEEL._Rejected_rules.has(rule)).length === 1;
                    decision_table.rule!.filter(rule => !FEEL._Rejected_rules.has(rule)).every((rule) => {
                        let i = 0;
                        decision_table.output!.forEach((output_clause: DMN_OutputClause) => {
                            const output_clause_name = Name_of_DMN_OutputClause(output_clause);
                            let index = keys.indexOf(output_clause_name);
                            const type = Type_of_DMN_OutputClause(output_clause, decision, true);
                            const value =
                                type === DMN_type_reference_.INTEGER || type === DMN_type_reference_.LONG
                                    ? parseInt(rule.outputEntry[i++].text)
                                    : type === DMN_type_reference_.NUMBER || type === DMN_type_reference_.DOUBLE
                                        ? parseFloat(rule.outputEntry[i++].text)
                                        : type === DMN_type_reference_.STRING
                                            // To be improved, remove ", if any, at first and last positions only:
                                            ? rule.outputEntry[i++].text.replace(/"/g, '')
                                            : rule.outputEntry[i++].text;
                            if (index !== -1)
                                datum = {...datum, [Object.keys(datum)[index]]: value};
                            else
                                // For example, 'Developer annual salary ($ US)' property is added to 'datum':
                                Object.defineProperty(datum, output_clause_name, {
                                    value: value,
                                    enumerable: true,
                                    configurable: false,
                                    writable: true
                                });
                        });
                        if (decision_table.hitPolicy === Hit_policy.FIRST || (decision_table.hitPolicy === Hit_policy.UNIQUE && unique)) {
                            // https://www.omg.org/spec/DMN/1.3/PDF: "The hit policy SHALL default to Unique, (...)"
                            Object.defineProperty(datum, _DMiNer_ + " " + (decision_table.hitPolicy ? decision_table.hitPolicy : Hit_policy.UNIQUE) + " hit rule(s)", {
                                value: 1 + decision_table.rule!.indexOf(rule),
                                enumerable: true,
                                configurable: true, // Training uses 'delete' operator...
                                writable: true
                            });
                            return false; // Stop 'every'...
                        }
                        // if (decision.decisionLogic.hitPolicy === Hit_policy.UNIQUE && !unique) { // Error...
                        //     Object.defineProperty(datum, _DMiNer_ + decision.decisionLogic.hitPolicy + " rule(s)_", {
                        //         value: new Array(1 + decision.decisionLogic.rule!.indexOf(rule)),
                        //         enumerable: true,
                        //         configurable: false,
                        //         writable: true
                        //     });
                        // }
                        return true; // Required because of 'every'...
                    });
                }
            );
        } else if (Is_DMN_LiteralExpression(decision.decisionLogic)) {
            // Example provided by Niko Rehwaldt:
            // https://nikku.github.io/feel-playground/?e=%7E3YCAkIDhgICAgICAgIC9AgCX7JaWhbH%2BfLiqAwJGq8kixXoeSV%2FB0DmL1svCwimZB3aPV6KPa2Ua4s3%2FvxGUB96ZoHqWAywEFUoHRIm8v9PXOLT4839%2FavcAgA%3D%3D&c=%7B%7D&t=expression&st=true
            // Use of 2 functions:
            // https://nikku.github.io/feel-playground/?e=%7E3YCAkIAQgICAgICAgIC9CARCoV4Vg%2FAfXdR1kNhmHVuxMxvyI3PvGN9JNutNptl1Afe8HtDTm%2F%2FVUphuPJ2woOF5x9g7UiBX13bQ7aNPH3SX1ebLnlf3KT0OR96J6njatCU8vw3CXEw4k83BrsosH9wReiUWuTuNfP3pgA%3D%3D&c=%7E3YCAkID8gICAgICAgIC9AgCXnJr%2FRHL49JRk94vvuuZNfNMaC1fNbDLwDmIgoVIgW8BqQFyqQOdF7K5tCIeURrjvGHiQu6kB5gNfEWQ700ZzPL6iHgztX2N0F7VDHVykny4Vf4QCgIA%3D&t=expression&st=true
            /**
             * 'Standardized Ratings[item.Rank=min(Standardized Ratings.Rank)][1].Rating'
             * https://nikku.github.io/feel-playground/?e=%7E3YCAkIDIgICAgICAgICpHYinkBVDi%2FOoc64%2F8j4WkelAyGcpcOTd5C0JzBNbQKfqlTcbg7%2BPqkZPr9IUuhp47g7VP359zgA%3D&c=%7E3YCAkIACgICAgICAgIC9AgCXnKGSJYCpfyXywCiWL22i1%2FG3dKC9H0s1vVonTF4ixbclvxDjlIcwQtQ5Ar%2BfuM7Zdyd1Q3BQD7BBNDlu2rIEpgNlv3%2FbzICA&t=expression&st=true
             */
            /**
             * 'decimal(min(append(Applicable Promotions.Price[item>0], Weekly Price*(1-.01*Discount Percent), Daily Price*(1-.01*Discount Percent))),2)'
             * https://nikku.github.io/feel-playground/?e=%7E3YCAkIAIgICAgICAgICymcgRsJ0sgUGrny%2FBK86Ha5kx0aNOFTaOXGrArBCqXsWDQ%2BpN7DbzJJvKs35MYZETf4MfyHn5FXsY17295zQ61NDXY%2BJ0umsp19GnKSU1t%2FvHZnUxBViIKlSR5xyatILTXeU0039q7YCA&c=%7E3YCAkID2gICAgICAgIC9AgCXnJiUiGzsMWbOrX4m7YV1k%2FK3Czmr%2FownMcxCzZI%2F8hoS%2FDsTer41o8qieEJaTzdd%2BBL6QMC68PA2tXPQqkfueZIlcwLmq4MMJ9PJv3vKr%2B4oAgKg%2BnnaVgA%3D&t=expression&st=true
             */
            /** Use of 'and' in variable name... Not sure "correct"?
             * 'for extracting in Instrument.externalRatings return Standardize and Rank Rating(extracting)'
             * https://nikku.github.io/feel-playground/?e=%7E3YCAkIDngYCAgICAgICXYPzO5AncnSDRNydiekMg063ePFgbjkfNWlHeS6lYvpT%2F%2BQHw%2Bd5zJfsO6eq0JKfMrmXw7Gi4%2BR7UKGz6ph%2FE7bgqUj5Jhs4ddBTsUdnGFX4Ub0a2EEL5eEtg1sOgqH86Z1jcGTxn2ATfDCtDyX4qp2UhuPap8Cekk2Jd7zNPg5xt2yNtLH8olGT%2Fd69U8%2FOF6e0QAR6agsgjNP77QllmuzdCwFwbLTUezfltoGx4GUkmJHAd%2B21RMXVc44nMV8Us5GpzzKq%2BhHsSBwPeScxqyoMChRUdI2j9QrbyzeZW2jgVL6PtrtJhn3630UA%3D&c=%7E3YCAkID8gICAgICAgIC9AgCXnKGSJYCpfyXywCiWL9aCcNApA%2BZ8uqjKV9BFDGuQlQlCOpsVUu40kxgS2UbtK87Fq2zGkNbh2%2BTLtwrsj%2By382SunJ6lilweNcahmq8CF%2BlsEcWW8hafcNpPXYBdICgqTseeMINc%2F8cDmnp%2BdOR2gA%3D%3D&t=expression&st=true
             */
            const literal_expression = decision.decisionLogic as DMN_LiteralExpression;
            if (Trace && !IMICROS_FEEL_interpreter.Parse(literal_expression))
                window.alert("Incorrect FEEL literal expression: " + literal_expression.text);
            data.forEach(datum => {
                let expression: string = "";
                Object.values(datum).forEach((value, index) => {
                    if (typeof value === 'string' && value.startsWith(typeof Function))
                        expression += '\"' + Object.keys(datum)[index] + '\": ' + value + ',';
                });
                /** LACE Scoring.dmn >> Comorbidity_Score_for_Listed_Conditions_FEEL.json
                 * 'if count(List of Conditions) > 0 then sum(for i in List of Conditions return Comorbidity Score(i)) else 0'
                 * https://nikku.github.io/feel-playground/?e=%7E3YCAkIBEgICAgICAgIC9AgCXnJmT5kMBvfI1FfOLS0fqCFGGgtthSC4%2BRUWDVrAMu9RdRy10c6K1XKLztvdAmM3hwAtV%2BB5h7kpf5xBh7154gV7f5RipG0SA2HsjYNRclyHsSKas%2BMciCCbSSFLhB6p6HtP2rP0W9OFb6qsAd5XRmUDMJX7SIVWfh4VIn1fGxl%2FOnNBqO5pC28gnjYUKT2gff3CEqIA%3D&c=%7E3YCAkIAQgICAgICAgIC9AgCXnJ0QR13uJVW9o58G9ermA9t9gAZeAx0i0aT3ksQL8TZqPvNfKpLOwaKsSZcqZeUo4h8T0wkFifKdigE%2F7pBnICwit36ff1EkEIA%3D&t=expression&st=true
                 * console.assert(expression === "{\"Comorbidity Score\": function(x) x.value * 2/3,FEEL_EXPRESSION: if count(List of Conditions) > 0 then sum(for i in List of Conditions return Comorbidity Score(i)) else 0}.FEEL_EXPRESSION");
                 */
                expression = expression === ""
                    ? literal_expression.text
                    : '{' + expression + FEEL._FEEL_EXPRESSION + ': ' + literal_expression.text + '}.' + FEEL._FEEL_EXPRESSION;
                // ca marche *SANS* les fonctions:
                //const result = IMICROS_FEEL_interpreter.Evaluate(expression, datum);

                // const result_ = IMICROS_FEEL_interpreter._Interpreter.evaluate("{calc:function(x:number) x * 2/3, XXX:calc(x:c)+3}.XXX", {
                //     c: 4,
                //     d: 5
                // });
                //const result = IMICROS_FEEL_interpreter._Interpreter.evaluate("{calc:function(x:string) x + \" Barbier\", y:calc(x:given_name.value) + \" as author...\"}.y", {given_name: {value: "Franck"}});

                Object.defineProperty(datum, 'variable' in decision ? decision.variable!.name! : Name_of_DMN_Decision(decision), {
                    value: FEELin.evaluate(expression, datum),
                    enumerable: true,
                    configurable: false,
                    writable: true
                });
            });
        } else
            throw new DMiNer_error(decision, DMiNer_error.No_business_logic);
        return Promise.resolve();
    }
}
