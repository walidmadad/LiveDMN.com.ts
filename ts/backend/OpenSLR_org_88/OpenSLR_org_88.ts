import * as file_system from 'node:fs';
import path from 'node:path';
import {pipeline, Readable} from 'node:stream';
import {promisify} from 'node:util';
import * as zlib from 'node:zlib';

import * as tar from 'tar';
import * as tf from "@tensorflow/tfjs-node";

import {Compression} from "../DMiNer";
import {Data, Status_mode} from "../../common/Settings";
import Spectrogram from "./Spectrogram";

export enum Social_attitude {
    Distant = "a2",
    Dominant = "a3",
    Friendly = "a1",
    Seductive = "a4",
    Unknown = "unknown"
}

export default class OpenSLR_org_88 { // https://gitlab.com/nicolasobin/att-hack
    private static _Test_model(): tf.Sequential {
        // P. 128 du bouquin 'TensorFlow.js' :
        const model = tf.sequential();
        model.add(tf.layers.conv2d({ // https://js.tensorflow.org/api/latest/#layers.dense
            activation: 'relu',
            /** IMPORTANT: the first layer in the model needs 'inputShape'. Make sure excluding batch size when providing 'inputShape'.
             * For example, if you plan to feed the model tensors of shape '[BS, 3, 3]', where 'BS' can be any batch size,
             * then specify 'inputShape' as '[3, 3]':
             */
            filters: 16,
            inputShape: [8, 8],
            kernelSize: 3,
            name: "A"
        }));
        return model;
    }


    private static readonly Test_data = [
        path.join(path.resolve(__dirname, '../../../DATA/gitlab.com_nicolasobin_att-hack/'), "F01_a1_s008_v01.wav"),
        path.join(path.resolve(__dirname, '../../../DATA/gitlab.com_nicolasobin_att-hack/'), "F08_a4_s015_v03.wav"),
        path.join(path.resolve(__dirname, '../../../DATA/gitlab.com_nicolasobin_att-hack/'), "F08_a4_s039_v04.wav")
    ];
    private readonly data: tf.Tensor4D;
//https://js.tensorflow.org/api/latest/#signal.stft
    // https://github.com/tensorflow/tfjs/issues/3945
    //   https://www.oreilly.com/library/view/learning-tensorflowjs/9781492090786/ch04.html
    //     https://stackoverflow.com/questions/59210767/tensorflow-js-resize-image-to-specific-byte-size

    //tf.image.resizeBilinear

    // https://github.com/tensorflow/tfjs-models/blob/master/speech-commands/README.md
    static Test() {
        const datum0 = Spectrogram.Load(OpenSLR_org_88.Test_data[0]); // length 70912
        const datum1 = Spectrogram.Load(OpenSLR_org_88.Test_data[1]); // length 88448
        const datum2 = Spectrogram.Load(OpenSLR_org_88.Test_data[2]); // length 107008
        // Resampling: https://github.com/aolsenjazz/libsamplerate-js
        // - The first dimension (null) is an undetermined batch dimension...
        // - The second dimension (e.g., 43) is the number of audio frames.
        // - The third dimension (e.g., 232) is the number of frequency data points in every frame (i.e., column) of the spectrogram
        // - The last dimension (e.g., 1) is fixed at 1. This follows the convention of convolutional neural networks in TensorFlow.js and Keras.


        // const r = tf.tensor3d(datum0, [60,60,8]);
        // console.info("Rank: " + r.rank + ", shape: " + r.shape);
         //    const z= tf.image.resizeBilinear(datum0, [60,60]);
         // console.info("Rank: " + z.rank + ", shape: " + z.shape);

        //  const x = tf.tensor(datum0);//
        // const rr=x.reshape([2, 2]);
       //  console.info("x Rank: " + rr.rank + ", x shape: " +rr.shape);
        // La
        const tensor = tf.tensor([datum2, datum1, datum0]);
        console.info("Rank: " + tensor.rank + ", shape: " + tensor.shape); // Rank: 2, shape: 3,107008
        const a=tensor.arraySync();


        // return tf.tensor4d(datum0, [null, 28, 28, 1]);
    }

