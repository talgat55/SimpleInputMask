const path = require("path");

module.exports = {
    entry: "./src/simpleInputMask.ts",
    mode: 'production',
    output: {
        filename: "simpleInputMask.js",
        path: path.resolve(__dirname, "dist"),
        library: "SimpleInputMask",
        libraryExport: 'default',
        libraryTarget: 'window',
    },

    resolve: {
        extensions: [".ts", ".js"],
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
};
