//import webpack from 'webpack';
import path from 'path';
import HtmlWebpackPlugin from'html-webpack-plugin';

export default {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(import.meta.dirname, 'dist'),
    clean: true,
  },
  devtool: 'inline-source-map',
  devServer: {
    static: './dist',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      title: 'Battleship Game',
    }),
//    new webpack.DefinePlugin({
  //    global: 'window',
    //}),
  ],
  module: {
  rules: [
    {
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
        }
      }
    },
     {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
  ]
}
}
