/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import * as kruda from '@uncharted.software/kruda'
import { loadCommunities } from '../loadCommunities'

describe('Kruda Dataset Loading', () => {
	it('can load a kruda graph with single rows', async () => {
		const communities = [
			{
				id: 1,
				label: 'moot',
				size: 2,
				integrity: 0.5,
			},
		]
		const heap: kruda.Heap = new kruda.Heap(kruda.Heap.sizeOf1KB)
		const table = loadCommunities(communities, heap)

		expect(table).toBeDefined()
		expect(table.rowCount).toEqual(1)

		// Inspect Columns
		expect(table.header.columnCount).toEqual(4)
		const columnNames = table.header.columns.map(c => c.name)
		expect(columnNames).toContain('id')
		expect(columnNames).toContain('label')
		expect(columnNames).toContain('size')
		expect(columnNames).toContain('integrity')

		const firstRow = table.getRow(0).fields
		expect(firstRow.id).toEqual(1)
		expect(firstRow.size).toEqual(2)
		expect(firstRow.integrity).toEqual(0.5)
		expect(firstRow.label).toEqual('moot')
	})
})
