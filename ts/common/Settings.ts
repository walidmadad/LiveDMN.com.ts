export const _DMiNer_ = "_DMiNer_";
export const FEEL_range = /^[[(\]]\d{1,}\.\.\d{1,}[[)\]]$/;
export const Trace = true; // 'false' in production mode...

export enum Drop_mode {
    FEEL = "FEEL",
    PREDICT = "PREDICT",
    TRAIN = "TRAIN",
    VISUALIZE = "VISUALIZE"
}

export enum State_mode {
    MENU = "MENU",
    RANDOMIZE = "RANDOMIZE"
}

export enum Status_mode {
    FELT = "FELT",
    PREDICTED = "PREDICTED",
    RANDOMIZED = "RANDOMIZED"
}

export enum Hit_policy { // DMN 1.3
    ANY = "ANY",
    COLLECT = "COLLECT",
    FIRST = "FIRST",
    OUTPUT_ORDER = "OUTPUT ORDER",
    PRIORITY = "PRIORITY",
    RULE_ORDER = "RULE ORDER",
    UNIQUE = "UNIQUE"
}

export class DMiNer_error extends Error {
    static readonly Inconsistent_DMN_diagram = "<strong>Inconsistent DMN diagram</strong>";
    static readonly Invalid_data_format = "<strong>Invalid data format</strong>";
    static readonly Invalid_drop_mode = "<strong>Invalid drop mode</strong>";
    static readonly Invalid_JSON = "<strong>Invalid JSON</strong>";
    static readonly No_business_logic = "<strong>No business logic</strong>";
    static readonly No_possible_randomization = "<strong>No possible randomization</strong>";
    static readonly No_possible_visualization = "<strong>No possible visualization</strong>";
    static readonly Not_trained = "<strong>Not trained</strong>";
    static readonly Separator = " &rarrc; ";
    static readonly TensorFlow_js = "<strong>TensorFlow.js</strong>";
    static readonly Undefined_DMN_type = "<strong>Undefined DMN type</strong>";

    constructor(readonly me: ModdleElement, ...messages: Array<string>) {
        super(Name_of_ModdleElement(me) + DMiNer_error.Separator + messages.join(DMiNer_error.Separator));
    }
}

export interface ModdleElement {
    // $attrs: Object; // Unused...
    id: string;
    name?: string;
    $parent: ModdleElement | undefined;
    $type: string;
}

export function Name_of_ModdleElement(me: ModdleElement): string {
    return 'name' in me ? me.name! : (me.$type + me.id);
}

// https://docs.camunda.org/manual/7.18/user-guide/dmn-engine/data-types/#supported-data-types
export enum DMN_type_reference_ {
    BOOLEAN = 'boolean',
    DATE = 'date',
    DOUBLE = 'double',
    ENUMERATION = 'enum',
    INTEGER = 'integer',
    LONG = 'long',
    NUMBER = 'number',
    STRING = 'string'
}

export function Is_DMN_type_reference_(type_reference: string | undefined): type_reference is DMN_type_reference_ {
    if (type_reference === undefined)
        return false;
    return Object.values(DMN_type_reference_).includes(type_reference.toLowerCase() as DMN_type_reference_);
}

export type DMN_type_reference = boolean | Date | number | string;

export interface Data {
    action: Drop_mode | Status_mode;
    data: Array<Object>;
}

export function Is_Data(data: Data): data is Data {
    return "action" in data
        && (Object.values(Drop_mode).includes((data.action as string).toUpperCase() as Drop_mode)
            || Object.values(Status_mode).includes((data.action as string).toUpperCase() as Status_mode))
        && "data" in data && Array.isArray(data.data);
}

export type TensorFlow_datum = Array<Array<0 | 1> | DMN_type_reference>;
export type TensorFlow_data = Array<TensorFlow_datum>;

const _DMN_AuthorityRequirement: 'dmn:AuthorityRequirement' = 'dmn:AuthorityRequirement';
const _DMN_BusinessKnowledgeModel: 'dmn:BusinessKnowledgeModel' = 'dmn:BusinessKnowledgeModel';
const _DMN_Context: 'dmn:Context' = 'dmn:Context';
const _DMN_ContextEntry: 'dmn:ContextEntry' = 'dmn:ContextEntry';
const _DMN_Decision: 'dmn:Decision' = 'dmn:Decision';
const _DMN_DecisionRule: 'dmn:DecisionRule' = 'dmn:DecisionRule';
/**
 * A decision service exposes one or more
 * decisions from a decision model as a reusable element, a service, which might be consumed (for example) internally by
 * another decision in the decision model, or externally by a task in a BPMN process model.
 */
