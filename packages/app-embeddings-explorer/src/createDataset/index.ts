/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DataSet } from 'visual-analytics-components'
import { Graph } from '../interfaces'
import { createPlainObjectDataset } from './plainObject'

export function createDataset(input: Graph): DataSet {
	// todo: use binary dataset format (arrow, kruda)
	return createPlainObjectDataset(input)
}
