/**
 * Created by hmelenok on 21.10.16.
 */
module.exports = {
    entry: "./index.js",
    output: {
        path: __dirname,
        filename: "./dist/mime-types-browser.js"
    },
    module: {
        loaders: [
            { test: /\.json$/, loader: "json" }
        ]
    }
};