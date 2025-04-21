// webpack.config.mjs
import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default (env, argv) => {
    const isDev = argv.mode === "development";

    return {
        entry: "./src/simpleInputMask.ts",
        mode: isDev ? "development" : "production",
        output: {
            filename: "simpleInputMask.js",
            path: path.resolve(__dirname, "dist"),
            library: "SimpleInputMask",
            libraryTarget: "umd",
            libraryExport: "default",
            globalObject: "this",
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
