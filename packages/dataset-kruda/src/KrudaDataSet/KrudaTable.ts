/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import * as kruda from '@uncharted.software/kruda'
import { AbstractTable } from '@visual-analytics-components/abstract-dataset'
import { DatumType, SliceType, Table } from 'visual-analytics-components'
import { KrudaTableSlice } from './KrudaTableSlice'
import { flatten } from './cnfConversion'

function createDefaultSlices<T>(
	tableName: string,
	table: kruda.Table,
): Record<string, KrudaTableSlice<T>> {
	const result: Record<string, KrudaTableSlice<T>> = {}
	result[SliceType.All] = new KrudaTableSlice(
		tableName,
		SliceType.All,
		table,
		false,
	)
	result[SliceType.FilteredIn] = new KrudaTableSlice(
		tableName,
		SliceType.FilteredIn,
		table,
		false,
	)
	result[SliceType.FilteredOut] = new KrudaTableSlice(
		tableName,
		SliceType.FilteredIn,
		undefined,
		false,
	)
	result[SliceType.Selected] = new KrudaTableSlice(
		tableName,
		SliceType.FilteredIn,
		undefined,
		false,
	)
	result[SliceType.Highlighted] = new KrudaTableSlice(
		tableName,
		SliceType.FilteredIn,
		undefined,
		false,
	)
	return result
}

function determineDatumType(typeName: string): DatumType {
	if (typeName === 'ByteString') {
		return DatumType.String
	}
	// TODO: boolean, object, date
	return DatumType.Number
}

export class KrudaTable<T>
	extends AbstractTable<T, KrudaTableSlice<T>>
	implements Table<T> {
	[key: string]: any // Add index signature
	private filter: kruda.Filter
	protected slices: Record<SliceType, KrudaTableSlice<T>>

	public constructor(name: string, private readonly krudaTable: kruda.Table) {
		super(
			name,
			krudaTable.header.columns.map(({ name, type: { name: typeName } }) => ({
				name,
				type: determineDatumType(typeName),
			})) as any,
		)
		this.filter = new kruda.Filter(krudaTable)
		this.slices = createDefaultSlices(name, krudaTable)
	}

	protected applyDataFilter(slice: KrudaTableSlice<T>): Promise<void> {
		const cnfExpression = flatten(slice.filter)
		return this.filter
			.run(cnfExpression as any, kruda.FilterExpressionMode.CNF)
			.then(result => slice.setData(result as any, true))
	}

	protected applyInverseDataFilter(
		slice: KrudaTableSlice<T>,
		// filter: FilterExpression,
	): Promise<void> {
		// TODO: handle inverse filter expressions
		slice.setData(undefined, false)
		return Promise.resolve()
	}
}