    static readonly Archive_file_name = "OpenSLR_org_88";
    static readonly Path = "Volumes/CLEM_HDD/IRCAM/Open_SLR/wav/";
    static readonly URL = "https://www.openslr.org/resources/88/wav.tgz";
    static readonly Ages = new Map([
        ["F01", "47"],
        ["F02", "43"],
        ["F03", "51"],
        ["M04", "43"],
        ["F05", "34"],
        ["F06", "38"],
        ["M07", "42"],
        ["F08", "55"],
        ["M09", "38"],
        ["F10", "51"],
        ["M11", "56"],
        ["M12", "25"],
        ["M13", "-"],
        ["F14", "36"],
        ["F15", "51"],
        ["M16", "47"],
        ["M17", "59"],
        ["F18", "53"],
        ["M19", "42"],
        ["F20", "42"]
    ]);
    static readonly Sentences = new Array(
        "oui",
        "non",
        "certes",
        "bien-sûr",
        "salut",
        "bonjour",
        "bonsoir",
        "tant pis",
        "très bien",
        "c’est vrai",
        "par ici",
        "au revoir",
        "à demain",
        "impossible",
        "volontiers",
        "j'ai toussé",
        "peu importe",
        "nous partons",
        "bonne journée",
        "bonsoir jeanne",
        "faites leur signe",
        "asseyez vous",
        "évidemment",
        "assurément",
        "il est midi",
        "salut marie",
        "tu as marché",
        "au revoir yann",
        "bonjour marie",
        "ta soeur a bu",
        "à demain paul",
        "il faisait bon",
        "je pars demain",
        "par ici jeanne",
        "je pars ce soir",
        "elle a pris peur",
        "sans aucun doute",
        "je prends le temps",
        "veuillez me croire",
        "donc fais moi signe",
        "je prends une pause",
        "faites lui confiance",
        "donne leur une chance",
        "vous avez dormi",
        "je suis parti tôt",
        "nous avons chanté",
        "nous avons eu peur",
        "veuillez m'écouter",
        "bonne journée marie",
        "donne moi une réponse",
        "il est tard à londres",
        "je pars tout de suite",
        "veuillez vous asseoir",
        "faisons leur confiance",
        "tu as pris la fuite",
        "faites moi donc une offre",
        "vous avez réfléchi",
        "il est tôt à new-york",
        "il est tard à paris",
        "donne moi une occasion",
        "tu as dit la même chose",
        "vous avez pris le temps",
        "il est tard à lisbonne",
        "nous allons prendre un verre",
        "laisse moi une deuxième chance",
        "elle est partie pour bale",
        "tu es parti en week-end",
        "tu as oublié ma veste",
        "elle a oublié ma fête",
        "je suis parti loin d'ici",
        "j'ai toussé toute la soirée",
        "je suis parti sans trainer",
        "tu as marché toute la nuit",
        "tu es parti pour l'espagne",
        "vous êtes allés à la plage",
        "elle est partie en vacances",
        "nous allons attendre un peu",
        "nous allons prendre un café",
        "ta soeur a bu toute la nuit",
        "vous êtes partis rapidement",
        "c’est vrai attendons un peu",
        "il faisait froid aujourd'hui",
        "nous allons prendre la fuite",
        "vous êtes partis en week-end",
        "certes attendons qu'il arrive",
        "il fait lourd ce soir à londres",
        "nous allons prendre des vacances",
        "vous avez oublié mon verre",
        "elle a dit ce que je voulais",
        "elle est allée à la montagne",
        "il fait beau ce soir à paris",
        "impossible attendons un peu",
        "tu as fait ce que je voulais",
        "elle a fait ce que je voulais",
        "vous avez dormi toute la nuit",
        "vous avez dit ce qu'il fallait",
        "vous avez fait ce qu'il fallait",
        "nous allons attendre qu'il arrive",
        "nous allons prendre notre journée",
        "c’est vrai allons prendre un café"
    );

    //https://wavesurfer.xyz/
//https://stackoverflow.com/questions/58109632/how-to-convert-wav-file-to-spectrogram-for-tensorflowjs-with-columntruncatelengt
    // https://convert.ing-now.com/audio-spectrogram-creator/
    static Get() {
        fetch(OpenSLR_org_88.URL).then((response) => {
            if ('body' in response) { // 'response.body' is a 'ReadableStream' object:
                console.assert(response.body!.constructor.name === 'ReadableStream');
                console.assert(response.body!.locked === false /*&& response.body.state === 'readable'*/);
                const uncompressed_data_stream: ReadableStream<number> = response.body!.pipeThrough(new DecompressionStream(Compression.GZIP));
                // Conversion from Web 'ReadableStream' to file system 'ReadStream' (https://stackoverflow.com/questions/71509505/how-to-convert-web-stream-to-nodejs-native-stream):
                // TypeScript compilation error (https://stackoverflow.com/questions/63630114/argument-of-type-readablestreamany-is-not-assignable-to-parameter-of-type-r):
                // @ts-ignore
                const source = Readable.fromWeb(uncompressed_data_stream);
                const target = file_system.createWriteStream(OpenSLR_org_88.Archive_file_name);
                // Flat uncompressed (archive) file on disk (10,6 GB) is simply saved:
                source.pipe(target);
                source.on('end', () => { // Use of 'node-tar' library:
                    tar.list({ // Let us the possibility of extracting directory hierarchy inside archive file:
                        file: OpenSLR_org_88.Archive_file_name,
                        onReadEntry: entry => console.info(entry.path)
                    });
                });
            }
        });
    }