const _DMN_DecisionService: 'dmn:DecisionService' = 'dmn:DecisionService';
const _DMN_DecisionTable: 'dmn:DecisionTable' = 'dmn:DecisionTable';
const _DMN_Definitions: 'dmn:Definitions' = 'dmn:Definitions';
const _DMN_DMNElementReference: 'dmn:DMNElementReference' = 'dmn:DMNElementReference';
const _DMN_InformationItem: 'dmn:InformationItem' = 'dmn:InformationItem';
const _DMN_InformationRequirement: 'dmn:InformationRequirement' = 'dmn:InformationRequirement';
const _DMN_InputClause: 'dmn:InputClause' = 'dmn:InputClause';
const _DMN_InputData: 'dmn:InputData' = 'dmn:InputData';
const _DMN_ItemDefinition: 'dmn:ItemDefinition' = 'dmn:ItemDefinition';
const _DMN_Invocation: 'dmn:Invocation' = 'dmn:Invocation'; // Alternative to decision table and literal expression
const _DMN_KnowledgeRequirement: 'dmn:KnowledgeRequirement' = 'dmn:KnowledgeRequirement';
const _DMN_KnowledgeSource: 'dmn:KnowledgeSource' = 'dmn:KnowledgeSource';
const _DMN_LiteralExpression: 'dmn:LiteralExpression' = 'dmn:LiteralExpression';
const _DMN_OutputClause: 'dmn:OutputClause' = 'dmn:OutputClause';
const _DMN_RuleAnnotationClause: 'dmn:RuleAnnotationClause' = 'dmn:RuleAnnotationClause';
const _DMN_UnaryTests: 'dmn:UnaryTests' = 'dmn:UnaryTests';

export interface DMN_AuthorityRequirement extends ModdleElement {
    $type: typeof _DMN_AuthorityRequirement;
    requiredAuthority?: DMN_DMNElementReference;
    requiredDecision?: DMN_DMNElementReference;
}

export interface DMN_BusinessKnowledgeModel extends ModdleElement {
    $type: typeof _DMN_BusinessKnowledgeModel;
}

export interface DMN_Context extends ModdleElement {
    $type: typeof _DMN_Context;
    contextEntry: Array<DMN_ContextEntry>;
    typeRef: DMN_type_reference_;
}

export function Is_DMN_Context(me: ModdleElement): me is DMN_Context {
    return '$type' in me && me.$type === _DMN_Context && 'contextEntry' in me && 'typeRef' in me;
}

export interface DMN_ContextEntry extends ModdleElement {
    $type: typeof _DMN_ContextEntry;
    value: DMN_LiteralExpression;
    variable: DMN_InformationItem;
}

export interface DMN_Decision extends ModdleElement {
    $parent: DMN_Definitions;
    $type: typeof _DMN_Decision;
    allowedAnswers?: string;
    authorityRequirement?: Array<DMN_AuthorityRequirement>; // Knowledge source(s)
    decisionLogic: DMN_Context | DMN_DecisionTable | DMN_LiteralExpression;
    description?: string;
    informationRequirement?: Array<DMN_InformationRequirement>; // Input data
    knowledgeRequirement?: Array<DMN_KnowledgeRequirement>; // Knowledge model(s)
    question?: string;
    variable?: DMN_InformationItem;
}

export function Is_DMN_Decision(me: ModdleElement): me is DMN_Decision {
    return '$type' in me && me.$type === _DMN_Decision && 'decisionLogic' in me;
}

export function Name_of_DMN_Decision(decision: DMN_Decision): string {
    return 'name' in decision ? decision.name! : decision.id;
}

export interface DMN_DecisionTable extends ModdleElement {
    $parent: DMN_Decision; // Overriding...
    $type: typeof _DMN_DecisionTable;
    annotation?: Array<DMN_RuleAnnotationClause>;
    hitPolicy?: Hit_policy;
    input?: Array<DMN_InputClause>;
    output?: Array<DMN_OutputClause>;
    outputLabel?: string;
    rule?: Array<DMN_DecisionRule>;
}

