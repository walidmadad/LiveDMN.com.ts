import * as file_system from 'node:fs';
import * as node_wav from 'node-wav'; // https://github.com/andreasgal/node-wav
// import * as WavDecoder from 'wav-decoder';

export default class Spectrogram {
    static readonly Bit_depth = 32;

    static Load(file_name: string): Float32Array {
        const audio_data = node_wav.decode(file_system.readFileSync(file_name));
        // console.info(file_name + " 'audio_data.sampleRate': " + audio_data.sampleRate // '44100', i.e., 44.1 kHz
        //     + " 'audio_data.channelData.length': " + audio_data.channelData.length);
        // for (let i = 0; i < audio_data.channelData.length; i++)
        //     console.log("\t" + audio_data.channelData[i].constructor.name + " with length " + audio_data.channelData[i].length); // 'Float32Array' object...
        console.assert(audio_data.channelData.length === 1, "'audio_data.channelData.length === 1', untrue");
        return audio_data.channelData[0];
    }

    // static async Load_(file_name: string): Promise<Float32Array> { // Same as 'Load'...
    //     const audio_data = await WavDecoder.decode(file_system.readFileSync(file_name));
    //     // for (let i = 0; i < audio_data.channelData.length; i++)
    //     //     console.log("\t" + audio_data.channelData[i].length);
    //     return audio_data.channelData[0];
    // }
}
