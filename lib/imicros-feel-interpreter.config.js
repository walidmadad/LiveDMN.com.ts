const path = require('path');
module.exports = {
    entry: './lib/interpreter.js',
    mode: 'production',
    output: {
        filename: 'IMICROS_FEEL_Interpreter.js',
        library: 'IMICROS_FEEL_Interpreter', // 'iife: false' is an alternative...
        path: path.resolve(__dirname, '.')
    }
};
