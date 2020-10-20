/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import * as kruda from '@uncharted.software/kruda'
import { AbstractTableSlice } from '@visual-analytics-components/abstract-dataset'
import { TableSlice, SliceType } from 'visual-analytics-components'

export class KrudaTableSlice<T> extends AbstractTableSlice<T>
	implements TableSlice<T> {
	private rowCache: Record<string, T> = {}

	public constructor(
		name: string,
		slice: SliceType,
		private kTable: kruda.Table | undefined,
		private isDataOwner: boolean,
	) {
		super(name, slice)
	}

	public setData(data: kruda.Table | undefined, isVolatile: boolean): void {
		if (this.kTable && this.isDataOwner) {
			this.kTable.destroy()
		}
		this.rowCache = {}
		this.kTable = data
		this.isDataOwner = isVolatile
	}

	public length(): number {
		return this.kTable ? this.kTable.rowCount : 0
	}

	public get = (rowNum: number): T | undefined => {
		if (this.kTable && rowNum < this.kTable.rowCount) {
			if (!this.rowCache[rowNum]) {
				const data = this.kTable.getRow(rowNum).fields
				this.rowCache[rowNum] = { ...data }
			}
			return this.rowCache[rowNum]!
		} else {
			return undefined
		}
	}

	public [Symbol.iterator](): Iterator<T> {
		if (!this.kTable) {
			throw new Error('cannot iterate slice without a backing table')
		}
		const startTable = this.kTable
		const hasTableChanged = (): boolean => startTable !== this.kTable

		const getRow = this.get
		const n = this.kTable.rowCount
		let i = 0

		return {
			next(): IteratorResult<T> {
				if (i < n && !hasTableChanged()) {
					const value = getRow(i++)
					return {
						value: value!,
						done: false,
					}
				}
				return { value: undefined as any, done: true }
			},
		}
	}
}
