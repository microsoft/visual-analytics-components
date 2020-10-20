/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import * as kruda from '@uncharted.software/kruda'

export interface KrudaHeader {
	columns: {
		name: string
		length: number
		offset: number
		type: any
	}[]
	names: { [key: string]: number }
	rowCount: number
	rowLength: number
	dataLength: number
}

export function createHeader(
	rowCount: number,
	specification: { name: string; length: number; type: any }[],
): KrudaHeader {
	let offset = 0
	const columns = specification.map(({ name, length, type }) => {
		const result = {
			name,
			length,
			offset,
			type,
		}
		offset += length
		return result
	})

	const names: { [key: string]: number } = {}
	columns.forEach((c, index) => (names[c.name] = index))

	const header = {
		columns,
		names,
		rowCount,
		rowLength: offset,
		dataLength: offset * rowCount,
	}
	return header
}

export function setBinaryString(
	view: DataView,
	str: string,
	offset: number,
): void {
	if (str == null) {
		return
	}
	const n = Math.min(str.length, 255)
	view.setUint8(offset, n)
	for (let i = 0; i < n; ++i) {
		if (offset + i < view.byteLength) {
			view.setUint8(offset + i + 1, str.charCodeAt(i))
		}
	}
}

export function columnOffset(columnName: string, header: KrudaHeader): number {
	const colIndex = header.names[columnName]
	const column = header.columns[colIndex]
	return column.offset
}

export function computeLengthStats(
	rows: any[],
	columns: string[],
): Record<string, number> {
	const result: Record<string, number> = {}

	columns.forEach(col => {
		const lengths = rows
			.map(r => r[col])
			.filter(v => !!v)
			.map(value => `${value}`.length)

		result[col] = Math.max(0, ...lengths)
	})
	return result
}

export function adjustLengthStats(stats: Record<string, number>): void {
	Object.keys(stats).forEach(key => {
		/* add one and round to nearest multiple of 4 for byte alignment*/
		stats[key] = (stats[key] + 4) & ~0x03
		/* max label lengths */
		stats[key] = Math.min(stats[key], 256)
	})
}

export function getMemoryHandle(
	header: KrudaHeader,
	heap: kruda.Heap,
): [kruda.MemoryBlock, DataView, number] {
	const binaryHeader = kruda.Header.buildBinaryHeader(header)
	const memory = heap.malloc(header.dataLength + binaryHeader.byteLength)
	const headerView = new Uint8Array(binaryHeader)
	const memoryView = new Uint8Array(memory.buffer)
	memoryView.set(headerView, memory.address)
	const view = memory.dataView
	const offset = binaryHeader.byteLength
	return [memory, view, offset]
}
