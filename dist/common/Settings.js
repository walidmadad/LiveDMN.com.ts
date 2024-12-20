export const _DMiNer_ = "_DMiNer_";
export const FEEL_range = /^[[(\]]\d{1,}\.\.\d{1,}[[)\]]$/;
export const Trace = true; // 'false' in production mode...
export var Drop_mode;
(function (Drop_mode) {
    Drop_mode["FEEL"] = "FEEL";
    Drop_mode["PREDICT"] = "PREDICT";
    Drop_mode["TRAIN"] = "TRAIN";
    Drop_mode["VISUALIZE"] = "VISUALIZE";
})(Drop_mode || (Drop_mode = {}));
export var State_mode;
(function (State_mode) {
    State_mode["MENU"] = "MENU";
    State_mode["RANDOMIZE"] = "RANDOMIZE";
})(State_mode || (State_mode = {}));
export var Status_mode;
(function (Status_mode) {
    Status_mode["FELT"] = "FELT";
    Status_mode["PREDICTED"] = "PREDICTED";
    Status_mode["RANDOMIZED"] = "RANDOMIZED";
})(Status_mode || (Status_mode = {}));
export var Hit_policy;
(function (Hit_policy) {
    Hit_policy["ANY"] = "ANY";
    Hit_policy["COLLECT"] = "COLLECT";
    Hit_policy["FIRST"] = "FIRST";
    Hit_policy["OUTPUT_ORDER"] = "OUTPUT ORDER";
    Hit_policy["PRIORITY"] = "PRIORITY";
    Hit_policy["RULE_ORDER"] = "RULE ORDER";
    Hit_policy["UNIQUE"] = "UNIQUE";
})(Hit_policy || (Hit_policy = {}));
export class DMiNer_error extends Error {
    constructor(me, ...messages) {
        super(Name_of_ModdleElement(me) + DMiNer_error.Separator + messages.join(DMiNer_error.Separator));
        this.me = me;
    }
}
DMiNer_error.Inconsistent_DMN_diagram = "<strong>Inconsistent DMN diagram</strong>";
DMiNer_error.Invalid_data_format = "<strong>Invalid data format</strong>";
DMiNer_error.Invalid_drop_mode = "<strong>Invalid drop mode</strong>";
DMiNer_error.Invalid_JSON = "<strong>Invalid JSON</strong>";
DMiNer_error.No_business_logic = "<strong>No business logic</strong>";
DMiNer_error.No_possible_randomization = "<strong>No possible randomization</strong>";
DMiNer_error.No_possible_visualization = "<strong>No possible visualization</strong>";
DMiNer_error.Not_trained = "<strong>Not trained</strong>";
DMiNer_error.Separator = " &rarrc; ";
DMiNer_error.TensorFlow_js = "<strong>TensorFlow.js</strong>";
DMiNer_error.Undefined_DMN_type = "<strong>Undefined DMN type</strong>";
export function Name_of_ModdleElement(me) {
    return 'name' in me ? me.name : (me.$type + me.id);
}
// https://docs.camunda.org/manual/7.18/user-guide/dmn-engine/data-types/#supported-data-types
export var DMN_type_reference_;
(function (DMN_type_reference_) {
    DMN_type_reference_["BOOLEAN"] = "boolean";
    DMN_type_reference_["DATE"] = "date";
    DMN_type_reference_["DOUBLE"] = "double";
    DMN_type_reference_["ENUMERATION"] = "enum";
    DMN_type_reference_["INTEGER"] = "integer";
    DMN_type_reference_["LONG"] = "long";
    DMN_type_reference_["NUMBER"] = "number";
    DMN_type_reference_["STRING"] = "string";
})(DMN_type_reference_ || (DMN_type_reference_ = {}));
export function Is_DMN_type_reference_(type_reference) {
    if (type_reference === undefined)
        return false;
    return Object.values(DMN_type_reference_).includes(type_reference.toLowerCase());
}
export function Is_Data(data) {
    return "action" in data
        && (Object.values(Drop_mode).includes(data.action.toUpperCase())
            || Object.values(Status_mode).includes(data.action.toUpperCase()))
        && "data" in data && Array.isArray(data.data);
}
const _DMN_AuthorityRequirement = 'dmn:AuthorityRequirement';
const _DMN_BusinessKnowledgeModel = 'dmn:BusinessKnowledgeModel';
const _DMN_Context = 'dmn:Context';
const _DMN_ContextEntry = 'dmn:ContextEntry';
const _DMN_Decision = 'dmn:Decision';
const _DMN_DecisionRule = 'dmn:DecisionRule';
/**
 * A decision service exposes one or more
 * decisions from a decision model as a reusable element, a service, which might be consumed (for example) internally by
 * another decision in the decision model, or externally by a task in a BPMN process model.
 */
