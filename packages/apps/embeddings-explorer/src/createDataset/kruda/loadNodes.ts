/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import * as kruda from '@uncharted.software/kruda'
import { Vertex } from '../../interfaces'
import {
	setBinaryString,
	createHeader,
	columnOffset,
	computeLengthStats,
	getMemoryHandle,
	adjustLengthStats,
} from './util'

export function loadNodes(
	nodes: Vertex[],
	heap: kruda.Heap,
): { table: kruda.Table; map: Map<string, number> } {
	const [columns, embeddingsCount] = getColumns(nodes)
	const header = createHeader(nodes.length, columns)
	const [memory, view, offsetInit] = getMemoryHandle(header, heap)
	let offset = offsetInit

	const nodeMap = new Map()
	for (let i = 0; i < nodes.length; ++i) {
		nodeMap.set(nodes[i].id, i)
		view.setUint32(offset + columnOffset('index', header), i, true)
		view.setUint32(
			offset + columnOffset('community', header),
			nodes[i].community,
			true,
		)
		view.setUint32(offset + columnOffset('weight', header), nodes[i].weight, true)
		view.setFloat32(offset + columnOffset('x', header), nodes[i].x || 0, true)
		view.setFloat32(offset + columnOffset('y', header), nodes[i].y || 0, true)
		view.setFloat32(offset + columnOffset('z', header), nodes[i].z || 0, true)

		setBinaryString(view, nodes[i].id, offset + columnOffset('id', header))
		setBinaryString(
			view,
			`${nodes[i].label}`,
			offset + columnOffset('label', header),
		)

		if (embeddingsCount > 0) {
			for (let ei = 0; ei < embeddingsCount; ++ei) {
				view.setFloat32(
					offset + columnOffset(`embedding_${ei}`, header),
					nodes[i].embeddings[ei],
					true,
				)
			}
		}

		offset += header.rowLength
	}

	const result = {
		table: new kruda.Table(memory),
		map: nodeMap,
	}
	return result
}

function getColumns(
	nodes: Vertex[],
): [{ name: string; length: number; type: any }[], number] {
	const stats = computeLengthStats(nodes, ['id', 'label'])
	adjustLengthStats(stats)
	const hasEmbeddings = nodes[0].embeddings != null
	const embeddingsCount = !hasEmbeddings ? 0 : nodes[0].embeddings.length
	const columns = [
		{
			name: 'index',
			length: kruda.Types.Uint32.byteSize,
			type: kruda.kBinaryTypeMap.get(kruda.Types.Uint32),
		},
		{
			name: 'community',
			length: kruda.Types.Uint32.byteSize,
			type: kruda.kBinaryTypeMap.get(kruda.Types.Uint32),
		},
		{
			name: 'weight',
			length: kruda.Types.Uint32.byteSize,
			type: kruda.kBinaryTypeMap.get(kruda.Types.Uint32),
		},
		{
			name: 'x',
			length: kruda.Types.Float32.byteSize,
			type: kruda.kBinaryTypeMap.get(kruda.Types.Float32),
		},
		{
			name: 'y',
			length: kruda.Types.Float32.byteSize,
			type: kruda.kBinaryTypeMap.get(kruda.Types.Float32),
		},
		{
			name: 'z',
			length: kruda.Types.Float32.byteSize,
			type: kruda.kBinaryTypeMap.get(kruda.Types.Float32),
		},
		{
			name: 'id',
			length: stats.id,
			type: kruda.kBinaryTypeMap.get(kruda.ByteString),
		},
		{
			name: 'label',
			length: stats.label,
			type: kruda.kBinaryTypeMap.get(kruda.ByteString),
		},
	]
	if (hasEmbeddings) {
		for (let i = 0; i < embeddingsCount; ++i) {
			columns.push({
				name: `embedding_${i}`,
				length: kruda.Types.Float32.byteSize,
				type: kruda.kBinaryTypeMap.get(kruda.Types.Float32),
			})
		}
	}
	return [columns, embeddingsCount]
}
