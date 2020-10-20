/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Graph } from '../../interfaces'
import {
	PlainObjectDataSet,
	DataSet,
	DatumType,
} from 'visual-analytics-components'

export function createPlainObjectDataset(input: Graph): DataSet {
	return new PlainObjectDataSet({
		edges: {
			columns: [
				{
					name: 'source',
					type: DatumType.String,
				},
				{
					name: 'target',
					type: DatumType.String,
				},
				{
					name: 'weight',
					type: DatumType.Number,
				},
				...input.edgeAttributes,
			],
			data: input.edges,
		},
		vertices: {
			columns: [
				{
					name: 'id',
					type: DatumType.String,
				},
				{
					name: 'label',
					type: DatumType.String,
				},
				{
					name: 'weight',
					type: DatumType.Number,
				},
				{
					name: 'community',
					type: DatumType.Number,
				},
				{
					name: 'x',
					type: DatumType.Number,
				},
				{
					name: 'y',
					type: DatumType.Number,
				},
				{
					name: 'z',
					type: DatumType.Number,
				},
				{
					name: 'embeddings',
					type: DatumType.Array,
				},
				...input.vertexAttributes,
			],
			data: input.nodes,
		},
		communities: {
			columns: [
				{
					name: 'id',
					type: DatumType.String,
				},
				{
					name: 'label',
					type: DatumType.String,
				},
				{
					name: 'size',
					type: DatumType.Number,
				},
				{
					name: 'integrity',
					type: DatumType.Number,
				},
				...input.communityAttributes,
			],
			data: input.communities,
		},
	})
}
