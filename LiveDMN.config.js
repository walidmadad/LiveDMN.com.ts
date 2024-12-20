const path = require('path');
module.exports = {
    devtool: 'eval-source-map',
    entry: './ts/DMiNer.ts',
    mode: 'development', // Source maps are enabled automatically (https://blog.jakoblind.no/debug-webpack-app-browser/)...
    module: {
        rules: [
            {
                test: /\.css$/i, use: ["style-loader", "css-loader"]
            },
            {
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ],
    },
    // optimization: {
    //     minimize: true // This is default in 'production' mode...
    // },
    output: {
        clean: true,
        filename: 'DMiNer.js',
        path: path.resolve(__dirname, 'js'),
    },
    resolve: {
        extensions: [".ts", ".js"]
        // modules: ['node_modules', 'X'] // Places to look for modules...
    }
};
