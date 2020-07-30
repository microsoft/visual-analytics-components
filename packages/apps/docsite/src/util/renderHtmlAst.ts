/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/no-var-requires */
import debug from 'debug'
import { createElement } from 'react'
import components from '../components/md'
import processImages from './processImagesInMarkdownAst'

const log = debug('site:renderHtmlAst')

const rehypeReact = require('rehype-react')
const renderAst = new rehypeReact({
	createElement,
	components,
}).Compiler

export default function renderHtmlAst(node: any): any {
	try {
		processImages(node)
		const result = renderAst(node)
		return result
	} catch (err) {
		log('error rendering doc page', err)
	}
}
