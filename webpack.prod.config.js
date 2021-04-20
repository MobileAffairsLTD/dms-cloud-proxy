/* eslint-disable */
const path = require('path');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const DmsAppWebPackPlugin = require('dynamicsmobile/templates/mobile-app/dms/dms-webpack-plugin');
const dmsAppWebPackPlugin = new DmsAppWebPackPlugin();
const TerserPlugin = require('terser-webpack-plugin')
const webpack = require('webpack'); // to access built-in plugins

module.exports = {
	mode: 'production',
	entry: dmsAppWebPackPlugin.entries(path.resolve(__dirname, "src")),
	module: {
		rules: [
			{
				test: /\.css$/i,
				use: ['style-loader', 'css-loader'],
			},
			{
				test: /\.tsx?$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'ts-loader'
					}
				],
				exclude: /node_modules/
			},
			{
				test: /\.(woff|woff2|eot|ttf|png|jpg|jpeg|svg)$/,
				use: [{
					loader: 'url-loader',
					options: {
						limit: 3192,
						name: 'images/[hash]-[name].[ext]'
					}
				}]
			}
		],
	},
	resolve: {
		symlinks: false,
		plugins: [
			new TsconfigPathsPlugin({
				configFile: './tsconfig.json',
				extensions: ['.ts', '.js']
			})
		],
		extensions: ['.ts', '.js'],
	},
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, '.bin/user/apparea/sandbox/app/en'),
	},
	optimization: {
		splitChunks: {
			cacheGroups: {
				vendor: {
					test: /[\\/]node_modules[\\/]/,
					name: 'framework.bundle',
					chunks: 'all'
				}
			}
		},
		minimize: true,
		minimizer: [
			new TerserPlugin({
				terserOptions: {
					mangle: false
				}
			})
		]
	},
	plugins: [
		new webpack.ProgressPlugin(),
		dmsAppWebPackPlugin
	],
	node:{
		fs:'empty'
	}
}