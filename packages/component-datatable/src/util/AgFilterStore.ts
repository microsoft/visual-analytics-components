/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { SliceType } from 'visual-analytics-components'

export type AgFilterExpression = any

export class AgFilterStore {
	private agFilters: Record<string, Record<string, any>> = {}

	public getFilter(table: string, slice: SliceType): AgFilterExpression {
		if (this.agFilters[table] != null) {
			return this.agFilters[table][slice]
		} else {
			return undefined
		}
	}

	public setFilter(
		table: string,
		slice: SliceType,
		filter: AgFilterExpression,
	): void {
		if (!this.agFilters[table]) {
			this.agFilters[table] = {}
		}
		this.agFilters[table][slice] = filter
	}

	public clearFilter(table: string, slice: SliceType): void {
		if (!this.agFilters[table]) {
			return
		}
		delete this.agFilters[table][slice]
	}
}
