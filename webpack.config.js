const path = require("path");

const config_template = (target) => {
    return {
        entry: "./src/index.ts",
        mode: "production",
        target,
        output: {
            library: "scole-captcha-resolver",
            path: path.resolve(__dirname, "dist", target),
            filename: "index.js",
            libraryTarget: "umd",
        },
        resolve: {
            extensions: [".ts"]
        },
        devtool: "source-map",
        module: {
            rules: [{
                test: /\.ts$/,
                use: "ts-loader",
                exclude: /node_modules/,
            }]
        },
    };
}

const targets = ["web", "node"];

module.exports = targets.map(config_template);