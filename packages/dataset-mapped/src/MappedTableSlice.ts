/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { MappedIterator } from './MappedIterator'
import { RowMapper } from './RowMapper'
import {
	FieldMapping,
	TableSlice,
	SliceType,
	MessageHub,
	FilterExpression,
} from '@visual-analytics-components/types'

/**
 * Class that applies a data-map to a Table Slice
 */
export class MappedSlice<T> implements TableSlice<T> {
	private mapper: RowMapper
	public readonly sliceType: SliceType

	public constructor(
		public readonly table: string,
		private source: TableSlice<unknown>,
		mapping: FieldMapping,
	) {
		this.sliceType = source.slice
		this.mapper = new RowMapper(mapping)
	}

	public receiveMessageHub(hub: MessageHub): void {
		this.source.receiveMessageHub(hub)
	}

	/**
	 * Get the type of slice we're mapping (FilteredIn, Selected, etc.)
	 */
	public get slice(): SliceType {
		return this.source.slice
	}

	public get filter(): FilterExpression {
		return this.source.filter
	}

	/**
	 * Gets the length of the table
	 */
	public length(): number {
		return this.source.length()
	}

	/**
	 * Gets a row at a specified numeric index
	 * @param rowNum The row index to retrieve
	 */
	public get(rowNum: number): T | undefined {
		const sourceRow = this.source.get(rowNum)
		return this.mapper.mapRow(sourceRow as Record<string, any>)
	}

	public [Symbol.iterator](): Iterator<T> {
		const sourceIterator: Iterator<unknown> = this.source[Symbol.iterator]()
		return new MappedIterator<unknown, T>(sourceIterator, this.mapper.mapRow)
	}
}
