/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
const { configure } = require('@essex/webpack-config')
const webpack = require('webpack')

const extendConfiguration = config => ({
	...config,
	entry: ['@babel/polyfill', './src/index.tsx'],
})

const webpackConfig = configure({
	pnp: true,
	extendConfiguration,
})

webpackConfig.entry = ['@babel/polyfill', './src/index.tsx']
webpackConfig.stats = 'errors-only'
webpackConfig.resolve.fallback = {
	"stream": require.resolve("stream-browserify"),
	events: require.resolve('events/'),
	buffer: require.resolve('buffer/'),
	process: require.resolve('process/browser')
}
webpackConfig.plugins.push(
	new webpack.ProvidePlugin({
		Buffer: ['buffer', 'Buffer'],
		process: ['process']
	}))
module.exports = webpackConfig