export function Is_DMN_DecisionTable(me: ModdleElement): me is DMN_DecisionTable {
    return '$type' in me && me.$type === _DMN_DecisionTable && 'input' in me && 'output' in me && 'rule' in me;
}

export interface DMN_DecisionRule extends ModdleElement {
    $type: typeof _DMN_DecisionRule;
    description: string;
    inputEntry: Array<DMN_UnaryTests>;
    outputEntry: Array<DMN_LiteralExpression>;
}

export interface DMN_Definitions extends ModdleElement {
    $type: typeof _DMN_Definitions;
    // artifact?: Array<ModdleElement>; // 'dmn:Association' | 'dmn:TextAnnotation'
    // dmnDI: DMNDI_DMNDI;
    drgElement: Array<DMN_BusinessKnowledgeModel | DMN_Decision | DMN_InputData | DMN_KnowledgeSource>;
    itemDefinition: Array<DMN_ItemDefinition>;
}

export function _Get_type_reference_from_DMN_Definitions(me: DMN_Definitions, type_name: string | undefined): DMN_type_reference_ | undefined {
    if (Trace)
        console.assert(Is_DMN_Definitions(me), "'_Get_type_reference_from_DMN_Definitions' >> 'Is_DMN_Definitions(me)', untrue");
    if (type_name === undefined) return undefined;
    const index = me.itemDefinition.findIndex((item: DMN_ItemDefinition) => item.name === type_name);
    return index !== -1 ? me.itemDefinition[index].typeRef : undefined;
}

export function Is_DMN_Definitions(me: ModdleElement): me is DMN_Definitions {
    return '$type' in me && me.$type === _DMN_Definitions && 'drgElement' in me;
}

// export interface DMNDI_DMNDI extends ModdleElement {
//     $type: 'dmndi:DMNDI';
//     diagrams: Array<DMNDI_DMNDiagram>;
// }

// export interface DMNDI_DMNDiagram extends ModdleElement {
//     $type: 'dmndi:DMNDiagram';
//     diagramElements: Array<ModdleElement>; // 'dmndi:DMNEdge' | 'dmndi:DMNShape'
// }

export interface DMN_DMNElementReference extends ModdleElement {
    $type: typeof _DMN_DMNElementReference;
    href: string; // Example: "#temperature_id"
}

export interface DMN_InformationItem extends ModdleElement {
    $type: typeof _DMN_InformationItem;
    typeRef: DMN_type_reference_;
}

export interface DMN_InformationRequirement extends ModdleElement {
    $type: typeof _DMN_InformationRequirement;
    requiredDecision?: DMN_DMNElementReference;
    requiredInput?: DMN_DMNElementReference;
}

export function Is_DMN_InformationRequirement(me: ModdleElement): me is DMN_InformationRequirement {
    return '$type' in me && me.$type === _DMN_InformationRequirement && 'requiredInput' in me;
}

export interface DMN_InputClause extends ModdleElement {
    $parent: DMN_DecisionTable; // Overriding...
    $type: typeof _DMN_InputClause;
    inputExpression?: DMN_LiteralExpression;
    inputValues?: DMN_UnaryTests;
    label?: string;
    typeRef?: DMN_type_reference_;
    width?: number;
}

export function Get_enumeration_from_DMN_InputClause(me: DMN_InputClause): Array<any> | never {
    // if (Trace)
    //     console.assert(_Is_DMN_InputClause_enumeration_(me), "Get_enumeration_from_DMN_InputClause >> '_Is_DMN_InputClause_enumeration_(me)', untrue");
    let type_reference = 'inputExpression' in me ? me.inputExpression!.typeRef : undefined;
    if (Is_DMN_type_reference_(type_reference) === false) {
        type_reference = _Get_type_reference_from_DMN_Definitions(me.$parent.$parent.$parent as DMN_Definitions, type_reference);
        if (type_reference === undefined)
            throw new DMiNer_error(me, DMiNer_error.Undefined_DMN_type, Name_of_DMN_InputClause(me));
    }
    if (type_reference === DMN_type_reference_.BOOLEAN)
        return new Array(false, true);
    else if (type_reference === DMN_type_reference_.STRING) {
        const extraction = _Extract_enumeration_values(me.inputValues!.text);
        if (extraction === null)
            throw new DMiNer_error(me, DMiNer_error.Undefined_DMN_type, Name_of_DMN_InputClause(me));
        return extraction;
    } else {
        const extraction = _Extract_enumeration_values(me.inputValues!.text, type_reference);
        if (extraction === null)
            throw new DMiNer_error(me, DMiNer_error.Undefined_DMN_type, Name_of_DMN_InputClause(me));
        return extraction;
    }
}

