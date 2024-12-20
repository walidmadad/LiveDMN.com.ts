import {DMiNer} from "./DMiNer";
import {version} from "@tensorflow/tfjs-node";
import OpenSLR_org_88 from "./OpenSLR_org_88/OpenSLR_org_88";
import path from "node:path";

(function Main() {
    console.clear();
    console.info("Working directory: " + __dirname + "\n");
    console.info("Executable file: " + __filename + "\n");
    console.info("Version of TensorFlow.js (C++ native Node.js): " + version["tfjs-core"] + "\n");

    /** CSV */
    // DMiNer.Test_CSV();
    // DMiNer.Papa_parse();
    /** End of CSV */

    DMiNer.Get_DMN().then(() => {
        // DMiNer.Test_TensorFlow_js_API();
    }); // Default example...

    // OpenSLR_org_88.Data().then(_ => console.info("'Data' done..."));

    OpenSLR_org_88.Test();
})();



