"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DMiNer_1 = require("./DMiNer");
const tfjs_node_1 = require("@tensorflow/tfjs-node");
const OpenSLR_org_88_1 = __importDefault(require("./OpenSLR_org_88/OpenSLR_org_88"));
(function Main() {
    console.clear();
    console.info("Working directory: " + __dirname + "\n");
    console.info("Executable file: " + __filename + "\n");
    console.info("Version of TensorFlow.js (C++ native Node.js): " + tfjs_node_1.version["tfjs-core"] + "\n");
    /** CSV */
    // DMiNer.Test_CSV();
    // DMiNer.Papa_parse();
    /** End of CSV */
    DMiNer_1.DMiNer.Get_DMN().then(() => {
        // DMiNer.Test_TensorFlow_js_API();
    }); // Default example...
    // OpenSLR_org_88.Data().then(_ => console.info("'Data' done..."));
    OpenSLR_org_88_1.default.Test();
})();
//# sourceMappingURL=Main.js.map