/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import * as kruda from '@uncharted.software/kruda'
import { createKrudaTables } from '..'
import { Graph } from '../../../interfaces'
import { computeLengthStats } from '../util'
import { readAutoCluster } from './mock_data'

function isASCII(str: string): boolean {
	// eslint-disable-next-line no-control-regex
	return /^[\x00-\x7F]*$/.test(str)
}

describe('Kruda Integration Tests', () => {
	let graph: Graph
	beforeAll(async () => {
		graph = await readAutoCluster()
	})

	it('can compute stats for vertices', () => {
		const nodeStats = computeLengthStats(graph.nodes, ['id', 'label'])
		expect(nodeStats.id).toEqual(36)
		expect(nodeStats.label).toEqual(51)

		const edgeStats = computeLengthStats(graph.edges, ['source', 'target'])
		expect(edgeStats.source).toEqual(36)
		expect(edgeStats.target).toEqual(36)

		const communityStats = computeLengthStats(graph.communities, ['label'])
		expect(communityStats.label).toEqual(37)
	})

	it('can load kruda tables from a set of CSV data', async () => {
		const { vertices, edges, communities } = createKrudaTables(
			graph,
			new kruda.Heap(10 * kruda.Heap.sizeOf1MB),
		)

		graph.nodes.forEach((n, index) => {
			const krudaNode = vertices.getRow(index).fields
			expect(krudaNode.id).toEqual(n.id)
			expect(krudaNode.weight).toEqual(n.weight)
			expect(krudaNode.community).toEqual(n.community)

			// Our kruda loading does not work with utf8 character sets yet
			if (isASCII(n.label)) {
				expect(krudaNode.label).toEqual(`${n.label}`)
			}
		})

		graph.edges.forEach((e, index) => {
			const krudaEdge = edges.getRow(index).fields
			expect(krudaEdge.source).toEqual(e.source)
			expect(krudaEdge.target).toEqual(e.target)
			expect(krudaEdge.weight).toEqual(e.weight)
		})

		graph.communities.forEach((c, index) => {
			const krudaCommunity = communities.getRow(index).fields!
			expect(krudaCommunity.id).toEqual(c.id)
			expect(krudaCommunity.label).toEqual(c.label)
			expect(krudaCommunity.size).toEqual(c.size)
			expect(krudaCommunity!.integrity! - c!.integrity!).toBeLessThan(0.00001)
		})
	})
})
