// cnpm i mini-css-extract-plugin webpack-fix-style-only-entries css-loader webpack webpack-cli sass-loader node-sass webpack-glob-entry -D
const path = require('path')
const rootPath = path.resolve(__dirname,'./'); // 设置路径
const glob = require('webpack-glob-entry')  
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FixStyleOnlyEntriesPlugin = require('webpack-fix-style-only-entries'); // 修正插件-删除打包后的空js文件

// CSS入口配置
const CSS_PATH_CONFIG = {
  pattern: './src/*.scss',
  entry: path.join(rootPath, 'src'),
  dist: path.resolve(rootPath, 'build'),
}

// 遍历除所有需要打包的CSS文件路径
const getCSSEntries = (config) => {
  const pattern = glob(config.pattern)
  const fileList = Object.keys(pattern)
  return fileList.reduce((previous, current) => {
    const filePath = path.parse(path.relative(config.entry, current))
    const withoutSuffix = filePath.name
    previous[withoutSuffix] = path.join(path.resolve(config.entry, current + '.scss')) 
    return previous
  }, {})
}

module.exports = {
  mode: 'none',
  context: path.resolve(rootPath), // 获取上下文
  // 入口配置
  entry: getCSSEntries(CSS_PATH_CONFIG), // 多入口
  // 输出配置
  output: {
    path: CSS_PATH_CONFIG.dist, 
    // filename: '[name].css', // 避免冲突，使用插件自带输出配置
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use:[MiniCssExtractPlugin.loader, 'css-loader','sass-loader']
      }
    ]
  },
  plugins: [
    new FixStyleOnlyEntriesPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: "[id].css"
    }),
    
  ]
}