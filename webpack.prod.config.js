const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const webpack = require('webpack'); 
const CopyPlugin = require('copy-webpack-plugin');
const nodeExternals = require('webpack-node-externals')

module.exports = {
	target:'node',
	mode: 'production',
	entry: './src/app.ts',
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: [{
					loader: 'ts-loader', options: {
						transpileOnly: true,
						experimentalWatchApi: true				
					}
				}],
				exclude: /node_modules/

			},
			{
				test: /\.js$/,
				use: 'babel-loader',
				exclude: /node_modules/
			  }
		],
	},
	resolve: {
		plugins: [new TsconfigPathsPlugin({
			configFile: './tsconfig.json',
			extensions: ['.tsx', '.ts', '.js']
		})
		],
		extensions: ['.tsx', '.ts', '.js'],
	},
	output: {
		pathinfo: false,
		filename: 'app.js',
		path: path.resolve(__dirname, './out/'),
	},
	// externals: [nodeExternals({
	// 	allowlist:[/^(?!.*express|swagger-ui-dist).*$/gi]
	// }
	externals: {
		//'express':'commonjs express',
		'swagger-ui-dist':'commonjs swagger-ui-dist'		
	},
	plugins: [
		new webpack.ProgressPlugin(),
		// new CopyPlugin({
		// 	patterns: [
		// 		{ from: path.resolve(__dirname, 'node_modules/express'), to: 'node_modules/express' },
		// 		{ from: path.resolve(__dirname, 'node_modules/swagger-ui-dist/'), to: 'node_modules/swagger-ui-dist' },
		// 		{ from: path.resolve(__dirname, 'package.json'), to: 'package.json' },
		// 		{ from: path.resolve(__dirname, 'config.json'), to: 'config.json' },
		// 		{ from: path.resolve(__dirname, './src/swagger.yaml'), to: 'swagger.yaml' },
		// 		{ from: path.resolve(__dirname, './src/.ebextentions/node.yml'), to: 'node.yml' },
				
		// 	  ]
		// 	}
		// )
	]
}	
