const webpack = require('webpack');
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = (env, argv) => {
  console.log("Mode: " + argv.mode);

  return {
    entry: './src/client/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'index_bundle.js',
      publicPath: '/'
    },
    devtool: "source-map",
    resolve: {
      // Add '.ts' and '.tsx' as resolvable extensions.
      extensions: [".ts", ".tsx", ".js", ".jsx", '.scss']
    },
    module: {
      rules: [
        {
          test: /\.(png|jpe?g|svg)$/,
          loader: 'file-loader',
          options: {
            name: 'img/[name].[ext]',
          }
        },
        { test: /\.(js)$/, use: 'babel-loader' },
        { test: /\.css$/, use: [ 'style-loader', 'css-loader' ]},
        {
          test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
                outputPath: 'fonts/'
              }
            }
          ]
        },
        {
          test: /\.s[ac]ss$/i,
          use: [
            // Creates `style` nodes from JS strings
            'style-loader',
            // Translates CSS into CommonJS
            'css-loader',
            // Compiles Sass to CSS
            'sass-loader',
          ],
        },
        {
          test: /\.ts(x?)$/,
          exclude: /node_modules/,
          use: [
              {
                  loader: "ts-loader"
              }
          ]
        },
        // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
        {
            enforce: "pre",
            test: /\.js$/,
            loader: "source-map-loader"
        },
        {
          test: /\.m?js/,
          resolve: {
              fullySpecified: false
          }
      },
      ]
    },
    mode: argv.mode,
    plugins: [
      argv.mode === 'production' 
        ? new webpack.DefinePlugin({'AUTH_URL': `"https://sample-dashboard-auth-server.herokuapp.com"`})
        : new webpack.DefinePlugin({'AUTH_URL': `"http://localhost:7070"`}),
      new HtmlWebpackPlugin({
        template: 'src/client/index.html'
      })
    ],
    devServer: {
      historyApiFallback: true,
      proxy: {
        '/api': 'http://localhost:7070',
      },
      open: true,
      compress: true,
      hot: true,
      port: 8080,
    }
  };
};