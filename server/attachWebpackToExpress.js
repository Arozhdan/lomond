const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const config = require('../webpack.config.js');

/**
 * Attaches webpack to express
 * Supports HMR
 * @param {express} app - initialized express
 */
const attachWebpackToExpress = (app) => {
    const conf = config();
    const hotMiddleware = 'webpack-hot-middleware/client?path=/__webpack_hmr&reload=true';
    conf.plugins.push(new webpack.HotModuleReplacementPlugin());
    for(let key in conf.entry){
        conf.entry[key].push(hotMiddleware);
    }

    const compiler = webpack(conf);

    app.use(webpackDevMiddleware(compiler,{
        publicPath: conf.output.publicPath,
        writeToDisk: true,
    }));

    app.use(webpackHotMiddleware(compiler, {
        path:"/__webpack_hmr"
    }));

    app.use((req, res, next) => {
      res.set('Cache-Control', 'no-store');
      next();
    })
}

module.exports = attachWebpackToExpress;