function _Is_DMN_InputClause_enumeration_(me: DMN_InputClause): boolean {
    return 'inputExpression' in me && 'typeRef' in me.inputExpression! && ('inputValues' in me || me.inputExpression.typeRef === DMN_type_reference_.BOOLEAN);
}

export function Name_of_DMN_InputClause(me: DMN_InputClause): string {
    return 'label' in me ? me.label! : 'name' in me ? me.name! : 'inputExpression' in me && 'name' in me.inputExpression! ? me.inputExpression.name! : me.id;
}

export function Type_of_DMN_InputClause(me: DMN_InputClause, decision: DMN_Decision): DMN_type_reference_ | never {
    if (_Is_DMN_InputClause_enumeration_(me))
        return DMN_type_reference_.ENUMERATION;
    else if ('typeRef' in me) {
        if (Is_DMN_type_reference_(me.typeRef!))
            return me.typeRef;
        else {
            const base_type = _Get_type_reference_from_DMN_Definitions(decision.$parent, me.typeRef! as string);
            return base_type && Is_DMN_type_reference_(base_type) ? base_type : DMN_type_reference_.STRING;
        }
    } else {
        if ('inputExpression' in me && 'typeRef' in me.inputExpression!) {
            if (Is_DMN_type_reference_(me.inputExpression.typeRef))
                return me.inputExpression.typeRef;
            else {
                const base_type = _Get_type_reference_from_DMN_Definitions(decision.$parent, me.inputExpression!.typeRef as string);
                return base_type && Is_DMN_type_reference_(base_type) ? base_type : DMN_type_reference_.STRING;
            }
        }
    }
    throw new DMiNer_error(me, DMiNer_error.Undefined_DMN_type, Name_of_DMN_InputClause(me));
}

export interface DMN_InputData extends ModdleElement {
    $type: typeof _DMN_InputData;
    name: string;
    variable?: DMN_InformationItem;
}

export function Is_DMN_InputData(me: ModdleElement): me is DMN_InputData {
    return '$type' in me && me.$type === _DMN_InputData;
}

export interface DMN_ItemDefinition {
    $type: typeof _DMN_ItemDefinition;
    allowedValues?: DMN_UnaryTests;
    itemComponent?: Array<DMN_ItemDefinition>;
    label: string;
    name: string;
    typeRef?: DMN_type_reference_;
}

export interface DMN_KnowledgeRequirement extends ModdleElement {
    $type: typeof _DMN_KnowledgeRequirement;
    requiredKnowledge: DMN_DMNElementReference;
}

export interface DMN_KnowledgeSource extends ModdleElement {
    $type: typeof _DMN_KnowledgeSource;
    authorityRequirement?: Array<DMN_AuthorityRequirement>;
}

export interface DMN_LiteralExpression extends ModdleElement {
    $type: typeof _DMN_LiteralExpression;
    text: string;
    typeRef: DMN_type_reference_;
}

export function Is_DMN_LiteralExpression(me: ModdleElement): me is DMN_LiteralExpression {
    return '$type' in me && me.$type === _DMN_LiteralExpression && 'text' in me && 'typeRef' in me;
}

export interface DMN_OutputClause extends ModdleElement {
    $parent: DMN_DecisionTable; // Overriding...
    $type: typeof _DMN_OutputClause;
    label?: string;
    outputValues?: DMN_UnaryTests;
    typeRef?: DMN_type_reference_;
}

