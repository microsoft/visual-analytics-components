/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
const { join } = require('path')
const { configure } = require('@essex/webpack-config')

const resolveModules = () => [join(__dirname, '../../../node_modules')]

const extendConfiguration = config => ({
	...config,
	entry: ['@babel/polyfill', './src/index.tsx'],
})

const webpackConfig = configure({
	extendResolveModules: resolveModules,
	extendResolveLoaderModules: resolveModules,
	extendConfiguration,
})

webpackConfig.entry = ['@babel/polyfill', './src/index.tsx']
webpackConfig.stats = 'errors-only'
webpackConfig.devServer.stats = 'errors-only'
module.exports = webpackConfig
