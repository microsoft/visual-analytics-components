/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { TableData } from './PlainObjectDataSet'
import { PlainObjectRowProxy, RowProxy } from './PlainObjectRowProxy'
import { PlainObjectTableSlice } from './PlainObjectTableSlice'
import {
	applyFilterExpression,
	applyInverseFilterExpression,
} from './applyFilterExpression'
import { AbstractTable } from '@visual-analytics-components/abstract-dataset'
import {
	Table,
	ColumnSpecification,
	SliceType,
	FilterExpression,
} from '@visual-analytics-components/types'

function createDefaultSlices<T>(
	tableName: string,
	rows: RowProxy<T>[],
): Record<string, PlainObjectTableSlice<T>> {
	const result: Record<string, PlainObjectTableSlice<T>> = {}
	result[SliceType.All] = new PlainObjectTableSlice<T>(
		tableName,
		SliceType.All,
		rows,
	)
	result[SliceType.FilteredIn] = new PlainObjectTableSlice<T>(
		tableName,
		SliceType.FilteredIn,
		rows,
	)
	result[SliceType.FilteredOut] = new PlainObjectTableSlice<T>(
		tableName,
		SliceType.FilteredOut,
		[],
	)
	result[SliceType.Selected] = new PlainObjectTableSlice<T>(
		tableName,
		SliceType.Selected,
		[],
	)
	result[SliceType.Highlighted] = new PlainObjectTableSlice<T>(
		tableName,
		SliceType.Highlighted,
		[],
	)
	return result
}

export class PlainObjectTable<T>
	extends AbstractTable<T, PlainObjectTableSlice<T>>
	implements Table<T> {
	public readonly columns: ColumnSpecification[]
	protected slices: Record<string, PlainObjectTableSlice<T>>
	private rows: any[]

	public constructor(name: string, tableData: TableData) {
		super(name, tableData.columns)
		this.columns = tableData.columns
		const columnNames = this.columns.map(column => column.name)
		this.rows = tableData.data.map(row =>
			PlainObjectRowProxy.create(row, columnNames),
		)
		this.slices = createDefaultSlices(name, this.rows)
	}

	protected applyDataFilter(slice: PlainObjectTableSlice<T>): Promise<void> {
		slice.setData(
			applyFilterExpression(
				this.rows,
				slice.filter,
				this.noFilterNoData[slice.slice],
			),
		)
		return Promise.resolve()
	}

	protected applyInverseDataFilter(
		slice: PlainObjectTableSlice<T>,
		filter: FilterExpression,
	): Promise<void> {
		slice.setData(
			applyInverseFilterExpression(
				this.rows,
				filter,
				this.noFilterNoData[slice.slice],
			),
		)
		return Promise.resolve()
	}
}
