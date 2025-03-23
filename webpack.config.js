const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: "./src/index.js", // Adjust the entry point based on your project structure
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: "babel-loader", // Use babel-loader for JavaScript/JSX files
        exclude: /node_modules/,
      },
      {
        test: /\.(ts|tsx)$/,
        use: "ts-loader", // Use ts-loader for TypeScript/TSX files
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
    fallback: {
      "buffer": require.resolve("buffer/"), // Polyfill for Buffer
      "crypto": require.resolve("crypto-browserify"), // Crypto polyfill
      "stream": require.resolve("stream-browserify"), // Needed for some libs
    },
  },
  plugins: [
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"], // Inject global Buffer polyfill
      process: "process/browser",
    }),
  ],
};
