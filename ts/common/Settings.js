"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.DMN_type_reference_ = exports.DMiNer_error = exports.Hit_policy = exports.Status_mode = exports.State_mode = exports.Drop_mode = exports.Trace = exports.FEEL_range = exports._DMiNer_ = void 0;
exports.Name_of_ModdleElement = Name_of_ModdleElement;
exports.Is_DMN_type_reference_ = Is_DMN_type_reference_;
exports.Is_Data = Is_Data;
exports.Is_DMN_Context = Is_DMN_Context;
exports.Is_DMN_Decision = Is_DMN_Decision;
exports.Name_of_DMN_Decision = Name_of_DMN_Decision;
exports.Is_DMN_DecisionTable = Is_DMN_DecisionTable;
exports._Get_type_reference_from_DMN_Definitions = _Get_type_reference_from_DMN_Definitions;
exports.Is_DMN_Definitions = Is_DMN_Definitions;
exports.Is_DMN_InformationRequirement = Is_DMN_InformationRequirement;
exports.Get_enumeration_from_DMN_InputClause = Get_enumeration_from_DMN_InputClause;
exports.Name_of_DMN_InputClause = Name_of_DMN_InputClause;
exports.Type_of_DMN_InputClause = Type_of_DMN_InputClause;
exports.Is_DMN_InputData = Is_DMN_InputData;
exports.Is_DMN_LiteralExpression = Is_DMN_LiteralExpression;
exports.Get_enumeration_from_DMN_OutputClause = Get_enumeration_from_DMN_OutputClause;
exports.Name_of_DMN_OutputClause = Name_of_DMN_OutputClause;
exports.Type_of_DMN_OutputClause = Type_of_DMN_OutputClause;
exports.Is_DMN_UnaryTests = Is_DMN_UnaryTests;
exports._DMiNer_ = "_DMiNer_";
exports.FEEL_range = /^[[(\]]\d{1,}\.\.\d{1,}[[)\]]$/;
exports.Trace = true; // 'false' in production mode...
var Drop_mode;
(function (Drop_mode) {
    Drop_mode["FEEL"] = "FEEL";
    Drop_mode["PREDICT"] = "PREDICT";
    Drop_mode["TRAIN"] = "TRAIN";
    Drop_mode["VISUALIZE"] = "VISUALIZE";
})(Drop_mode || (exports.Drop_mode = Drop_mode = {}));
var State_mode;
(function (State_mode) {
    State_mode["MENU"] = "MENU";
    State_mode["RANDOMIZE"] = "RANDOMIZE";
})(State_mode || (exports.State_mode = State_mode = {}));
var Status_mode;
(function (Status_mode) {
    Status_mode["FELT"] = "FELT";
    Status_mode["PREDICTED"] = "PREDICTED";
    Status_mode["RANDOMIZED"] = "RANDOMIZED";
})(Status_mode || (exports.Status_mode = Status_mode = {}));
var Hit_policy;
(function (Hit_policy) {
    Hit_policy["ANY"] = "ANY";
    Hit_policy["COLLECT"] = "COLLECT";
    Hit_policy["FIRST"] = "FIRST";
    Hit_policy["OUTPUT_ORDER"] = "OUTPUT ORDER";
    Hit_policy["PRIORITY"] = "PRIORITY";
    Hit_policy["RULE_ORDER"] = "RULE ORDER";
    Hit_policy["UNIQUE"] = "UNIQUE";
})(Hit_policy || (exports.Hit_policy = Hit_policy = {}));
var DMiNer_error = /** @class */ (function (_super) {
    __extends(DMiNer_error, _super);
    function DMiNer_error(me) {
        var messages = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            messages[_i - 1] = arguments[_i];
        }
        var _this = _super.call(this, Name_of_ModdleElement(me) + DMiNer_error.Separator + messages.join(DMiNer_error.Separator)) || this;
        _this.me = me;
        return _this;
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
    return DMiNer_error;
}(Error));
exports.DMiNer_error = DMiNer_error;
function Name_of_ModdleElement(me) {
    return 'name' in me ? me.name : (me.$type + me.id);
}
// https://docs.camunda.org/manual/7.18/user-guide/dmn-engine/data-types/#supported-data-types
var DMN_type_reference_;
(function (DMN_type_reference_) {
    DMN_type_reference_["BOOLEAN"] = "boolean";
    DMN_type_reference_["DATE"] = "date";
    DMN_type_reference_["DOUBLE"] = "double";
    DMN_type_reference_["ENUMERATION"] = "enum";
    DMN_type_reference_["INTEGER"] = "integer";
    DMN_type_reference_["LONG"] = "long";
    DMN_type_reference_["NUMBER"] = "number";
    DMN_type_reference_["STRING"] = "string";
})(DMN_type_reference_ || (exports.DMN_type_reference_ = DMN_type_reference_ = {}));
function Is_DMN_type_reference_(type_reference) {
    if (type_reference === undefined)
        return false;
    return Object.values(DMN_type_reference_).includes(type_reference.toLowerCase());
}
function Is_Data(data) {
    return "action" in data
        && (Object.values(Drop_mode).includes(data.action.toUpperCase())
            || Object.values(Status_mode).includes(data.action.toUpperCase()))
        && "data" in data && Array.isArray(data.data);
}
var _DMN_AuthorityRequirement = 'dmn:AuthorityRequirement';
var _DMN_BusinessKnowledgeModel = 'dmn:BusinessKnowledgeModel';
var _DMN_Context = 'dmn:Context';
var _DMN_ContextEntry = 'dmn:ContextEntry';
var _DMN_Decision = 'dmn:Decision';
var _DMN_DecisionRule = 'dmn:DecisionRule';
/**
 * A decision service exposes one or more
 * decisions from a decision model as a reusable element, a service, which might be consumed (for example) internally by
 * another decision in the decision model, or externally by a task in a BPMN process model.
 */
