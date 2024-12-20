"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const file_system = __importStar(require("node:fs"));
const node_wav = __importStar(require("node-wav")); // https://github.com/andreasgal/node-wav
// import * as WavDecoder from 'wav-decoder';
class Spectrogram {
    static Load(file_name) {
        const audio_data = node_wav.decode(file_system.readFileSync(file_name));
        // console.info(file_name + " 'audio_data.sampleRate': " + audio_data.sampleRate // '44100', i.e., 44.1 kHz
        //     + " 'audio_data.channelData.length': " + audio_data.channelData.length);
        // for (let i = 0; i < audio_data.channelData.length; i++)
        //     console.log("\t" + audio_data.channelData[i].constructor.name + " with length " + audio_data.channelData[i].length); // 'Float32Array' object...
        console.assert(audio_data.channelData.length === 1, "'audio_data.channelData.length === 1', untrue");
        return audio_data.channelData[0];
    }
}
Spectrogram.Bit_depth = 32;
exports.default = Spectrogram;
//# sourceMappingURL=Spectrogram.js.map