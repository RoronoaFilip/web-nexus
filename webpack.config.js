const path = require('path');
const isProduction = process.env.NODE_ENV === 'production';


const config = {
  entry: './sdk/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/i,
        loader: 'babel-loader',
      },
      {
        test: /\.css$/i,
        loader: "css-loader",
        // we cannot use the style-loader here because it uses the window object, and we are using the shadow dom
      },
    ],
  },
  resolve: {
    fallback: {
      crypto: false
    }
  }
};

module.exports = () => {
  if (isProduction) {
    config.mode = 'production';
  } else {
    config.mode = 'development';
  }
  return config;
};