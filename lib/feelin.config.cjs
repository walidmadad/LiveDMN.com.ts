const path = require('path');
module.exports = {
  entry: './dist/index.cjs',
  mode: 'production',
  output: {
    filename: 'FEELin.js',
    library: 'FEELin',
    path: path.resolve(__dirname, '.')
  }
};
