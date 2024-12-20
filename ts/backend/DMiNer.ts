import * as file_system from 'node:fs';
import * as https from 'node:https'; // https://nodejs.org/api/https.html
import * as path from 'node:path';

// https://www.tensorflow.org/js/tutorials/setup#nodejs_setup
import {data} from '@tensorflow/tfjs'; // JavaScript (slower)...
// La version 'tfjs-node' appelle le code C++ natif plus rapide...
// Problème config. pour 'tfjs-node' (https://stackoverflow.com/questions/57537386/cannot-import-tensorflow-tfjs-node-in-nodejs) :
/**
 > cd node_modules/@tensorflow/tfjs-node
 > npm i
 > npm audit fix --force
 > cd ../..
 */
/** Under Windows, copy/paste "node_modules\@tensorflow\tfjs-node\lib\napi-v9\tensorflow.dll"
 * to "node_modules\@tensorflow\tfjs-node\lib\napi-v8"
 */
import DmnModdle from "dmn-moddle";
import Papa from "papaparse"; // CSV parser: https://www.papaparse.com

import {
    Data,
    DMN_DecisionTable,
    Name_of_DMN_InputClause,
    Name_of_DMN_OutputClause,
    DMiNer_error,
    Is_DMN_Decision,
    Is_DMN_DecisionTable,
    Is_DMN_LiteralExpression,
    Is_DMN_UnaryTests,
    Status_mode
} from "../common/Settings";

export enum Compression {
    GZ = 'gz',
    GZIP = 'gzip',
    unknown = '',
    ZIP = 'zip',
}

class Randomizer {
    private _compression: CompressionFormat = Compression.GZIP;
    private readonly _text_decoder = new TextDecoder();

    private readonly _data: Data;

    get data(): Data {
        return this._data;
    }

    constructor(private readonly _data_source: string, private readonly _features: Array<string>, private readonly _units = 1) {
        // Set '_compression' in analysing '_data_source'
        // this._ping(); // Randomization cannot proceed if ping fails...
        // Expected result:
        this._data = {
            "action": Status_mode.RANDOMIZED,
            "data": [
                {
                    data_source: "https://static.openfoodfacts.org/data/en.openfoodfacts.org.products.csv.gz",
                    // image_url: "https://images.openfoodfacts.org/images/products/000/000/000/00003429145/front_es.3.400.jpg",
                    image_nutrition_url: "https://images.openfoodfacts.org/images/products/000/000/000/00026772226/nutrition_fr.5.400.jpg",
                    nutriscore_grade: "a"
                },
                {
                    data_source: "https://static.openfoodfacts.org/data/en.openfoodfacts.org.products.csv.gz",
                    // image_url: "https://images.openfoodfacts.org/images/products/000/000/000/0100/front.3.200.jpg",
                    image_nutrition_url: "https://images.openfoodfacts.org/images/products/000/000/000/0100/front.3.200.jpg",
                    nutriscore_grade: "d"
                }
                // Etc.
            ]
        };
    }

    private static _Chunks(stream_reader: ReadableStreamDefaultReader) {
        return {
            async* [Symbol.asyncIterator]() {
                let result = await stream_reader.read();
                while (!result.done) {
                    yield result.value;
                    result = await stream_reader.read();
                }
            }
        };
    }

    private _ping() {
        console.assert(this._compression === Compression.GZIP); // Temporary...
        const decompression_stream = new DecompressionStream(Compression.GZIP);
        fetch(this._data_source).then(async (response) => {
            if ('body' in response) {
                // 'response.body' is a 'ReadableStream' object:
                console.assert(response.body!.constructor.name === 'ReadableStream');
                console.assert(response.body!.locked === false /*&& response.body.state === 'readable'*/);
                const data_stream: ReadableStream<number> = response.body!.pipeThrough(decompression_stream);
                for await (const chunk of Randomizer._Chunks(data_stream.getReader())) {
                    console.assert(data_stream.locked); // 'getReader()' locks the stream...
                    // Raw data stream:
                    console.assert(chunk.constructor.name === 'Uint8Array');
                    // console.info(`Chunk of size ${chunk.length}... with raw data: ${chunk}`); // Raw data...

                    const pieces = this._text_decoder.decode(chunk).split('\t');
                    if (this._data_source === DMiNer.Open_Food_Facts) {
                        console.info(pieces.filter(piece => piece === "image_nutrition_url"));
                        console.info(pieces.filter(piece => piece === "nutriscore_grade"));
                    }

                    break; // Stop, first chunk only for test...
                }
            }
        });
    }
}

export class DMiNer {
    static readonly URL = "URL";

    static readonly DMN_example1 = "nudger.fr/nudger.fr.dmn";
    static readonly DMN_example2 = "openfoodfacts.org/openfoodfacts.org.dmn";
    static readonly DATA = "DATA/";

    // Données CSV pour test(s): https://people.sc.fsu.edu/~jburkardt/data/csv/csv.html
    static readonly CSV_example_good_format_format = "https://people.sc.fsu.edu/~jburkardt/data/csv/addresses.csv";
    static readonly CSV_example_bad_format = DMiNer.DATA + "openfoodfacts.org/en.openfoodfacts.org.products.csv";

