var webpack = require('webpack');
module.exports = {
	module: {
		loaders: [{
				test: /\.js?$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
				query: {
					presets: ['es2015'],
				},
			}, {
				test: /\.css$/,
				loaders: ['style', 'css?modules'],
			}, {
				test: /\.tag$/,
				exclude: /node_modules/,
				loader: 'riotjs-loader',
				query: {
					template: 'pug',
					presets: ['es6']
				}
			}, {
				test: /\.scss$/,
				loaders: ["style", "css", "sass"]
			}, {
				test: /\.(otf|eot|svg|ttf|woff|woff2)$/,
				loader: 'file'
			}

		],
	},
	entry: {
		bundle: './app/index.js',
		style: './app/style.js'
	},
	output: {
		path: './public/javascripts',
		filename: '[name].js',
	},
	devtool: 'source-map',
	resolve: {
		alias: {
			'vue$': 'vue/dist/vue.common.js'
		}
	},
	plugins: [
		new webpack.ProvidePlugin({
			jQuery: "jquery",
			$: "jquery"
		})
	]
};
