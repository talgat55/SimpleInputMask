const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = (env, argv) => {
    const isDev = argv.mode === "development";

    return {
        entry: "./src/simpleInputMask.ts",
        mode: isDev ? "development" : "production",
        output: {
            filename: "simpleInputMask.js",
            path: path.resolve(__dirname, "dist"),
            library: "SimpleInputMask",
            libraryExport: "default",
            libraryTarget: "window",
            clean: true,
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
        devtool: isDev ? "inline-source-map" : false,
        devServer: {
            static: {
                directory: path.resolve(__dirname, "public"),
            },
            compress: true,
            port: 4000,
            open: true,
            hot: true,
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: path.resolve(__dirname, "public", "index.html"),
            }),
        ],
    };
};
