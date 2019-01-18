var path = require('path');
var webpack = require('webpack');
var CompressionPlugin = require("compression-webpack-plugin");
module.exports = {
  entry: {
    app: './src/App.jsx',
    vendor: ['react','react-dom','react-router','react-bootstrap'],
  },
  output: {
    path: path.resolve(__dirname, 'static'),
    filename: 'app.bundle.js'
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
               /* chunkName= */name:"vendor",
               /* filename= */filename:"vendor.bundle.js"}),

    /*  new webpack.DefinePlugin({ // <-- key to reducing React's size
          'process.env': {
              'NODE_ENV': JSON.stringify('production')
          }
      }),

      new webpack.optimize.UglifyJsPlugin(), //minify everything
      new webpack.optimize.AggressiveMergingPlugin(),//Merge chunks
      new CompressionPlugin({
          asset: "[path].gz[query]",
          algorithm: "gzip",
          test: /\.js$|\.css$|\.html$/,
          threshold: 10240,
          minRatio: 0.8
      })*/
  ],
  module: {

    loaders: [
        { test: /flickity/, loader: 'imports-loader?define=>undefined' },
       {
            test   : /\.ttf$/,
            loader : 'file-loader?name=static/fonts/[name].[ext]'
        },
        { test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000' },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015'],
          plugins: ['transform-object-assign']
        }
      },
      {
        test: /\.jsx$/,
        loader: 'babel-loader',
        query: {
          presets: ['react','es2015'],
          plugins: ['transform-object-assign']
        }
      }, {
            test: /\.scss$/,
            loader: 'style-loader'
        },
        {
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
        },
        {
            test: /\.scss$/,
            use: [{
                loader: "style-loader"
            }, {
                loader: 'css-loader'
            }, {
                loader: "sass-loader"
            }]
        }
    ]
  },
  stats: {
    colors: true
  },
  devtool: 'source-map'
};

