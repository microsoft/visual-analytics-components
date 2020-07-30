/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { PlainObjectDataSet, DataSet } from 'visual-analytics-components'
import data from '../../data/wpagen.json'

export function wpagenDataset(): DataSet {
	;(data as any).nodes.data.forEach((d: any) => {
		d.weight = d.size
		d.x *= 1000
		d.y *= 1000
		delete d.size
	})
	return new PlainObjectDataSet(data as any)
}
