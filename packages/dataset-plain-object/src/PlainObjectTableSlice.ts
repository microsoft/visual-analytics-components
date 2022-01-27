/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { AbstractTableSlice } from '@visual-analytics-components/abstract-dataset'
import { MessageCreators } from '@visual-analytics-components/messages'
import {
	TableSlice,
	SliceType,
	Unsubscribe,
} from '@visual-analytics-components/types'
import { PlainIterator } from './PlainIterator'
import { RowProxy } from './PlainObjectRowProxy'

export class PlainObjectTableSlice<T>
	extends AbstractTableSlice<T>
	implements TableSlice<T>
{
	private unsubscribes: Unsubscribe[] = []
	private _data: RowProxy<T>[] = []
	private pendingDataChangeEvent = false

	public constructor(
		tableName: string,
		sliceType: SliceType,
		data: RowProxy<T>[],
	) {
		super(tableName, sliceType)
		this.setData(data)
	}

	public setData(data: any[]): void {
		// detach old handlers
		this.unsubscribes.forEach(unsubscribe => unsubscribe())

		this._data = data

		// attach datachange listeners
		this.unsubscribes = data.map(row => row.onDataChange(this.rowDataChanged))
		this.messageHub?.publish(MessageCreators.Data.changed(this.table, this.slice))
	}

	private rowDataChanged = (): void => {
		if (!this.pendingDataChangeEvent) {
			this.pendingDataChangeEvent = true
			// aggregate synchronous row-level datachanges into an asynchronous
			// slice-level datachange event
			setTimeout(() => {
				if (this.messageHub) {
					this.messageHub.publish(
						MessageCreators.Data.rowsChanged(this.table, this.slice),
					)
				}
				this.pendingDataChangeEvent = false
			}, 0)
		}
	}

	public length(): number {
		return this._data.length
	}

	public get(rowNum: number): T | undefined {
		return this._data[rowNum] as any as T
	}

	public [Symbol.iterator](): Iterator<T> {
		return new PlainIterator<T>(this._data)
	}
}
