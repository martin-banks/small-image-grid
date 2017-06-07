/* eslint-env node */

const HTMLWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const FS = require('fs')
const MKDIRP = require('mkdirp')
const path = require('path')
const colors = require('colors')

const ENV = process.env.NODE_ENV
// const publicPath = require(`./src/publicPath-${ENV}`)
const CFG = require('./src/config.json')

const DD = val => (`0${val}`).slice(-2) // convert number to double digits

const date = new Date()
const datestamp = `${date.getFullYear()}${DD(1 + date.getMonth())}${DD(date.getDate())}`
const timestamp = `${DD(date.getHours())}-${DD(date.getMinutes())}-${DD(date.getSeconds())}`

const buildDir = `./BUILD/${ENV}/${ENV}__${datestamp}_${timestamp}`
const buildPath = path.join(__dirname, buildDir)
const embedPath = CFG.path[ENV]
const jsName = ENV === 'PROD' ? 'app.min.js' : 'app.js'
const cssName = ENV === 'PROD' ? 'app.min.css' : 'app.css'
const localstyle = CFG.localstyle ? `\n\t<link rel="stylesheet" href="${buildPath}/${CFG.localstyle}" />` : ''

if (ENV && ENV !== 'HOT') {
	const report = {
		config: CFG,
		env: ENV,
		buildTime: {
			date: datestamp,
			time: timestamp,
		},
	}
	const embedCode = `<div>${localstyle}
	<link rel="stylesheet" href="${embedPath}/${cssName}" />
	<script>
		var chapter = 3
	</script>
	<div id="${CFG.projectName}"></div>
	<script type="text/javascripts" src="${embedPath}/${jsName}" ></script>
</div>`
	MKDIRP(buildDir, err => {
		if (err) {
			console.log(colors.bgRed(err))
			return
		}
		console.error(colors.bgGreen('\n\n Project directory created successfully ').black)
		FS.writeFile(`${buildPath}/report.json`, JSON.stringify(report, 'utf8', '\t'), err => {
			console.log(colors.bgGreen(' Report generated successfully ').black)
		})
		FS.writeFile(`${buildPath}/embedCode.html`, embedCode, err => {
			console.log(colors.bgGreen(' Embed code generated successfully \n\n').black)
		})
	})
}

module.exports = {
	entry: path.join(__dirname, '/src/app.js'),
	output: {
		filename: jsName,
		path: buildPath,
		// publicPath: buildPath,
	},
	resolve: {
		extensions: ['.js', '.css'],
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: 'babel-loader',
			},

			{
				test: /\.css$|.sass$/,
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: [
						{
							loader: 'css-loader',
							options: {
								modules: true,
								localIdentName: '[name]__[local]___[hash:base64:5]',
								minimize: ENV === 'PROD',
								importLoaders: 1,
							},
						},
						{ loader: 'postcss-loader' },
						{ loader: 'sass-loader' },
					],
				}),
			},
			{
				test: /\.(jpe?g|png|gif|svg)$/i,
				use: 'file-loader?hash=sha512&digest=hex&name=images/[path][name]__[hash:6].[ext]',
			},
		],
	},

	plugins: [
		new HTMLWebpackPlugin({
			title: CFG.projectName,
			template: path.join(__dirname, '/src/index.html'),
			filename: 'index.html',
			localstyle,
			inject: 'body',
		}),
		new ExtractTextPlugin({
			filename: cssName,
			allChunks: true,
		}),
	],

}
