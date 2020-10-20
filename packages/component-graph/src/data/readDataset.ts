/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { InputNode, InputEdge, GraphContainer } from '@graspologic/graph'
import debug from 'debug'
import { Vertex, Edge } from '../interfaces'
import { isLayoutRequired } from './isLayoutRequired'
import { DataSet, SliceType } from 'visual-analytics-components'
const log = debug('vac:graph')

/**
 * A scale applied to the dataset
 */

export function readDataset(data: DataSet, is3D: boolean): GraphContainer {
	const nodesTable = data.table<Vertex>('vertices')
	const edgesTable = data.table<Edge>('edges')
	const allNodes = nodesTable.slice(SliceType.All)
	const allEdges = edgesTable.slice(SliceType.All)

	const nodes: InputNode[] = []
	const edges: InputEdge[] = []

	let rv: InputNode
	for (const node of allNodes) {
		rv = node as InputNode
		if (rv) {
			nodes.push({
				// Make a copy so we don't mutate
				...rv,
				z: rv.z ? rv.z : 0,
			})
		}
	}

	for (const edge of allEdges) {
		if (edge) {
			edges.push(edge as InputEdge)
		}
	}

	const input = { nodes, edges }
	const randomize = isLayoutRequired(input)
		? ([-500, 500, -500, 500] as [number, number, number, number])
		: undefined
	if (randomize) {
		log('randomizing node positions')
	}
	return GraphContainer.intern(input, { randomize })
}
