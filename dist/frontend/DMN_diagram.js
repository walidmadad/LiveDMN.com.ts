/** webpack */
// import DmnModdle from "dmn-moddle";
// import tippy from 'tippy.js';
// require('tippy.js/dist/tippy.css');
// import {
//     DMN_BusinessKnowledgeModel,
//     is_DMN_Decision,
//     DMN_Definitions,
//     DMN_InputData,
//     DMN_KnowledgeSource,
//     ModdleElement,
// } from "./DMN-JS";
// import Decision_maker from "Decision_maker";
/** End of webpack */
var _a;
import { _DMiNer_, DMiNer_error, DMN_type_reference_, Drop_mode, Get_enumeration_from_DMN_InputClause, Get_enumeration_from_DMN_OutputClause, Is_Data, Is_DMN_Context, Is_DMN_Decision, Is_DMN_DecisionTable, Is_DMN_Definitions, Is_DMN_InputData, Is_DMN_LiteralExpression, Name_of_DMN_Decision, Name_of_DMN_InputClause, Name_of_DMN_OutputClause, State_mode, Status_mode, Trace, Type_of_DMN_InputClause, Type_of_DMN_OutputClause } from "../common/Settings.js";
import Dataviz from "./Dataviz.js";
import Decision_maker from "./Decision_maker.js";
import FEEL from "./FEEL.js";
import IMICROS_FEEL_interpreter from "./IMICROS_FEEL_interpreter.js";
class DMN_diagram {
    static _Clear_listeners(decision_name) {
        if (decision_name) {
            _a._Listeners.forEach((listeners, type) => {
                if (type.endsWith(decision_name)) {
                    listeners.forEach(listener => window.removeEventListener(type, listener));
                    listeners.splice(0, listeners.length); // Empty it...
                }
            });
        }
        else {
            _a._Listeners.forEach((listeners, type) => listeners.forEach(listener => window.removeEventListener(type, listener)));
            _a._Listeners.clear();
        }
    }
    static _Record_listener(type, listener, options) {
        window.addEventListener(type, listener, options);
        if (_a._Listeners.get(type) === undefined)
            _a._Listeners.set(type, new Array);
        _a._Listeners.get(type).push(listener);
    }
    static _Display(message, duration = 5000) {
        const dialog = window.document.getElementById("Dialog");
        dialog.querySelector('p').innerHTML = message;
        dialog.showModal();
        setTimeout(() => dialog.close(), duration);
    }
    static _Display_error(error, duration = 2500) {
        const dialog = window.document.getElementById("Dialog");
        dialog.querySelector('p').innerHTML = error.message;
        dialog.showModal();
        setTimeout(() => dialog.close(), duration);
    }
    static _Get_SVGGElement(id) {
        if (!id) {
            if (Trace)
                console.warn("'Get_SVGGElement': " + id);
            throw new Error("'Get_SVGGElement': " + id);
        }
        /* https://developer.mozilla.org/en-US/docs/Web/API/SVGGElement */
        return window.document.querySelector('#LiveDMN [data-element-id=' + id + ']'); // See "LiveDMN" as id. in 'LiveDMN.com.html'...
    }
    static _Is_idle_(decision) {
        const sVG_element = _a._Get_SVGGElement(decision.id);
        // if (Trace)
        //     console.info("'DMN_diagram._Is_idle_' " + sVG_element.classList.value);
        return Object.values(Drop_mode).concat(Object.values(State_mode))
            .reduce((idle, value) => idle && !sVG_element.classList.contains(value), true);
    }
    static _Set_CSS_class(decision, mode) {
        const sVG_element = _a._Get_SVGGElement(decision.id);
        Object.values(Drop_mode).concat(Object.values(State_mode))
            .forEach(mode => sVG_element.classList.remove(mode));
        if (mode)
            sVG_element.classList.add(mode);
    }
    static _Set_tippy_object(decision, mode) {
        // @ts-ignore
        _a._Get_SVGGElement(decision.id)._tippy.setProps({
            content: mode === undefined ? _a._Decision_formats.get(decision) : mode === State_mode.MENU ? _a._Menu : mode,
            interactive: mode === State_mode.MENU ? true : false,
            placement: mode === undefined ? 'right' : 'left'
        });
    }
    /* If 'random_size' is "small", e.g., less than 10, then deep learning will lead to a "weird" result... */
    static _Randomize_data(decision, random_size = _a.RandomSize) {
        if (!Is_DMN_DecisionTable(decision.decisionLogic))
            return Promise.reject(new DMiNer_error(decision, DMiNer_error.No_business_logic));
        let data = new Array();
        const decision_table = decision.decisionLogic;
        const randomizers = new Array();
        const randomization_setup = decision_table.input.every((input_clause, input_clause_index) => {
            const type_reference = Type_of_DMN_InputClause(input_clause, decision);
            if (type_reference === DMN_type_reference_.BOOLEAN)
                randomizers.push([Name_of_DMN_InputClause(input_clause), () => Math.random() < 0.5]);
            else if (type_reference === DMN_type_reference_.DATE) {
                // TO DO...
            }
            else if (type_reference === DMN_type_reference_.INTEGER || type_reference === DMN_type_reference_.LONG) {
                const values = new Set;
                if ('inputValues' in input_clause) {
                    const matches = input_clause.inputValues.text.match(/\d+/g);
                    if (matches !== null)
                        matches.map(match => Number.parseInt(match)).forEach(values.add, values);
                    randomizers.push([Name_of_DMN_InputClause(input_clause), () => Math.floor(Math.random() * ((Math.max(...values) + _a._Random_spectrum) - Math.min(...values)) + Math.min(...values))]);
                }
                else {
                    decision_table.rule.forEach(rule => {
                        const matches = rule.inputEntry[input_clause_index].text.match(/\d+/g);
                        if (matches !== null)
                            matches.map(match => Number.parseInt(match)).forEach(values.add, values);
                    });
                    // Incomplete, negative integers out:
                    randomizers.push([Name_of_DMN_InputClause(input_clause), () => Math.floor(Math.random() * (Math.max(...values) + _a._Random_spectrum))]);
                }
            }
            else if (type_reference === DMN_type_reference_.DOUBLE || type_reference === DMN_type_reference_.NUMBER) {
                const values = new Set;
                if ('inputValues' in input_clause) {
                    const matches = input_clause.inputValues.text.replace(/\.\./g, '@').match(/[-+]?[0-9]*\.?[0-9]+/g);
                    if (matches !== null)
                        matches.map(match => Number.parseFloat(match)).forEach(values.add, values);
                }
                decision_table.rule.forEach(rule => {
                    const matches = rule.inputEntry[input_clause_index].text.replace(/\.\./g, '@').match(/[-+]?[0-9]*\.?[0-9]+/g);
                    if (matches !== null)
                        matches.map(match => Number.parseFloat(match)).forEach(values.add, values);
                });
                const min = values.size === 1 ? 0 : Math.min(...values);
                // Try to distinguish between integers and floating points:
                if ([...values].filter(value => Number.isInteger(value)).length === values.size)
                    randomizers.push([Name_of_DMN_InputClause(input_clause), () => Math.floor(Math.random() * ((Math.max(...values) + _a._Random_spectrum) - min) + min)]);
                else
                    randomizers.push([Name_of_DMN_InputClause(input_clause), () => Math.random() * ((Math.max(...values) + _a._Random_spectrum / 10) - min) + min]);
            }
            else if (type_reference === DMN_type_reference_.STRING) {
                // Problem: see 'Get_barcode_country.dmn'
                // => 'not("UNKNOWN")' in 'Instrument Rating Category.dmn'
                decision_table.rule.forEach(rule => {
                    const ast = IMICROS_FEEL_interpreter.Parse(rule.inputEntry[input_clause_index]);
                });
                return true; // 'every'
            }
            else {
                // if (Trace)
                //     console.assert(type_reference === DMN_type_reference_.ENUMERATION, "DMN_diagram._Randomize_data >> 'type_reference === DMN_type_reference_.ENUMERATION', untrue");
                const values = _a.Decisions.get(decision).enumerations.get(Name_of_DMN_InputClause(input_clause));
                randomizers.push([Name_of_DMN_InputClause(input_clause), () => values[Math.floor(Math.random() * values.length)]]);
            }
            return true; // 'every'
        });
        if (!randomization_setup)
            return Promise.reject(new DMiNer_error(decision, DMiNer_error.No_possible_randomization));
        for (let i = 0; i < random_size; i++) {
            data.push(new Object);
            for (const randomizer of randomizers)
                Object.defineProperty(data[i], randomizer[0], {
                    value: randomizer[1](),
                    enumerable: true,
                    configurable: false,
                    writable: true
                });
        }
        return new Promise(async (send) => {
            await FEEL.Evaluate(decision, data); // 'data' is altered...
            const features = _a.Decisions.get(decision).features;
            data = data.filter(datum => {
                const keys = Object.keys(datum);
                if (features.length !== keys.length - 1)
                    return false;
                return Object.keys(datum).every(key => key.includes(_DMiNer_) || features.includes(key));
            });
            send(data);
        });
    }
    static _Decision_data_format(decision) {
        if (Is_DMN_DecisionTable(decision.decisionLogic)) {
            let inserter = "";
            decision.decisionLogic.input.forEach(input_clause => {
                const type_reference = 'inputValues' in input_clause
                    ? input_clause.inputValues.text.split(',').join(' | ')
                    : input_clause.inputExpression.typeRef;
                inserter += '<code>"' + Name_of_DMN_InputClause(input_clause) + '"</code>: ' + type_reference + ",";
            });
            return '{<code>"action"</code>: "' + Object.values(Drop_mode).join('" | "') + '", <code>"data"</code>: [ {@}, ... ] }'.replace('@', inserter.substring(0, inserter.length - 1));
        }
        else if (Is_DMN_LiteralExpression(decision.decisionLogic)) {
            return decision.decisionLogic.text;
        }
        else if (Is_DMN_Context(decision.decisionLogic)) {
            return "DMN_Context";
        }
        return DMiNer_error.No_business_logic;
    }
    static _From_TensorFlow_data(decision, data) {
        const decision_maker = _a.Decisions.get(decision);
        // if (Trace) {
        //     console.assert(decision_maker !== undefined, "DMN_diagram._From_TensorFlow_data >> 'decision_maker !== undefined', untrue");
        //     console.assert(Is_DMN_DecisionTable(decision.decisionLogic), "DMN_diagram._From_TensorFlow_data >> 'Is_DMN_DecisionTable(decision.decisionLogic)', untrue");
        // }
        const data_ = new Array;
        const features = decision_maker.features;
        const types = decision_maker.types;
        const units = decision_maker.units;
        data.forEach((datum, datum_index) => {
            data_.push(new Object);
            features.forEach((feature, feature_index) => {
                if (types[feature_index] === DMN_type_reference_.ENUMERATION) {
                    if (Trace)
                        console.assert(Array.isArray(datum[feature_index]), "DMN_diagram._From_TensorFlow_data >> 'Array.isArray(datum[feature_index])', untrue");
                    let value;
                    if (feature_index < features.length - units) // Input...
                        value = decision_maker.enumerations.get(feature)[datum[feature_index].indexOf(1)];
                    else { // Output...
                        const probability = Math.max(...datum[feature_index]);
                        const index = datum[feature_index].indexOf(probability);
                        value = decision_maker.enumerations.get(feature)[index];
                    }
                    Object.defineProperty(data_[datum_index], feature, {
                        value: value,
                        enumerable: true,
                        configurable: false,
                        writable: true
                    });
                }
                else
                    Object.defineProperty(data_[datum_index], feature, {
                        value: types[feature_index] === DMN_type_reference_.INTEGER
                            || types[feature_index] === DMN_type_reference_.LONG ? Math.round(datum[feature_index]) : datum[feature_index],
                        enumerable: true,
                        configurable: false,
                        writable: true
                    });
            });
        });
        return data_;
    }
    static _To_TensorFlow_data(mode, decision, data) {
        const decision_maker = _a.Decisions.get(decision);
        // if (Trace) {
        //     console.assert(mode === Drop_mode.PREDICT || mode === Drop_mode.TRAIN, "DMN_diagram._To_TensorFlow_data >> 'mode === Drop_mode.PREDICT || mode === Drop_mode.TRAIN', untrue");
        //     console.assert(decision_maker !== undefined, "DMN_diagram._To_TensorFlow_data >> 'decision_maker !== undefined', untrue");
        //     console.assert(Is_DMN_DecisionTable(decision.decisionLogic), "DMN_diagram._To_TensorFlow_data >> 'Is_DMN_DecisionTable(decision.decisionLogic)', untrue");
        // }
        /**
         * Dropped or randomized data must match features of DMN decision table (possible use of 'Fuse' so that keys are almost equal?)
         */
        const features = decision_maker.features;
        const units = decision_maker.units;
        // Data coming from FEEL inference (option) have to be cleaned up:
        data.forEach(datum => Object.keys(datum).forEach(key => {
            if (key.includes(_DMiNer_))
                delete datum[key];
        }));
        let data_ = data.filter(datum => {
            const keys = Object.keys(datum);
            if (mode === Drop_mode.PREDICT && features.length - units !== keys.length)
                return false;
            if (mode === Drop_mode.TRAIN && features.length !== keys.length)
                return false;
            return Object.keys(datum).every(key => features.includes(key));
        });
        data_ = data_.filter(datum => Object.values(datum).every((value, value_index) => {
            const feature_index = features.indexOf(Object.keys(datum)[value_index]);
            let type_reference = decision_maker.types[feature_index];
            type_reference = type_reference === DMN_type_reference_.DOUBLE
                || type_reference === DMN_type_reference_.INTEGER
                || type_reference === DMN_type_reference_.LONG ? DMN_type_reference_.NUMBER : type_reference;
            return type_reference === DMN_type_reference_.ENUMERATION
                ? typeof value === DMN_type_reference_.BOOLEAN || typeof value === DMN_type_reference_.STRING || (typeof value === DMN_type_reference_.NUMBER && Number.isInteger(value))
                : typeof value === type_reference;
        }));
        data_.forEach((datum, datum_index) => {
            const keys = Object.keys(datum);
            const values = Object.values(datum);
            data_[datum_index] = new Array; // Move to TensorFlow format...
            keys.forEach((key, key_index) => {
                if (mode !== Drop_mode.PREDICT || key_index < features.length - units) {
                    const feature_index = features.indexOf(key);
                    if (decision_maker.types[feature_index] === DMN_type_reference_.ENUMERATION) {
                        // One-hot encoding (https://www.actuia.com/contribution/thibault-neveu/formation-a-tensorflow-2-0-quest-ce-que-le-one-hot-encoding):
                        const one_hot_encoding = decision_maker.enumerations.get(key).map(value => value === values[key_index] ? 1 : 0);
                        data_[datum_index][feature_index] = one_hot_encoding;
                    }
                    else
                        data_[datum_index][feature_index] = values[keys.indexOf(key)];
                }
            });
        });
        return data_;
    }
    static _Download(status, data, decision) {
        if (!_a.Download)
            return; // Please check "Download" within GUI to actually get JSON file...
        const content = JSON.stringify({
            status: status,
            data: data
        });
        const download = window.document.getElementById("Download");
        download.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
        download.setAttribute('download', (decision.name ? decision.name : _a._File_name) + "_" + status + ".json");
        download.click();
    }
    get name() {
        return new Promise(async (get) => {
            const diagram = await this._diagram;
            const name = diagram === undefined ? typeof undefined : diagram.name;
            get(name === undefined ? typeof undefined : name);
        });
    }
    get XML() {
        return this._XML;
    }
    async _load_XML(XML) {
        const response = await window.fetch(XML);
        return response.text();
    }
    constructor(file_name, _viewer, _dataviz) {
        this.file_name = file_name;
        this._viewer = _viewer;
        this._dataviz = _dataviz;
        /** Helper */
        // const properties = [];
        // for (const p in this._viewer)
        //     properties.push(p);
        // window.alert("DmnJS API: " + properties.join(" - ")); // open - importXML - saveXML
        /** End of helper */
        this._XML = this._load_XML(file_name);
        this._diagram = this._get();
        this.view();
    }
    async _get() {
        /** Helper */
        // const moddle = new DmnModdle();
        // const properties = [];
        // for (const p in moddle)
        //     properties.push(p);
        // // factory - registry - typeCache - fromXML - toXML - create - getType - createAny - getPackage - getPackages - getElementDescriptor - hasType - getPropertyDescriptor - getTypeDescriptor
        // window.alert("DmnModdle API: " + properties.join(" - "));
        /** End of helper */
        try {
            const { rootElement: diagram, warnings: warnings // Array...
             } = await new DmnModdle().fromXML(await this.XML); // It returns an object with field 'rootElement'...
            if (Trace)
                console.assert(Is_DMN_Definitions(diagram), "'DMN_diagram._get_diagram' >> 'Is_DMN_Definitions(diagram)', untrue.");
            if (Trace && warnings.length !== 0)
                console.warn(_DMiNer_ + warnings.map((warning) => warning.message).join(" * "));
            return Promise.resolve(diagram);
        }
        catch (error) {
            _a._Display("'DMN_diagram._get_diagram' >> XML in DMN file cannot be processed.");
            return Promise.resolve(undefined);
        }
    }
    async view() {
        const diagram = await this._diagram;
        if (!diagram)
            return Promise.resolve(undefined); // Content is not DMN...
        _a._Decision_formats.clear();
        _a._Clear_listeners(); // 'window.addEventListener' actions from prior DMN test case must be discarded...
        // DMN_diagram._Clear_menu_listeners();
        // Visualization of DMN diagram:
        const { warnings } = await this._viewer.importXML(await this.XML);
        if (Trace && warnings.length !== 0)
            console.warn("DMiner: " + warnings.map((warning) => warning.message).join(" * "));
        // try {
        //     const {warnings} = await this._viewer.importXML(XML); // Visualization...
        //     const active_view = this._viewer.getActiveView();
        //     // window.alert(active_view.type + " " + active_view.name);
        //     // window.alert(active_view.element.$type);
        //     const m = active_view.element;
        //     // "Decision Requirement Diagrams" or DRDs
        //     // apply initial logic in DRD view
        //     if (active_view.type === 'drd') {
        //         const activeEditor = this._viewer.getActiveViewer();
        //
        //         // access active editor components
        //         const canvas = activeEditor.get('canvas');
        //
        //         // zoom to fit full viewport
        //         canvas.zoom('fit-viewport');
        //     }
        // } catch (err) {
        //     window.alert('error: ' + err);
        // }
        /* A étendre pour les expressions littérales : */
        if (diagram.drgElement.filter(me => Is_DMN_Decision(me) && Is_DMN_DecisionTable(me.decisionLogic))
            .every(decision => {
            try {
                _a._Setup_decision_maker(diagram, decision);
                return true; // Because of 'every'...
            }
            catch (error) {
                _a._Display_error(error instanceof DMiNer_error ? error : new DMiNer_error(_a._Decision, DMiNer_error.Invalid_JSON), 5000);
                return false; // Because of 'every'... <=> 'break
            }
        }) === false)
            return Promise.resolve(undefined); // DMN processing causes trouble(s)...
        const dataviz = this._dataviz;
        diagram.drgElement.filter(Is_DMN_Decision).forEach((decision) => {
            const sVG_element = _a._Get_SVGGElement(decision.id);
            tippy(sVG_element, {
                allowHTML: true,
                appendTo: () => {
                    return window.document.body;
                },
                content: Name_of_DMN_Decision(decision),
                hideOnClick: 'toggle',
                placement: 'right',
                theme: "DMiNer",
                trigger: 'click mouseenter',
                onHidden(tippy_object) {
                    _a._Set_tippy_object(decision);
                },
                onTrigger(tippy_object, event) {
                    if (event.type === 'click' && _a._Is_idle_(decision)) {
                        _a._Set_CSS_class(decision, State_mode.MENU);
                        _a._Set_tippy_object(decision, State_mode.MENU);
                        setTimeout(() => {
                            const randomize_button = window.document.getElementById("RANDOMIZE_BUTTON");
                            // if (Trace)
                            //     console.assert(randomize_button !== null, "'randomize_button !== null', untrue");
                            randomize_button.onclick = () => {
                                // https://medium.com/@saeid/running-complex-long-running-tasks-in-the-browser-using-javascript-40aa364f1991
                                _a._Set_CSS_class(decision, State_mode.RANDOMIZE);
                                _a._Set_tippy_object(decision, State_mode.RANDOMIZE);
                                setTimeout(() => {
                                    _a._Randomize_data(decision)
                                        .then(data => _a._Download(Status_mode.RANDOMIZED, data, decision))
                                        .catch(error => _a._Display_error(error))
                                        .finally(() => sVG_element.dispatchEvent(new Event('click')));
                                });
                            };
                            const train_button = window.document.getElementById("TRAIN_BUTTON");
                            // if (Trace)
                            //     console.assert(train_button !== null, "'train_button !== null', untrue");
                            train_button.onclick = () => {
                                _a._Set_CSS_class(decision, State_mode.RANDOMIZE);
                                _a._Set_tippy_object(decision, State_mode.RANDOMIZE);
                                setTimeout(() => {
                                    _a._Randomize_data(decision)
                                        .then(data => {
                                        _a._Set_CSS_class(decision, Drop_mode.TRAIN);
                                        _a._Set_tippy_object(decision, Drop_mode.TRAIN);
                                        setTimeout(() => {
                                            _a.Decisions.get(decision).train(_a._To_TensorFlow_data(Drop_mode.TRAIN, decision, data))
                                                .then((message) => {
                                                //  DMN_diagram._Display(DMiNer_error.TensorFlow_js + DMiNer_error.Separator + message);
                                            })
                                                .finally(() => sVG_element.dispatchEvent(new Event('click')));
                                        });
                                    })
                                        .catch(error => {
                                        _a._Display_error(error);
                                        sVG_element.dispatchEvent(new Event('click'));
                                    });
                                });
                            };
                            const dataviz_button = window.document.getElementById("DATAVIZ_BUTTON");
                            // if (Trace)
                            //     console.assert(dataviz_button !== null, "'dataviz_button !== null', untrue");
                            dataviz_button.onclick = () => {
                                _a._Randomize_data(decision)
                                    .then(data => {
                                    decision;
                                    Dataviz.Setup(dataviz, data, _a.Decisions.get(decision).name, _a.Decisions.get(decision).features, _a.Decisions.get(decision).types, _a.Decisions.get(decision).enumerations);
                                })
                                    .catch(error => _a._Display_error(error))
                                    .finally(() => sVG_element.dispatchEvent(new Event('click')));
                            };
                            const spade = window.document.getElementById("spade");
                            // if (Trace)
                            //     console.assert(spade !== null, "'spade !== null', untrue");
                            spade.onclick = () => {
                                console.warn('SPADE not yet implemented');
                            };
                        });
                    }
                },
                onUntrigger(tippy_object, event) {
                    // 'mouseleave' OR from 'dispatchEvent' OR from GUI
                    if (event.type !== 'click' || (event.type === 'click' && !event.isTrusted) ||
                        (event.type === 'click' && event.isTrusted && _a._Is_idle_(decision)))
                        _a._Set_CSS_class(decision);
                }
            });
            sVG_element.addEventListener('dragleave', (event) => {
                event.preventDefault();
                event.stopImmediatePropagation();
                sVG_element.classList.remove("DROP");
            }, false);
            // 'preventDefault' in 'dragover' is MANDATORY to later allow 'drop':
            sVG_element.addEventListener('dragover', (event) => {
                event.preventDefault();
                event.stopImmediatePropagation();
                sVG_element.classList.add("DROP");
            }, false);
            sVG_element.addEventListener('drop', (event) => {
                event.preventDefault();
                event.stopImmediatePropagation();
                sVG_element.classList.remove("DROP");
                // Caution: 'event.dataTransfer.types.length === 2' with Firefox while 'event.dataTransfer.types.length === 1' with Chrome & Safari!
                if ('dataTransfer' in event) {
                    let i = 0;
                    while (event.dataTransfer.items[i].kind !== 'file')
                        i++;
                    // window.alert(event.dataTransfer!.items[i].getAsFile()!.name);
                    // Load data:
                    _a.File_reader.readAsText(event.dataTransfer.items[i].getAsFile()); // UTF-8
                    /**
                     * 'drop' upon decision... One has to record it:
                     */
                    _a._Decision = decision;
                    _a._File_name = event.dataTransfer.items[i].getAsFile().name;
                }
                else
                    throw new Error("'sVG_element.addEventListener('drop', ...' >> ''dataTransfer' in event', untrue.");
            }, false);
            _a._Decision_formats.set(decision, _a._Decision_data_format(decision));
        });
        /**
         * We cannot determine from a DMN_InputData object, the decision(s) for which it acts as input data...
         */
        // diagram.drgElement.filter(is_DMN_InputData).forEach(input_data => {
        //         const sVG_element = DMN_diagram._Get_SVGGElement(input_data.id);
        //     });
    }
    static _Setup_decision_maker(diagram, decision) {
        _a._Clear_listeners(Name_of_DMN_Decision(decision));
        _a._Record_listener(Decision_maker.onTrainBegin + Name_of_DMN_Decision(decision), (event) => {
            console.info(Drop_mode.TRAIN + " begins... " + Name_of_DMN_Decision(decision));
        });
        _a._Record_listener(Decision_maker.onTrainEnd + Name_of_DMN_Decision(decision), (event) => {
            console.info(Drop_mode.TRAIN + " ends... " + Name_of_DMN_Decision(decision) + ", loss: " + event.detail.loss);
        });
        if (_a.Decisions.get(decision) !== undefined)
            return;
        // if (Trace)
        //     console.assert(Is_DMN_DecisionTable(decision.decisionLogic), "DMN_diagram._Setup_decision_maker >> 'Is_DMN_DecisionTable(decision.decisionLogic)', untrue")
        const decision_table = decision.decisionLogic;
        const required_decisions = new Array;
        const required_inputs = new Array;
        decision.informationRequirement?.forEach((me) => {
            if (me.requiredDecision) {
                const required_decision = diagram.drgElement.filter(Is_DMN_Decision).filter(decision_ => ('#' + decision_.id) === me.requiredDecision.href).pop();
                if (required_decision === undefined)
                    throw new DMiNer_error(me.requiredDecision, DMiNer_error.Inconsistent_DMN_diagram, "not found...");
                required_decisions.push(required_decision);
            }
            if (me.requiredInput) {
                const required_input = diagram.drgElement.filter(Is_DMN_InputData).filter(input_data => ('#' + input_data.id) === me.requiredInput.href).pop();
                if (required_input === undefined)
                    throw new DMiNer_error(me.requiredInput, DMiNer_error.Inconsistent_DMN_diagram, "not found...");
                required_inputs.push(required_input);
            }
        });
        /**
         * 'input', 'output' and 'rule' properties can be absent within 'decision_table'
         */
        const enumerations_ = new Map(decision_table.input.map(input_clause => [Name_of_DMN_InputClause(input_clause),
            Type_of_DMN_InputClause(input_clause, decision) === DMN_type_reference_.ENUMERATION
                ? Get_enumeration_from_DMN_InputClause(input_clause)
                : null]));
        let features = decision_table.input.map(input_clause => Name_of_DMN_InputClause(input_clause));
        let types = decision_table.input.map(input_clause => Type_of_DMN_InputClause(input_clause, decision));
        // Est-ce que les clauses d'entrée de la table de décision correspondent aux sorties des décisions requises ?
        // const x: Array<string> = required_decisions.map(decision_ => decision_.name).concat(required_inputs.map(input_data => input_data.name));
        // const fuse = new Fuse(features, {includeScore: true});
        // features = features.concat(x.filter(name => {
        //     const finds = fuse.search(name);
        //     return finds.length === 0 ? true : finds.filter((name_: {
        //         item: string,
        //         refIndex: number,
        //         score: number
        //     }) => name_.score >= 0.75).length > 0;
        // }));
        const enumerations = new Map([...enumerations_, ...new Map(decision_table.output.map(output_clause => [Name_of_DMN_OutputClause(output_clause),
                Type_of_DMN_OutputClause(output_clause, decision) === DMN_type_reference_.ENUMERATION
                    ? Get_enumeration_from_DMN_OutputClause(output_clause)
                    : null]))]);
        features = features.concat(decision_table.output.map(output_clause => Name_of_DMN_OutputClause(output_clause)));
        types = types.concat(decision_table.output.map(output_clause => Type_of_DMN_OutputClause(output_clause, decision)));
        _a.Decisions.set(decision, new Decision_maker(decision, enumerations, features, types, decision_table.output.length));
    }
}
_a = DMN_diagram;
DMN_diagram._Menu = "<button id='RANDOMIZE_BUTTON'>&#x0211D;</button><hr><button id='TRAIN_BUTTON'>&#x1D54B;</button><hr><button id='DATAVIZ_BUTTON'>&#x1D54D;</button><hr><button id='spade'>&spades;</button>";
// private static readonly _Menu_listeners: Map<HTMLElement, Map<string, EventListenerOrEventListenerObject>> = new Map;
// private static _Clear_menu_listeners(): void {
//     DMN_diagram._Menu_listeners.forEach((listeners, element) => {
//         listeners.forEach((listener, type) => element.removeEventListener(type, listener));
//     });
//     DMN_diagram._Menu_listeners.clear();
// }
//
// private static _Record_menu_listener(element: HTMLElement, type: string, listener: EventListenerOrEventListenerObject, options?: any): void {
//     const listeners = DMN_diagram._Menu_listeners.get(element);
//     if (listeners !== undefined) {
//         listeners.delete(type);
//         element.removeEventListener(type, listener);
//     } else {
//         DMN_diagram._Menu_listeners.set(element, new Map);
//         DMN_diagram._Menu_listeners.get(element)!.set(type, listener);
//         element.addEventListener(type, listener, options);
//     }
// }
DMN_diagram._Listeners = new Map;
DMN_diagram._Decision_formats = new Map;
DMN_diagram._Random_spectrum = 5;
DMN_diagram.Download = false;
DMN_diagram.RandomSize = 500;
DMN_diagram._Decision = null;
DMN_diagram.Decisions = new Map;
DMN_diagram._File_name = _DMiNer_;
DMN_diagram.File_reader = new FileReader();
// 'static' initialization block:
(() => {
    _a.File_reader.onerror = (error) => {
        throw new Error("Error loading data file: " + error);
    };
    _a.File_reader.onload = async (progress_event) => {
        // if (Trace)
        //     console.assert(progress_event.target === DMN_diagram.File_reader, "'DMN_diagram.File_reader.onload' >> 'progress_event.target === DMN_diagram.File_reader', untrue.");
        // if (Trace)
        //     console.assert(DMN_diagram._Decision !== null, "'DMN_diagram.File_reader.onload' >> 'DMN_diagram._Decision !== null', untrue.");
        let data = null;
        try {
            window.alert(_a.File_reader.result);
            data = JSON.parse(_a.File_reader.result);
            // if (Trace)
            //     console.assert(data !== null, "'DMN_diagram.File_reader.onload' >> 'data !== null', untrue.");
            // If no exception occurred then data is true JSON... Check format:
            if (Is_Data(data)) {
                const decision = _a._Decision;
                // if (Trace) // Decision maker:
                //     console.assert(DMN_diagram.Decisions.get(DMN_diagram._Decision!) !== undefined, "'DMN_diagram.File_reader.onload' >> 'DMN_diagram.Decisions.get(DMN_diagram._Decision!) !== undefined', untrue.");
                const decision_maker = _a.Decisions.get(decision);
                switch (data.action) {
                    case Drop_mode.FEEL:
                        if (_a._Is_idle_(decision)) {
                            _a._Set_CSS_class(decision, Drop_mode.FEEL);
                            await FEEL.Evaluate(decision, data.data);
                            _a._Download(Status_mode.FELT, data.data, decision);
                        }
                        break;
                    case Drop_mode.PREDICT:
                        if (!decision_maker.is_trained_())
                            throw new DMiNer_error(decision, DMiNer_error.Not_trained);
                        if (_a._Is_idle_(decision)) {
                            _a._Set_CSS_class(decision, Drop_mode.PREDICT);
                            const input_TensorFlow_data = _a._To_TensorFlow_data(Drop_mode.PREDICT, decision, data.data);
                            const output_TensorFlow_data = await decision_maker.predict(input_TensorFlow_data);
                            // if (Trace)
                            //     console.assert(input_TensorFlow_data.length === output_TensorFlow_data.length);
                            input_TensorFlow_data.forEach((datum, datum_index) => {
                                decision_maker.features.filter((feature, feature_index) => feature_index >= decision_maker.features.length - decision_maker.units) // Outputs...
                                    .forEach(feature => {
                                    datum.push(output_TensorFlow_data[datum_index].splice(0, decision_maker.get_enumeration_dimension(feature)));
                                });
                            });
                            _a._Download(Status_mode.PREDICTED, _a._From_TensorFlow_data(decision, input_TensorFlow_data), decision);
                        }
                        break;
                    case Drop_mode.TRAIN:
                        if (_a._Is_idle_(decision)) {
                            _a._Set_CSS_class(decision, Drop_mode.TRAIN);
                            await decision_maker.train(_a._To_TensorFlow_data(Drop_mode.TRAIN, decision, data.data));
                        }
                        break;
                    case Drop_mode.VISUALIZE:
                        window.alert("Drag & drop fichier JSON avec action 'VISUALIZE'");
                        break;
                    default:
                        throw new DMiNer_error(decision, DMiNer_error.Invalid_drop_mode, data.action);
                }
            }
            else {
                throw new DMiNer_error(_a._Decision, DMiNer_error.Invalid_data_format);
                // https://developer.chrome.com/articles/file-system-access/
                // https://developer.mozilla.org/en-US/docs/Web/API/Window/showOpenFilePicker
                // @ts-ignore
                // window.showOpenFilePicker().then((files: Array<FileSystemHandle>) => { // File or directory entry...
                //     // https://developer.mozilla.org/en-US/docs/Web/API/FileSystemHandle
                //     files.forEach(file => console.assert(file.kind === 'file' || file.kind === 'directory'));
                // }).catch((e: any) => {
                //     // 'Cancel': no chosen data:
                //     DMN_diagram._Warn(window.history.state.data.me, DMiNer_error.No_chosen_data + data);
                // });
            }
        }
        catch (error) {
            //DMN_diagram._Display_error(error instanceof DMiNer_error ? error : new DMiNer_error(DMN_diagram._Decision!, DMiNer_error.Invalid_JSON));
        }
        finally {
            _a._Set_CSS_class(_a._Decision);
            _a._Decision = null; // For next round...
        }
    };
})();
export default DMN_diagram;
//# sourceMappingURL=DMN_diagram.js.map