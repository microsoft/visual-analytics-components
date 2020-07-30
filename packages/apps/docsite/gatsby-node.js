/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable  no-console */
const { resolve } = require('path')

const docTemplate = resolve(`src/templates/docTemplate.tsx`)

/**
 * Dynamically creates pages in the static website
 */
exports.createPages = function createPages({ actions, graphql }) {
	const retrieveMarkdownPages = () =>
		graphql(`
			{
				allMarkdownRemark(limit: 1000) {
					edges {
						node {
							frontmatter {
								path
							}
						}
					}
				}
			}
		`)

	console.log('retreiving markdown pages...')
	return retrieveMarkdownPages().then(result => {
		console.log('finished retreiving markdown pages')

		if (result.errors) {
			console.log('graphql error', result.errors)
			throw new Error('Error invoking graphql for pages')
		}

		result.data.allMarkdownRemark.edges.forEach(({ node }) => {
			const {
				frontmatter: { path: pagePath },
			} = node
			actions.createPage({
				path: pagePath,
				component: docTemplate,
				context: {}, // additional data can be passed via context
			})
		})
	})
}
