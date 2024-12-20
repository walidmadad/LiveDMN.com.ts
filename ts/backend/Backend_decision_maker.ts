import tf from '@tensorflow/tfjs-node';

import {
    DMN_type_reference,
    DMN_Decision,
    Name_of_DMN_Decision,
    TensorFlow_data,
    TensorFlow_datum,
    Trace
} from "../common/Settings";

// https://codelabs.developers.google.com/codelabs/tensorflowjs-audio-codelab#0

export default class Backend_decision_maker  {

    constructor(private readonly _decision: DMN_Decision, private readonly _enumerations: Map<string, Array<string> | null>, private readonly _features: Array<string>, private readonly _types: Array<string>, private readonly _units = 1) {
        //super();


    }
}
