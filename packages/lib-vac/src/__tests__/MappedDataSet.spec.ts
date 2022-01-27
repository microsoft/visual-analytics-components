/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { MappedDataSet } from '@visual-analytics-components/mapped-dataset'
import { PlainObjectDataSet } from '@visual-analytics-components/plain-object-dataset'
import { DatumType, SliceType } from '@visual-analytics-components/types'
import { Vertex } from '../../../app-embeddings-explorer/src/interfaces'

describe('the mapped DataSet', () => {
	it('can map a table name', () => {
		const tables = new PlainObjectDataSet({
			nodes: {
				columns: [
					{ name: 'id', type: DatumType.String },
					{ name: 'embeddings', type: DatumType.Array },
					{ name: 'x', type: DatumType.Number },
					{ name: 'y', type: DatumType.Number },
				],
				data: [
					{ id: 'abc', x: 0.0, y: 5.0, embeddings: [0.0, 1.0] },
					{ id: 'def', x: 1.0, y: 6.0, embeddings: [0.0, 1.0] },
					{ id: 'hij', x: 2.0, y: 7.0, embeddings: [0.0, 1.0] },
				],
			},
		})

		const mappedTables = new MappedDataSet(tables, {
			vertices: {
				table: 'nodes',
			},
		})

		const vertexTable = mappedTables.table<Vertex>('vertices')

		const allData = vertexTable.slice(SliceType.All)
		const length = allData.length()
		expect(length).toBe(3)

		const firstRow = allData.get(0)!
		expect(firstRow.id).toBe('abc')
		expect(firstRow.x).toBe(0.0)
		expect(firstRow.y).toBe(5.0)
	})

	it('can map table fields', () => {
		const tables = new PlainObjectDataSet({
			nodes: {
				columns: [
					{ name: 'id', type: DatumType.String },
					{ name: 'community', type: DatumType.Number },
					{ name: 'embeddings', type: DatumType.Array },
					{ name: 'x', type: DatumType.Number },
					{ name: 'y', type: DatumType.Number },
				],
				data: [
					{ id: 'abc', x: 0, y: 0, embeddings: [0.0, 0.5, 0.75], community: 1 },
					{
						id: 'def',
						x: 0,
						y: 0,
						embeddings: [0.3, 1.0, 0.123],
						community: 2,
					},
					{ id: 'hij', x: 0, y: 0, embeddings: [0.0, 1.0, 0.8], community: 3 },
				],
			},
		})

		const mappedTables = new MappedDataSet(tables, {
			vertices: {
				table: 'nodes',
				fields: {
					x: 'embeddings[0]',
					y: 'embeddings[1]',
					z: 'embeddings[2]',
					color: 'community',
					category: 'community',
				},
			},
		})

		const vertexTable = mappedTables.table<Vertex>('vertices')
		const allData = vertexTable.slice(SliceType.All)
		const length = allData.length()
		expect(length).toBe(3)

		const firstRow = allData.get(0)!
		expect(firstRow).toBeDefined()
		const rowKeys = Object.keys(firstRow)
		expect(rowKeys).toContain('x')
		expect(rowKeys).toContain('y')
		expect(rowKeys).toContain('z')
		expect(rowKeys).toContain('id')
		expect(rowKeys).toContain('category')
		expect(rowKeys).toContain('color')
		expect(firstRow.id).toBe('abc')
		expect(firstRow.x).toBe(0.0)
		expect(firstRow.y).toBe(0.5)
		expect(firstRow.z).toBe(0.75)
		expect(firstRow.color).toBe(1)
		expect(firstRow.category).toBe(1)

		const secondRow = allData.get(1)!
		expect(secondRow.id).toBe('def')
		expect(secondRow.x).toBe(0.3)
		expect(secondRow.y).toBe(1.0)
		expect(secondRow.z).toBe(0.123)
		expect(secondRow.color).toBe(2)

		const thirdRow = allData.get(2)!
		expect(thirdRow.id).toBe('hij')
		expect(thirdRow.x).toBe(0.0)
		expect(thirdRow.y).toBe(1.0)
		expect(thirdRow.z).toBe(0.8)
		expect(thirdRow.color).toBe(3)

		// check property mutability
		thirdRow.x = 100
		expect(thirdRow.x).toBe(100)
		thirdRow.color = 4
		expect(thirdRow.color).toBe(4)
	})
})