const _DMN_DecisionService = 'dmn:DecisionService';
const _DMN_DecisionTable = 'dmn:DecisionTable';
const _DMN_Definitions = 'dmn:Definitions';
const _DMN_DMNElementReference = 'dmn:DMNElementReference';
const _DMN_InformationItem = 'dmn:InformationItem';
const _DMN_InformationRequirement = 'dmn:InformationRequirement';
const _DMN_InputClause = 'dmn:InputClause';
const _DMN_InputData = 'dmn:InputData';
const _DMN_ItemDefinition = 'dmn:ItemDefinition';
const _DMN_Invocation = 'dmn:Invocation'; // Alternative to decision table and literal expression
const _DMN_KnowledgeRequirement = 'dmn:KnowledgeRequirement';
const _DMN_KnowledgeSource = 'dmn:KnowledgeSource';
const _DMN_LiteralExpression = 'dmn:LiteralExpression';
const _DMN_OutputClause = 'dmn:OutputClause';
const _DMN_RuleAnnotationClause = 'dmn:RuleAnnotationClause';
const _DMN_UnaryTests = 'dmn:UnaryTests';
export function Is_DMN_Context(me) {
    return '$type' in me && me.$type === _DMN_Context && 'contextEntry' in me && 'typeRef' in me;
}
export function Is_DMN_Decision(me) {
    return '$type' in me && me.$type === _DMN_Decision && 'decisionLogic' in me;
}
export function Name_of_DMN_Decision(decision) {
    return 'name' in decision ? decision.name : decision.id;
}
export function Is_DMN_DecisionTable(me) {
    return '$type' in me && me.$type === _DMN_DecisionTable && 'input' in me && 'output' in me && 'rule' in me;
}
export function _Get_type_reference_from_DMN_Definitions(me, type_name) {
    if (Trace)
        console.assert(Is_DMN_Definitions(me), "'_Get_type_reference_from_DMN_Definitions' >> 'Is_DMN_Definitions(me)', untrue");
    if (type_name === undefined)
        return undefined;
    const index = me.itemDefinition.findIndex((item) => item.name === type_name);
    return index !== -1 ? me.itemDefinition[index].typeRef : undefined;
}
export function Is_DMN_Definitions(me) {
    return '$type' in me && me.$type === _DMN_Definitions && 'drgElement' in me;
}
export function Is_DMN_InformationRequirement(me) {
    return '$type' in me && me.$type === _DMN_InformationRequirement && 'requiredInput' in me;
}
export function Get_enumeration_from_DMN_InputClause(me) {
    // if (Trace)
    //     console.assert(_Is_DMN_InputClause_enumeration_(me), "Get_enumeration_from_DMN_InputClause >> '_Is_DMN_InputClause_enumeration_(me)', untrue");
    let type_reference = 'inputExpression' in me ? me.inputExpression.typeRef : undefined;
    if (Is_DMN_type_reference_(type_reference) === false) {
        type_reference = _Get_type_reference_from_DMN_Definitions(me.$parent.$parent.$parent, type_reference);
        if (type_reference === undefined)
            throw new DMiNer_error(me, DMiNer_error.Undefined_DMN_type, Name_of_DMN_InputClause(me));
    }
    if (type_reference === DMN_type_reference_.BOOLEAN)
        return new Array(false, true);
    else if (type_reference === DMN_type_reference_.STRING) {
        const extraction = _Extract_enumeration_values(me.inputValues.text);
        if (extraction === null)
            throw new DMiNer_error(me, DMiNer_error.Undefined_DMN_type, Name_of_DMN_InputClause(me));
        return extraction;
    }
    else {
        const extraction = _Extract_enumeration_values(me.inputValues.text, type_reference);
        if (extraction === null)
            throw new DMiNer_error(me, DMiNer_error.Undefined_DMN_type, Name_of_DMN_InputClause(me));
        return extraction;
    }
}
function _Is_DMN_InputClause_enumeration_(me) {
    return 'inputExpression' in me && 'typeRef' in me.inputExpression && ('inputValues' in me || me.inputExpression.typeRef === DMN_type_reference_.BOOLEAN);
}
export function Name_of_DMN_InputClause(me) {
    return 'label' in me ? me.label : 'name' in me ? me.name : 'inputExpression' in me && 'name' in me.inputExpression ? me.inputExpression.name : me.id;
}
export function Type_of_DMN_InputClause(me, decision) {
    if (_Is_DMN_InputClause_enumeration_(me))
        return DMN_type_reference_.ENUMERATION;
    else if ('typeRef' in me) {
        if (Is_DMN_type_reference_(me.typeRef))
            return me.typeRef;
        else {
            const base_type = _Get_type_reference_from_DMN_Definitions(decision.$parent, me.typeRef);
            return base_type && Is_DMN_type_reference_(base_type) ? base_type : DMN_type_reference_.STRING;
        }
    }
    else {
        if ('inputExpression' in me && 'typeRef' in me.inputExpression) {
            if (Is_DMN_type_reference_(me.inputExpression.typeRef))
                return me.inputExpression.typeRef;
            else {
                const base_type = _Get_type_reference_from_DMN_Definitions(decision.$parent, me.inputExpression.typeRef);
                return base_type && Is_DMN_type_reference_(base_type) ? base_type : DMN_type_reference_.STRING;
            }
        }
    }
    throw new DMiNer_error(me, DMiNer_error.Undefined_DMN_type, Name_of_DMN_InputClause(me));
}
export function Is_DMN_InputData(me) {
    return '$type' in me && me.$type === _DMN_InputData;
}
export function Is_DMN_LiteralExpression(me) {
    return '$type' in me && me.$type === _DMN_LiteralExpression && 'text' in me && 'typeRef' in me;
}
function _Extract_enumeration_values(enumeration, type_reference) {
    if (type_reference) {
        if (FEEL_range.test(enumeration)) {
            const values = enumeration.match(/\d+/g).map(value => parseInt(value));
            const start = /^[\(\]]/.test(enumeration) ? Math.min(...values) + 1 : Math.min(...values);
            const end = /[\)\[]$/.test(enumeration) ? Math.max(...values) - 1 : Math.max(...values);
            values.length = 0;
            for (let i = start; i <= end; i++)
                values.push(i);
            return values;
        }
        else if (type_reference === DMN_type_reference_.INTEGER || type_reference === DMN_type_reference_.LONG)
            return enumeration.split(',').map(value => parseInt(value));
        else if (type_reference === DMN_type_reference_.DOUBLE || type_reference === DMN_type_reference_.NUMBER)
            return enumeration.split(',').map(value => parseFloat(value));
        return null;
    }
    const values = enumeration.match(/"\w+( \w+)*"/g);
    return values === null ? values : values.map(value => value.replace(/^"/g, '').replace(/"$/g, ''));
}
export function Get_enumeration_from_DMN_OutputClause(me) {
    // if (Trace)
    //     console.assert(_Is_DMN_OutputClause_enumeration_(me), "Get_enumeration_from_DMN_OutputClause >> '_Is_DMN_OutputClause_enumeration_(me)', untrue");
    let type_reference = me.typeRef;
    if (Is_DMN_type_reference_(type_reference) === false) {
        type_reference = _Get_type_reference_from_DMN_Definitions(me.$parent.$parent.$parent, type_reference);
        if (type_reference === undefined)
            throw new DMiNer_error(me, DMiNer_error.Undefined_DMN_type, Name_of_DMN_OutputClause(me));
    }
    if (type_reference === DMN_type_reference_.BOOLEAN)
        return new Array(false, true);
    else if (type_reference === DMN_type_reference_.STRING) {
        const extraction = _Extract_enumeration_values(me.outputValues.text);
        if (extraction === null)
            throw new DMiNer_error(me, DMiNer_error.Undefined_DMN_type, Name_of_DMN_OutputClause(me));
        return extraction;
    }
    else {
        const extraction = _Extract_enumeration_values(me.outputValues.text, type_reference);
        if (extraction === null)
            throw new DMiNer_error(me, DMiNer_error.Undefined_DMN_type, Name_of_DMN_OutputClause(me));
        return extraction;
    }
}
function _Is_DMN_OutputClause_enumeration_(me) {
    // 'typeRef' may be missing even though 'outputValues' is present -> "enumeration" anyway...
    return /*'typeRef' in me &&*/ 'outputValues' in me;
}
export function Name_of_DMN_OutputClause(me) {
    return 'label' in me ? me.label : 'name' in me ? me.name : 'outputLabel' in me.$parent ? me.$parent.outputLabel : 'name' in me.$parent.$parent ? me.$parent.$parent.name : me.id;
}
export function Type_of_DMN_OutputClause(me, decision, primitive_type = false) {
    if (primitive_type === false && _Is_DMN_OutputClause_enumeration_(me))
        return DMN_type_reference_.ENUMERATION;
    else if ('typeRef' in me)
        if (Is_DMN_type_reference_(me.typeRef))
            return me.typeRef;
        else {
            const base_type = _Get_type_reference_from_DMN_Definitions(decision.$parent, me.typeRef);
            return base_type && Is_DMN_type_reference_(base_type) ? base_type : DMN_type_reference_.STRING;
        }
    throw new DMiNer_error(me, DMiNer_error.Undefined_DMN_type, Name_of_DMN_OutputClause(me));
}
export function Is_DMN_UnaryTests(me) {
    return '$type' in me && me.$type === _DMN_UnaryTests && 'text' in me;
}
//# sourceMappingURL=Settings.js.map