const path = require('path');

module.exports = {
    entry: './src/simpleInputMask.ts',
    mode: 'production',
    output: {
        filename: 'simpleInputMask.js',
        path: path.resolve(__dirname, 'dist'),
        library: 'SimpleInputMask',
        libraryTarget: 'umd'
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    }
};
