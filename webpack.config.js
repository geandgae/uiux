// import
const path = require('path');
const HtmlPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env) => {
  const isDevelopment = env.mode === 'development';
  
  return {
    mode: isDevelopment ? 'development' : 'production',

    entry: './ia/assets/js/static/core.js',

    output: {
      filename: isDevelopment ? './assets/js/core.js' : './assets/js/core.min.js',
      path: path.resolve(__dirname, 'dist'),
      clean: true
    },

    resolve: {
      alias: {
        '@scss': path.resolve(__dirname, 'ia/assets/scss'),
        '@css': path.resolve(__dirname, 'ia/assets/css')
      }
    },

    module: {
      rules: [
        {
          test: /\.scss$/,
          exclude: /node_modules/,
          use: [
            isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
            'css-loader',
            'postcss-loader',
            'sass-loader',
          ],
          include: path.resolve(__dirname, 'ia/assets/scss')
        },
        {
          test: /\.css$/,
          use: [
            isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
            'css-loader',
            'postcss-loader'
          ],
          include: path.resolve(__dirname, 'ia/assets/css')
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          include: path.resolve(__dirname, 'ia/assets')
        },
        {
          test: /\.json$/,
          loader: 'json-loader',
          type: 'javascript/auto',
          include: path.resolve(__dirname, 'ia/assets/js/test_core_json'),
        },
      ]
    },

    plugins: [
      new HtmlPlugin({
        template: './ia/test_static.html',
        filename: isDevelopment ? './index.html' : './src/test_static.html',
        minify: !isDevelopment,
      }),
      isDevelopment ? undefined : new MiniCssExtractPlugin({
        filename: './assets/css/styles.css',
      }),
    ].filter(Boolean),

    optimization: {
      minimize: !isDevelopment,
    },

    devServer: {
      host: 'localhost',
      // static: {
      //   directory: path.resolve(__dirname, './'),
      // }
    }
  };
};