    // ZIP format is supported by Web streams API? -> alternative library: https://stuk.github.io/jszip/
    static readonly Nudger: string = "https://nudger.fr/opendata/gtin-open-data.zip";
    static readonly Open_Food_Facts: string = "https://static.openfoodfacts.org/data/en.openfoodfacts.org.products.csv.gz";
    static readonly Open_Weather_Map: string = "https://bulk.openweathermap.org/sample/daily_16.json.gz";

    private static _Randomizer: Randomizer;

    static async Get_DMN(test_case: string = DMiNer.DMN_example1) {
        // console.info("Where are we? " + __dirname + '\n');
        const where = path.join(path.resolve(__dirname, '../..'), DMiNer.DATA);
        try {
            const xml = file_system.readFileSync(where + test_case, 'utf8'); // Wait for all data...
            // console.info(xml);
            const {
                rootElement: diagram,
                warnings: warnings // Array...
            } = await new DmnModdle().fromXML(xml); // It returns an object with field 'rootElement'...
            if (warnings.length !== 0)
                console.warn(warnings.map((warning: any) => warning.message).join(" * "));

            if (diagram.drgElement.filter(me => Is_DMN_Decision(me) && Is_DMN_DecisionTable(me.decisionLogic)).every(decision => {
                try {
                    const decision_table: DMN_DecisionTable = decision.decisionLogic as DMN_DecisionTable;
                    let features = decision_table.input!.map(input_clause => Name_of_DMN_InputClause(input_clause));
                    const index = features.map(feature => feature.toUpperCase()).indexOf(DMiNer.URL);
                    if (index === -1)
                        return false;
                    // Si la zone 'text' est égale à "" alors prendre 'features[0]' :
                    const data_source = decision_table.input[index].inputExpression.text.replaceAll("\"", ""); // ES2021
                    features = features.concat(decision_table.output!.map(output_clause => Name_of_DMN_OutputClause(output_clause)));
                    // A changer, il y a autant de 'Randomizer' objects que de tables de décision :
                    DMiNer._Randomizer = new Randomizer(data_source, features,/* Number of features whose type is "output", default is '1' */);

                    // decision_table.rule!.forEach((rule) => {
                    //     features.forEach((feature, feature_index) => {
                    //         const column = rule.inputEntry[feature_index];
                    //         // A priori, nothing here since "rules" are ignored...
                    //     });
                    // });

                } catch (error: unknown) {
                    throw new DMiNer_error(decision, DMiNer_error.Invalid_JSON);
                }
            }) === false)
                return Promise.resolve(undefined); // DMN processing causes trouble(s)...
        } catch (error: unknown) {
            console.error(error);
        }
    }

    static async Test_CSV() {
        /* Tensor.js API is effective, but data on the Web are *RARELY* in pretty shape! */
        const addresses: data.CSVDataset = data.csv(DMiNer.CSV_example_good_format_format);
        addresses.columnNames().then(item => console.log(item));
        // https://nodejs.org/api/url.html#constructing-a-url-from-component-parts-and-getting-the-constructed-string
        /**
         * Attention : Node.js et donc TensorFlow.js bloquent au delà de 2GB...
         */
        const openfoodfacts: data.CSVDataset = data.csv(DMiNer.CSV_example_bad_format);
        openfoodfacts.columnNames().then(item => console.log(item));
        // Les données sont mal formatées/préparées pour TensorFlow.js donc léger plantage :
        // await openfoodfacts.forEachAsync(item => console.log(item));
    }

    static Papa_parse() { // Test CSV parsing...
        fetch(DMiNer.CSV_example_good_format_format).then(async (response) => {
            // La transformation en texte ne fonctionne *QUE* pour des tailles limitées :
            Papa.parse(await response.text(), {
                complete: (results) => {
                    // Ca marche mais le fichier originel est petit :
                    console.info("Results:", results.data);
                }
            });
        });
        file_system.readFile(path.join(path.resolve(__dirname, '..'), DMiNer.CSV_example_bad_format), 'utf8', (error, data) => {
            if (error) {
                console.error(error);
                return;
            }
            Papa.parse(data, {
                // complete: (results) => {
                //     console.info("Results:", results.data.join(" --- "));
                // },
                step: (results) => {
                    console.info("Results:", results.data.join(" --- "));
                },
                // header: true,
                preview: 2
            });
        });
    }

    static Test_TensorFlow_js_API() {
        const data = DMiNer._Randomizer.data.data;
        data.forEach((datum: any) => {
            https.get(datum.image_nutrition_url, (response) =>
                response.pipe(file_system.createWriteStream('A.jpg')));
            fetch(datum.image_nutrition_url).then(async (response: Response) => {
                const blob = await response.blob();
                console.assert(response.type !== 'opaque' || (blob.type === "" && blob.size === 0));
                return blob;
            }).then(async (blob: Blob) => {
                const data = await blob.arrayBuffer();
                console.log(data);
            });
        });
    }
}
