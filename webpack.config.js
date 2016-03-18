module.exports = {
  entry: "./app/app.js",
  output: {
    filename: "public/assets/js/bundle.js"
  },
  module: {
    loaders: [{
      test: [/\.es6$/, /\.js$/],
      exclude: ['/node_modules/', '/src/'],
      loader: 'babel-loader',
      query: {
        cacheDirectory: true,
        presets: ['es2015']
      }
    }]
  },
  resolve: {
    modulesDirectories: ['node_modules'],   
    extensions: ['', '.js', '.es6']
  }
}