    private static _Audio_file_processing(datum: any, audio_file_name: string): never | void {
        const audio_stream = file_system.createReadStream(OpenSLR_org_88.Path + audio_file_name);
        let audio = new Uint8Array;
        audio_stream.on('error', (error) => {
            throw new Error("Audio file extraction failed... " + error);
        });
        audio_stream.on('end', () => {
            console.info((audio instanceof Uint8Array) + " *** " + audio.constructor.name);
            console.info(audio_file_name + " *** " + JSON.stringify(datum) + " *** " + audio.length);
            datum.audio = audio;
            // File destruction?
            // file_system.unlink(OpenSLR_org_88.Path + audio_file_name, (error) => {
            //     if (error)
            //         console.error(OpenSLR_org_88.Path + audio_file_name + " audio file destruction failed... " + error);
            // });
        });
        audio_stream.on('data', (chunk) => {
            // console.assert(chunk instanceof Uint8Array && chunk.constructor.name === 'Buffer');
            // console.info(`Chunk of size ${chunk.length}... with raw data: ${chunk}`);
            // console.assert(audio.byteLength === audio.length);
            const _audio = new Uint8Array(audio.byteLength + chunk.length);
            _audio.set(audio); // Copy...
            _audio.set(chunk as Uint8Array, audio.byteLength); // Add...
            audio = _audio; // Update...
        });
    }

    static async Data(): never | Promise<Data> {
        const data: Data = {
            "action": Status_mode.RANDOMIZED,
            "data": new Array
        };
        try {
            await OpenSLR_org_88._Get_data().then(_ => console.info("'_Get_data' done..."));
            await tar.list({ // Let us the possibility of extracting directory hierarchy inside archive file:
                file: OpenSLR_org_88.Archive_file_name,
                onReadEntry: entry => {
                    // Just test small sample:
                    if (data.data.length > 6) return;

                    const audio_file_name = path.basename(entry.path);
                    const sentence_index = Number.parseInt(audio_file_name.substring(8, 11));
                    if (Number.isNaN(sentence_index) || sentence_index < 1)  // Filter ill-formatted files...
                        return;
                    const social_attitude_key = audio_file_name.substring(4, 6);
                    data.data.push({
                        data_source: OpenSLR_org_88.URL,
                        age: OpenSLR_org_88.Ages.get(audio_file_name.substring(0, 3)),
                        gender: audio_file_name.substring(0, 1),
                        sentence: OpenSLR_org_88.Sentences[sentence_index - 1],
                        social_attitude:
                            social_attitude_key === Social_attitude.Distant ? Object.keys(Social_attitude)[Object.values(Social_attitude).indexOf(Social_attitude.Distant)]
                                : social_attitude_key === Social_attitude.Dominant ? Object.keys(Social_attitude)[Object.values(Social_attitude).indexOf(Social_attitude.Dominant)]
                                    : social_attitude_key === Social_attitude.Friendly ? Object.keys(Social_attitude)[Object.values(Social_attitude).indexOf(Social_attitude.Friendly)]
                                        : social_attitude_key === Social_attitude.Seductive ? Object.keys(Social_attitude)[Object.values(Social_attitude).indexOf(Social_attitude.Seductive)]
                                            : Object.keys(Social_attitude)[Object.values(Social_attitude).length - 1] // 'Unknown'...
                    });
                    OpenSLR_org_88._Audio_file_processing(data.data[data.data.length - 1], audio_file_name);
                }
            }).catch((error) => {
                throw new Error("'tar.list' failed... " + error);
            }).finally(() => {
                file_system.unlink(OpenSLR_org_88.Archive_file_name, (error) => {
                    if (error)
                        console.error(OpenSLR_org_88.Archive_file_name + " archive file destruction failed... " + error);
                });
            });
        } catch (error: unknown) {
            throw error; // Hot potato policy...
        }
        return data;
    }

    private static async _Get_data(): never | Promise<void> {
        await fetch(OpenSLR_org_88.URL).then(async (response) => {
            if ('body' in response) {
                // 'response.body' is a 'ReadableStream' object:
                console.assert(response.body!.constructor.name === 'ReadableStream');
                console.assert(response.body!.locked === false /*&& response.body.state === 'readable'*/);
                // Conversion from Web 'ReadableStream' to file system 'ReadStream' (https://stackoverflow.com/questions/71509505/how-to-convert-web-stream-to-nodejs-native-stream):
                // @ts-ignore
                const source = Readable.fromWeb(response.body); // Compressed data stream...
                // source.pipe(file_system.createWriteStream('OpenSLR_org_88.tgz')); // Compressed version on local disk...
                const target = file_system.createWriteStream(OpenSLR_org_88.Archive_file_name);
                /** 'zlib'-based decompression (optional because 'tar' does the job later on if compressed) */
                await promisify(pipeline)(source, zlib.createUnzip(), target).catch((error) => {
                    throw new Error("'zlib' failed... " + error);
                }); // Archive file created...
                // Use of 'node-tar' library:
                await tar.extract({file: OpenSLR_org_88.Archive_file_name}).then(_ => {
                    // Archive file expanded...
                }).catch((error) => {
                    throw new Error("'tar.extract' failed... " + error);
                });
            } else
                throw new Error("''body' in response', untrue... ");
        }).catch((error) => {
            throw new Error("'fetch' failed... " + error);
        });
    }
}
