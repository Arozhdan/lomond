const path = require('path');
const fs = require('fs');
const glob = require('glob');
const chokidar = require('chokidar');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const nunjucks = require('nunjucks');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const magicImporter = require('node-sass-magic-importer');
const Dotenv = require('dotenv-webpack');

const getPort = require('./get-port');

//DEBUG
const getLogger = require('webpack-log');
const webpack = require('webpack');
const log = getLogger({ name: 'webpack-debug' })


const nunjucksConfigure = require('./server/nunjucksConfig.js');


// LIST ALL DIRECTORIES
const getDirectories = source =>
    fs.readdirSync(source, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => ({
            direntName: dirent.name,
            direntRootPath: path.resolve(source, dirent.name),
        }))

const entriesPath = path.resolve(__dirname, 'src/entries');

module.exports = () => {
    console.log(process.env.NODE_ENV);
    console.log('RUNNING WEBPACK');
    const envNunjucks = nunjucksConfigure(path.resolve(__dirname, 'src'), false);
    const entries = Object.assign(
                        {}, ...getDirectories(path.resolve(__dirname, 'src/entries'))
                            //PAIR JS NAME TO FOLDER NAME , APPEND SASS GLOBAL ENTRY TO IT
                            .map(folder => ({ ['js/'+folder.direntName]: [folder.direntRootPath + '/' + folder.direntName + '.js', path.resolve(__dirname + '/src/styles/main-bundle.scss')] }))
                            //ADD WIDGETS AS AN INDIVIDUAL ENTRY
                            .concat(glob.sync('./src/widgets/**/*.js', {absolute: true}).map(file => ({['widgets/' + file.split('/widgets/').pop().split('.')[0]]: [file]})))
                    )


    // watch templates for change and recompile main files
    if(process.env.NODE_ENV == 'development'){
        console.log('Watching nunjuck files');
        const htmlFiles = glob.sync('src/entries/**/*.html', {absolute: true});
        const watcher = chokidar.watch([path.resolve(__dirname, 'src/templates'), 'src/entries/*/nunjucks/**/*.njk' ]);
        watcher.on('change',
            path => {
                const file = path.split('/').slice(-3).join('/');
                log.info(`${file} was changed`);
                htmlFiles.forEach(htmlFile => {
                    fs.writeFileSync(htmlFile, fs.readFileSync(htmlFile));
                    log.info(`Recompiled ${htmlFile}`);
                })
            }
        );


        ['exit', 'SIGTERM', 'SIGINT'].forEach(processSignal => {
            let watching = true;
            process.on(processSignal, () => {
                if(watching){
                    console.log('Unwatching template html/njk files.');
                    watcher.unwatch();
                    watcher.close();
                    watching = false;
                }
            });
        })

    }

    return {
        mode: process.env.NODE_ENV || 'production',
        entry: entries,
        module: {
            rules: [
                {
                    test: /\.(js)$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                '@babel/preset-env',
                            ],
                            plugins: [
                                '@babel/plugin-transform-runtime'
                            ],
                            comments: false,
                        }
                    }
                },
                {
                    test: /\.s[ac]ss$/i,
                    exclude: /node_modules/,
                    use: [
                        // Creates `style` nodes from JS strings
                        process.env.NODE_ENV === 'development' ? 'style-loader' :   MiniCssExtractPlugin.loader,
                        // Translates CSS into CommonJS
                        'css-loader',
                        'resolve-url-loader',
                        // Compiles Sass to CSS
                        {
                            loader: 'sass-loader',
                            options: {
                                implementation: require("node-sass"),
                                sassOptions:{
                                    importer: magicImporter(),
                                    includePaths: [
                                        path.resolve(__dirname, 'src')
                                    ]
                                },
                            },
                        },
                    ],
                },
                {
                    test: /\.(woff(2)?|ttf|eot|otf)(\?v=\d+\.\d+\.\d+)?$/,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: '[name].[ext]',
                                outputPath: 'assets/fonts/',
                            }
                        }
                    ]
                },
                {
                    test: /\.(png|svg|jpg|webp)$/i,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: '[name].[ext]',
                                outputPath: 'assets/css-assets/',
                            }
                        }
                    ]
                },
                {
                    test: /.(html|njk)$/,
                    exclude: /node_modules/,
                    include: [
                        path.resolve(__dirname, "src/entries"),
                        path.resolve(__dirname, "src/templates")
                    ],
                    use: [
                        {
                            loader: 'html-loader',
                            options: {
                                attributes: false,
                                minimize: false,
                                preprocessor: (content, loaderContext) => {
                                    let result;
                                    try {
                                        result = envNunjucks.renderString(content);
                                    } catch (error) {
                                        loaderContext.emitError(error);

                                        return content;
                                    }

                                    return result;
                                }
                            }
                        }
                    ]
                },

            ]
        },
        resolve: {
            extensions: ['*', '.js', '.scss'],
            alias: {
                styles: path.resolve(__dirname, 'src', 'styles'),
                assets: path.resolve(__dirname, 'src', 'assets'),
            }
        },
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: '[name].js',
            publicPath: '/',
        },
        devServer: {
            watchContentBase: true,
            writeToDisk: true,
            contentBase: path.resolve(__dirname, 'dist'),
            liveReload: true,
            hot: true,
            watchOptions: {
                ignored: [
                    '/node_modules/**',
                ]
            },
        },
        plugins: [
            new CopyPlugin({
                patterns: [
                    { from: 'src/assets', to: 'assets' },
                    { from: 'src/entries', to: 'entries' },
                    { from: 'src/templates', to: 'templates' },
                ],
            }),
            ...getDirectories(path.resolve(__dirname, 'src','entries')).map(dirent => new HtmlWebpackPlugin({
                template: path.resolve(dirent.direntRootPath + "/" + dirent.direntName + ".html"),
                filename: dirent.direntName + '.html',
                chunks: ['js/'+dirent.direntName],
                minify: false,
            })),
            ...process.env.NODE_ENV !== "development" ? [new MiniCssExtractPlugin({
                filename: `styles.css`
            })] : [],
            new Dotenv(),
            new webpack.DefinePlugin({
                'process.env.RUNNING_PORT': getPort()
            })
        ]
    }
};
