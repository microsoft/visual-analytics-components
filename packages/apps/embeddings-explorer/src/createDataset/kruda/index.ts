/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import * as kruda from '@uncharted.software/kruda'
import {
	KrudaDataSet,
	KrudaTable,
} from '@visual-analytics-components/kruda-dataset'
import { DataSet } from 'visual-analytics-components'
import { Graph } from '../../interfaces'
import { loadCommunities } from './loadCommunities'
import { loadEdges } from './loadEdges'
import { loadNodes } from './loadNodes'

const DEFAULT_HEAP_SIZE = kruda.Heap.sizeOf1MB * 512

export function createKrudaTables(
	input: Graph,
	heap: kruda.Heap,
): Record<string, kruda.Table> {
	const { table: vertices, map } = loadNodes(input.nodes, heap)
	const edges = loadEdges(input.edges, map, heap)
	const communities = loadCommunities(input.communities, heap)
	return { vertices, edges, communities }
}

export function createKrudaDataset(
	input: Graph,
	heap: kruda.Heap = new kruda.Heap(DEFAULT_HEAP_SIZE),
): DataSet {
	const { vertices, edges, communities } = createKrudaTables(input, heap)
	return new KrudaDataSet({
		edges: new KrudaTable('edges', edges),
		vertices: new KrudaTable('vertices', vertices),
		communities: new KrudaTable('communities', communities),
	})
}
