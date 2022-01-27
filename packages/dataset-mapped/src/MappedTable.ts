/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	Table,
	FieldMapping,
	ColumnSpecification,
	SliceType,
	MessageHub,
	TableSlice,
} from '@visual-analytics-components/types'
import { MappedSlice } from './MappedTableSlice'

/**
 * Class that applies a data-map to a Table
 */
export class MappedTable<T> implements Table<T> {
	public columns: ColumnSpecification[]
	private slices: Record<SliceType, TableSlice<T>> = {} as any

	public constructor(
		public readonly name: string,
		private fieldMap: FieldMapping | undefined,
		private source: Table<unknown>,
	) {
		if (!name) {
			throw new Error('table name must be defined')
		}
		if (!source) {
			throw new Error('source table must be defined')
		}
		// Map out the columns by name
		const colNameMap: Record<string, ColumnSpecification> = {}
		source.columns.forEach(c => (colNameMap[c.name] = c))

		if (fieldMap) {
			Object.keys(fieldMap).forEach(targetField => {
				const sourceField = fieldMap[targetField]
				colNameMap[targetField] = colNameMap[sourceField]
			})
		}

		this.columns = Object.keys(colNameMap).map(c => ({
			...colNameMap[c],
			name: c,
		}))
	}

	public receiveMessageHub(hub: MessageHub): void {
		this.source.receiveMessageHub(hub)
	}

	/**
	 * Create a slice of the given type (FilteredIn, Selected, etc.) using our mapping
	 * @param level Type of slice to create
	 */
	public slice(level: SliceType): TableSlice<T> {
		const sourceSlice = this.source.slice(level)
		if (!this.slices[level]) {
			if (this.fieldMap) {
				this.slices[level] = new MappedSlice(this.name, sourceSlice, this.fieldMap)
			} else {
				this.slices[level] = sourceSlice as TableSlice<T>
			}
		}
		return this.slices[level]
	}
}
