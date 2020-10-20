/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import * as kruda from '@uncharted.software/kruda'
import { SliceType } from 'visual-analytics-components'
import { Graph } from '../../../interfaces'
import { createKrudaDataset } from '../index'

describe('Kruda Dataset Loading', () => {
	it('can load a kruda graph with single rows', async () => {
		const graph: Graph = {
			edges: [
				{
					source: 'treebeard',
					target: 'gandalf',
					weight: 0.1,
				},
			],
			communities: [
				{
					id: 1,
					label: 'entmoot',
					size: 2,
					integrity: 5,
				},
			],
			nodes: [
				{
					id: 'gandalf',
					label: 'gandalf',
					community: 1,
					weight: 1,
				},
				{
					id: 'treebeard',
					label: 'treebeard',
					community: 1,
					weight: 1,
				},
			],
			hasEmbeddings: false,
			edgeAttributes: [],
			vertexAttributes: [],
			communityAttributes: [],
		}

		const dataset = createKrudaDataset(
			graph,
			new kruda.Heap(kruda.Heap.sizeOf1KB),
		)
		expect(dataset).toBeDefined()
		expect(dataset.tableNames).toHaveLength(3)

		// Verify # Vertices
		const vertexTable = dataset.table('vertices')
		const allVertices = vertexTable.slice(SliceType.All)
		const numVertices = await allVertices.length()

		const edgeTable = dataset.table('edges')
		const allEdges = edgeTable.slice(SliceType.All)
		const numEdges = await allEdges.length()

		const communityTable = dataset.table('communities')
		expect(communityTable).toBeDefined()
		const allCommunities = communityTable.slice(SliceType.All)
		const numCommunities = await allCommunities.length()

		expect(numVertices).toEqual(2)
		expect(numEdges).toEqual(1)
		expect(numCommunities).toEqual(1)

		const [v1, v2, e1, c1] = await Promise.all([
			allVertices.row(0),
			allVertices.row(1),
			allEdges.row(0),
			allCommunities.row(0),
		])
		expect(v1!.label).toEqual('gandalf')
		expect(v2!.label).toEqual('treebeard')
		expect(e1!.source).toEqual('treebeard')
		expect(e1!.target).toEqual('gandalf')
		expect(c1!.label).toEqual('entmoot')
	})
})
