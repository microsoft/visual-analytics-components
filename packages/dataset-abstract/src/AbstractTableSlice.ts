/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	TableSlice,
	FilterExpression,
	BooleanOperation,
	BooleanClause,
	FilterClause,
	MessageHub,
	SliceType,
} from '@visual-analytics-components/types'

export abstract class AbstractTableSlice<T> implements TableSlice<T> {
	protected messageHub?: MessageHub

	protected constructor(
		public readonly table: string,
		public readonly slice: SliceType,
	) {}

	private _filter: FilterExpression = {
		operation: BooleanOperation.AND,
		expressions: {},
	}

	public get filter(): FilterExpression {
		return this._filter
	}

	public receiveMessageHub(hub: MessageHub): void {
		this.messageHub = hub
	}

	public clearFilter(key?: string): void {
		if (!key) {
			this.filter.expressions = {}
		} else {
			delete this.filter.expressions[key]
		}
	}

	public setFilter(
		key: string | undefined,
		expression: BooleanClause | FilterClause,
	): void {
		if (!key) {
			this.filter.expressions = { __GLOBAL__: expression }
		} else {
			this.filter.expressions[key] = expression
		}
	}

	public abstract length(): number
	public abstract get(index: number): T | undefined
	public abstract [Symbol.iterator](): Iterator<T>
}
