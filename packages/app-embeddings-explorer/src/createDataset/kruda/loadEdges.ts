/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import * as kruda from '@uncharted.software/kruda'
import { Edge } from '../../interfaces'
import { KrudaColumn } from './types'
import {
	setBinaryString,
	createHeader,
	columnOffset,
	getMemoryHandle,
	adjustLengthStats,
} from './util'

export function loadEdges(
	edges: Edge[],
	nodeMap: Map<string, number>,
	heap: kruda.Heap,
): kruda.Table {
	const edgeCount = getEdgeCount(edges, nodeMap)
	const columns = getColumns(edges)
	const header = createHeader(edgeCount, columns)
	const [memory, view, offsetInit] = getMemoryHandle(header, heap)
	let offset = offsetInit
	let edgeIdx = 0

	for (let i = 0, n = edges.length; i < n; ++i) {
		if (nodeMap.has(edges[i].source) && nodeMap.has(edges[i].target)) {
			edgeIdx++
			view.setUint32(offset + columnOffset('id', header), edgeIdx, true)
			setBinaryString(
				view,
				edges[i].source,
				offset + columnOffset('source', header),
			)
			setBinaryString(
				view,
				edges[i].target,
				offset + columnOffset('target', header),
			)
			view.setFloat32(
				offset + columnOffset('weight', header),
				edges[i].weight,
				true,
			)
			offset += header.rowLength
		}
	}
	return new kruda.Table(memory)
}

function getColumns(edges: Edge[]): KrudaColumn[] {
	const stats = { idLength: 0 }
	for (let i = 0, n = edges.length; i < n; ++i) {
		stats.idLength = Math.max(
			stats.idLength,
			edges[i].source.length,
			edges[i].target.length,
		)
	}
	adjustLengthStats(stats)

	return [
		{
			name: 'id',
			length: kruda.Types.Uint32.byteSize,
			type: kruda.kBinaryTypeMap.get(kruda.Types.Uint32)!,
		},
		{
			name: 'source',
			length: stats.idLength,
			type: kruda.kBinaryTypeMap.get(kruda.ByteString)!,
		},
		{
			name: 'target',
			length: stats.idLength,
			type: kruda.kBinaryTypeMap.get(kruda.ByteString)!,
		},
		{
			name: 'weight',
			length: kruda.Types.Float32.byteSize,
			type: kruda.kBinaryTypeMap.get(kruda.Types.Float32)!,
		},
	]
}

function getEdgeCount(edges: Edge[], nodeMap: Map<string, number>): number {
	return edges.reduce((count, edge) => {
		if (nodeMap.has(edge.source) && nodeMap.has(edge.target)) {
			++count
		}
		return count
	}, 0)
}
