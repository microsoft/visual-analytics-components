/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { parse } from 'querystring'
import { DataSet } from 'visual-analytics-components'
import { Graph } from '../interfaces'
import { createKrudaDataset } from './kruda'
import { createPlainObjectDataset } from './plainObject'

export function createDataset(input: Graph): DataSet {
	const useKruda = isKrudaEnabled()
	console.log(`Creating ${useKruda ? 'Kruda' : 'Plain'} Dataset...`)
	return useKruda ? createKrudaDataset(input) : createPlainObjectDataset(input)
}

export function isKrudaEnabled(): boolean {
	if (typeof window !== 'undefined') {
		const searchObject = parse(window.location.search)
		return Object.keys(searchObject).some(t => t.indexOf('kruda') > -1)
	} else {
		return false
	}
}
