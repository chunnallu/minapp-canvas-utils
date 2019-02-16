module.exports = {
  "mode": "development",
  "entry": "./src/index.js",
  "output": {
      "path": __dirname+'/static/libs',
      "filename": "canvas-utils.js",
      "library": 'CanvasUtils',
      "libraryTarget": 'umd',
  },
  "devtool": "source-map",
  "module": {
      "rules": [
          {
              "enforce": "pre",
              "test": /\.(js|jsx)$/,
              "exclude": /node_modules/,
              "use": "eslint-loader"
          }
      ]
  }
}