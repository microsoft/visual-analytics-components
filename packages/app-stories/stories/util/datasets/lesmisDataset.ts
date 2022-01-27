/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	PlainObjectDataSet,
	DatumType,
	DataSet,
} from 'visual-analytics-components'
import { lesMis } from '../data'

export function lesMisDataset(): DataSet {
	return new PlainObjectDataSet({
		nodes: {
			data: lesMis.nodes.map((n, index) => ({
				id: index,
				community: n.group,
				label: n.name,
				weight: Math.random(),
				x: Math.random() * 1000,
				y: Math.random() * 1000,
			})),
			columns: [
				{ name: 'id', type: DatumType.String },
				{ name: 'label', type: DatumType.String },
				{ name: 'community', type: DatumType.Number },
				{ name: 'weight', type: DatumType.Number },
				{ name: 'x', type: DatumType.Number },
				{ name: 'y', type: DatumType.Number },
			],
		},
		edges: {
			data: lesMis.links.map(l => ({
				source: l.source,
				target: l.target,
				weight: l.value,
			})),
			columns: [
				{ name: 'source', type: DatumType.Number },
				{ name: 'target', type: DatumType.Number },
				{ name: 'weight', type: DatumType.Number },
			],
		},
	})
}
