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
        use: [ 'css-loader' ],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [ 'css-loader', 'sass-loader' ],
      },
    ],
  },
};

module.exports = () => {
  if (isProduction) {
    config.mode = 'production';
  } else {
    config.mode = 'development';
  }
  return config;
};