function _Extract_enumeration_values(enumeration: string): Array<string> | null;
function _Extract_enumeration_values(enumeration: string, type_reference: DMN_type_reference_): Array<number> | null;
function _Extract_enumeration_values(enumeration: string, type_reference?: DMN_type_reference_): Array<string> | Array<number> | null {
    if (type_reference) {
        if (FEEL_range.test(enumeration)) {
            const values = enumeration.match(/\d+/g)!.map(value => parseInt(value));
            const start = /^[\(\]]/.test(enumeration) ? Math.min(...values) + 1 : Math.min(...values);
            const end = /[\)\[]$/.test(enumeration) ? Math.max(...values) - 1 : Math.max(...values);
            values.length = 0;
            for (let i = start; i <= end; i++)
                values.push(i);
            return values;
        } else if (type_reference === DMN_type_reference_.INTEGER || type_reference === DMN_type_reference_.LONG)
            return enumeration.split(',').map(value => parseInt(value));
        else if (type_reference === DMN_type_reference_.DOUBLE || type_reference === DMN_type_reference_.NUMBER)
            return enumeration.split(',').map(value => parseFloat(value));
        return null;
    }
    const values = enumeration.match(/"\w+( \w+)*"/g);
    return values === null ? values : values.map(value => value.replace(/^"/g, '').replace(/"$/g, ''));
}

export function Get_enumeration_from_DMN_OutputClause(me: DMN_OutputClause): Array<any> | never {
    // if (Trace)
    //     console.assert(_Is_DMN_OutputClause_enumeration_(me), "Get_enumeration_from_DMN_OutputClause >> '_Is_DMN_OutputClause_enumeration_(me)', untrue");
    let type_reference = me.typeRef;
    if (Is_DMN_type_reference_(type_reference) === false) {
        type_reference = _Get_type_reference_from_DMN_Definitions(me.$parent.$parent.$parent as DMN_Definitions, type_reference);
        if (type_reference === undefined)
            throw new DMiNer_error(me, DMiNer_error.Undefined_DMN_type, Name_of_DMN_OutputClause(me));
    }
    if (type_reference === DMN_type_reference_.BOOLEAN)
        return new Array(false, true);
    else if (type_reference === DMN_type_reference_.STRING) {
        const extraction = _Extract_enumeration_values(me.outputValues!.text);
        if (extraction === null)
            throw new DMiNer_error(me, DMiNer_error.Undefined_DMN_type, Name_of_DMN_OutputClause(me));
        return extraction;
    } else {
        const extraction = _Extract_enumeration_values(me.outputValues!.text, type_reference);
        if (extraction === null)
            throw new DMiNer_error(me, DMiNer_error.Undefined_DMN_type, Name_of_DMN_OutputClause(me));
        return extraction;
    }
}

function _Is_DMN_OutputClause_enumeration_(me: DMN_OutputClause): boolean {
    // 'typeRef' may be missing even though 'outputValues' is present -> "enumeration" anyway...
    return /*'typeRef' in me &&*/ 'outputValues' in me;
}

export function Name_of_DMN_OutputClause(me: DMN_OutputClause): string {
    return 'label' in me ? me.label! : 'name' in me ? me.name! : 'outputLabel' in me.$parent ? me.$parent.outputLabel! : 'name' in me.$parent.$parent ? me.$parent.$parent.name! : me.id;
}

export function Type_of_DMN_OutputClause(me: DMN_OutputClause, decision: DMN_Decision, primitive_type = false): DMN_type_reference_ | never {
    if (primitive_type === false && _Is_DMN_OutputClause_enumeration_(me))
        return DMN_type_reference_.ENUMERATION;
    else if ('typeRef' in me)
        if (Is_DMN_type_reference_(me.typeRef!))
            return me.typeRef;
        else {
            const base_type = _Get_type_reference_from_DMN_Definitions(decision.$parent, me.typeRef! as string);
            return base_type && Is_DMN_type_reference_(base_type) ? base_type : DMN_type_reference_.STRING;
        }
    throw new DMiNer_error(me, DMiNer_error.Undefined_DMN_type, Name_of_DMN_OutputClause(me));
}

export interface DMN_RuleAnnotationClause extends ModdleElement {
    $type: typeof _DMN_RuleAnnotationClause;
}

export interface DMN_UnaryTests extends ModdleElement {
    $type: typeof _DMN_UnaryTests;
    text: string;
}

export function Is_DMN_UnaryTests(me: ModdleElement): me is DMN_UnaryTests {
    return '$type' in me && me.$type === _DMN_UnaryTests && 'text' in me;
}
