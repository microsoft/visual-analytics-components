/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import * as kruda from '@uncharted.software/kruda'
import { Community } from '../../interfaces'
import { KrudaColumn } from './types'
import {
	computeLengthStats,
	createHeader,
	columnOffset,
	setBinaryString,
	getMemoryHandle,
	adjustLengthStats,
} from './util'

export function loadCommunities(
	communities: Community[],
	heap: kruda.Heap,
): kruda.Table {
	const columns = getColumns(communities)
	const header = createHeader(communities.length, columns)
	const [memory, view, offsetInit] = getMemoryHandle(header, heap)
	let offset = offsetInit

	for (let i = 0; i < communities.length; ++i) {
		const community = communities[i]
		view.setUint32(offset + columnOffset('id', header), community.id, true)
		view.setUint32(offset + columnOffset('size', header), community.size, true)
		view.setFloat32(
			offset + columnOffset('integrity', header),
			community.integrity || 0,
			true,
		)
		setBinaryString(view, community.label, offset + columnOffset('label', header))
		offset += header.rowLength
	}
	return new kruda.Table(memory)
}

function getColumns(communities: Community[]): KrudaColumn[] {
	const stats = computeLengthStats(communities, ['label'])
	adjustLengthStats(stats)
	return [
		{
			name: 'id',
			length: kruda.Types.Uint32.byteSize,
			type: kruda.kBinaryTypeMap.get(kruda.Types.Uint32)!,
		},
		{
			name: 'size',
			length: kruda.Types.Uint32.byteSize,
			type: kruda.kBinaryTypeMap.get(kruda.Types.Uint32)!,
		},
		{
			name: 'integrity',
			length: kruda.Types.Float32.byteSize,
			type: kruda.kBinaryTypeMap.get(kruda.Types.Float32)!,
		},
		{
			name: 'label',
			length: stats.label,
			type: kruda.kBinaryTypeMap.get(kruda.ByteString)!,
		},
	]
}