var _DMN_DecisionService = 'dmn:DecisionService';
var _DMN_DecisionTable = 'dmn:DecisionTable';
var _DMN_Definitions = 'dmn:Definitions';
var _DMN_DMNElementReference = 'dmn:DMNElementReference';
var _DMN_InformationItem = 'dmn:InformationItem';
var _DMN_InformationRequirement = 'dmn:InformationRequirement';
var _DMN_InputClause = 'dmn:InputClause';
var _DMN_InputData = 'dmn:InputData';
var _DMN_ItemDefinition = 'dmn:ItemDefinition';
var _DMN_Invocation = 'dmn:Invocation'; // Alternative to decision table and literal expression
var _DMN_KnowledgeRequirement = 'dmn:KnowledgeRequirement';
var _DMN_KnowledgeSource = 'dmn:KnowledgeSource';
var _DMN_LiteralExpression = 'dmn:LiteralExpression';
var _DMN_OutputClause = 'dmn:OutputClause';
var _DMN_RuleAnnotationClause = 'dmn:RuleAnnotationClause';
var _DMN_UnaryTests = 'dmn:UnaryTests';
function Is_DMN_Context(me) {
    return '$type' in me && me.$type === _DMN_Context && 'contextEntry' in me && 'typeRef' in me;
}
function Is_DMN_Decision(me) {
    return '$type' in me && me.$type === _DMN_Decision && 'decisionLogic' in me;
}
function Name_of_DMN_Decision(decision) {
    return 'name' in decision ? decision.name : decision.id;
}
function Is_DMN_DecisionTable(me) {
    return '$type' in me && me.$type === _DMN_DecisionTable && 'input' in me && 'output' in me && 'rule' in me;
}
function _Get_type_reference_from_DMN_Definitions(me, type_name) {
    if (exports.Trace)
        console.assert(Is_DMN_Definitions(me), "'_Get_type_reference_from_DMN_Definitions' >> 'Is_DMN_Definitions(me)', untrue");
    if (type_name === undefined)
        return undefined;
    var index = me.itemDefinition.findIndex(function (item) { return item.name === type_name; });
    return index !== -1 ? me.itemDefinition[index].typeRef : undefined;
}
function Is_DMN_Definitions(me) {
    return '$type' in me && me.$type === _DMN_Definitions && 'drgElement' in me;
}
function Is_DMN_InformationRequirement(me) {
    return '$type' in me && me.$type === _DMN_InformationRequirement && 'requiredInput' in me;
}
function Get_enumeration_from_DMN_InputClause(me) {
    // if (Trace)
    //     console.assert(_Is_DMN_InputClause_enumeration_(me), "Get_enumeration_from_DMN_InputClause >> '_Is_DMN_InputClause_enumeration_(me)', untrue");
    var type_reference = 'inputExpression' in me ? me.inputExpression.typeRef : undefined;
    if (Is_DMN_type_reference_(type_reference) === false) {
        type_reference = _Get_type_reference_from_DMN_Definitions(me.$parent.$parent.$parent, type_reference);
        if (type_reference === undefined)
            throw new DMiNer_error(me, DMiNer_error.Undefined_DMN_type, Name_of_DMN_InputClause(me));
    }
    if (type_reference === DMN_type_reference_.BOOLEAN)
        return new Array(false, true);
    else if (type_reference === DMN_type_reference_.STRING) {
        var extraction = _Extract_enumeration_values(me.inputValues.text);
        if (extraction === null)
            throw new DMiNer_error(me, DMiNer_error.Undefined_DMN_type, Name_of_DMN_InputClause(me));
        return extraction;
    }
    else {
        var extraction = _Extract_enumeration_values(me.inputValues.text, type_reference);
        if (extraction === null)
            throw new DMiNer_error(me, DMiNer_error.Undefined_DMN_type, Name_of_DMN_InputClause(me));
        return extraction;
    }
}
function _Is_DMN_InputClause_enumeration_(me) {
    return 'inputExpression' in me && 'typeRef' in me.inputExpression && ('inputValues' in me || me.inputExpression.typeRef === DMN_type_reference_.BOOLEAN);
}
function Name_of_DMN_InputClause(me) {
    return 'label' in me ? me.label : 'name' in me ? me.name : 'inputExpression' in me && 'name' in me.inputExpression ? me.inputExpression.name : me.id;
}
function Type_of_DMN_InputClause(me, decision) {
    if (_Is_DMN_InputClause_enumeration_(me))
        return DMN_type_reference_.ENUMERATION;
    else if ('typeRef' in me) {
        if (Is_DMN_type_reference_(me.typeRef))
            return me.typeRef;
        else {
            var base_type = _Get_type_reference_from_DMN_Definitions(decision.$parent, me.typeRef);
            return base_type && Is_DMN_type_reference_(base_type) ? base_type : DMN_type_reference_.STRING;
        }
    }
    else {
        if ('inputExpression' in me && 'typeRef' in me.inputExpression) {
            if (Is_DMN_type_reference_(me.inputExpression.typeRef))
                return me.inputExpression.typeRef;
            else {
                var base_type = _Get_type_reference_from_DMN_Definitions(decision.$parent, me.inputExpression.typeRef);
                return base_type && Is_DMN_type_reference_(base_type) ? base_type : DMN_type_reference_.STRING;
            }
        }
    }
    throw new DMiNer_error(me, DMiNer_error.Undefined_DMN_type, Name_of_DMN_InputClause(me));
}
function Is_DMN_InputData(me) {
    return '$type' in me && me.$type === _DMN_InputData;
}
function Is_DMN_LiteralExpression(me) {
    return '$type' in me && me.$type === _DMN_LiteralExpression && 'text' in me && 'typeRef' in me;
}
function _Extract_enumeration_values(enumeration, type_reference) {
    if (type_reference) {
        if (exports.FEEL_range.test(enumeration)) {
            var values_1 = enumeration.match(/\d+/g).map(function (value) { return parseInt(value); });
            var start = /^[\(\]]/.test(enumeration) ? Math.min.apply(Math, values_1) + 1 : Math.min.apply(Math, values_1);
            var end = /[\)\[]$/.test(enumeration) ? Math.max.apply(Math, values_1) - 1 : Math.max.apply(Math, values_1);
            values_1.length = 0;
            for (var i = start; i <= end; i++)
                values_1.push(i);
            return values_1;
        }
        else if (type_reference === DMN_type_reference_.INTEGER || type_reference === DMN_type_reference_.LONG)
            return enumeration.split(',').map(function (value) { return parseInt(value); });
        else if (type_reference === DMN_type_reference_.DOUBLE || type_reference === DMN_type_reference_.NUMBER)
            return enumeration.split(',').map(function (value) { return parseFloat(value); });
        return null;
    }
    var values = enumeration.match(/"\w+( \w+)*"/g);
    return values === null ? values : values.map(function (value) { return value.replace(/^"/g, '').replace(/"$/g, ''); });
}
function Get_enumeration_from_DMN_OutputClause(me) {
    // if (Trace)
    //     console.assert(_Is_DMN_OutputClause_enumeration_(me), "Get_enumeration_from_DMN_OutputClause >> '_Is_DMN_OutputClause_enumeration_(me)', untrue");
    var type_reference = me.typeRef;
    if (Is_DMN_type_reference_(type_reference) === false) {
        type_reference = _Get_type_reference_from_DMN_Definitions(me.$parent.$parent.$parent, type_reference);
        if (type_reference === undefined)
            throw new DMiNer_error(me, DMiNer_error.Undefined_DMN_type, Name_of_DMN_OutputClause(me));
    }
    if (type_reference === DMN_type_reference_.BOOLEAN)
        return new Array(false, true);
    else if (type_reference === DMN_type_reference_.STRING) {
        var extraction = _Extract_enumeration_values(me.outputValues.text);
        if (extraction === null)
            throw new DMiNer_error(me, DMiNer_error.Undefined_DMN_type, Name_of_DMN_OutputClause(me));
        return extraction;
    }
    else {
        var extraction = _Extract_enumeration_values(me.outputValues.text, type_reference);
        if (extraction === null)
            throw new DMiNer_error(me, DMiNer_error.Undefined_DMN_type, Name_of_DMN_OutputClause(me));
        return extraction;
    }
}
function _Is_DMN_OutputClause_enumeration_(me) {
    // 'typeRef' may be missing even though 'outputValues' is present -> "enumeration" anyway...
    return /*'typeRef' in me &&*/ 'outputValues' in me;
}
function Name_of_DMN_OutputClause(me) {
    return 'label' in me ? me.label : 'name' in me ? me.name : 'outputLabel' in me.$parent ? me.$parent.outputLabel : 'name' in me.$parent.$parent ? me.$parent.$parent.name : me.id;
}
function Type_of_DMN_OutputClause(me, decision, primitive_type) {
    if (primitive_type === void 0) { primitive_type = false; }
    if (primitive_type === false && _Is_DMN_OutputClause_enumeration_(me))
        return DMN_type_reference_.ENUMERATION;
    else if ('typeRef' in me)
        if (Is_DMN_type_reference_(me.typeRef))
            return me.typeRef;
        else {
            var base_type = _Get_type_reference_from_DMN_Definitions(decision.$parent, me.typeRef);
            return base_type && Is_DMN_type_reference_(base_type) ? base_type : DMN_type_reference_.STRING;
        }
    throw new DMiNer_error(me, DMiNer_error.Undefined_DMN_type, Name_of_DMN_OutputClause(me));
}
function Is_DMN_UnaryTests(me) {
    return '$type' in me && me.$type === _DMN_UnaryTests && 'text' in me;
}
