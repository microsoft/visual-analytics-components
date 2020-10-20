/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Callback, Unsubscribe } from '@visual-analytics-components/types'

/**
 * A row proxy
 */
export type RowProxy<T> = T & {
	onDataChange: (handler: Callback) => Unsubscribe
}

export class PlainObjectRowProxy {
	private _dataChangeHandlers: Callback[] = []

	public static create<T>(
		source: Record<string, any>,
		columnNames: string[],
	): RowProxy<T> {
		return (new PlainObjectRowProxy(source, columnNames) as any) as RowProxy<T>
	}

	protected constructor(source: Record<string, any>, columnNames: string[]) {
		// Hide DataChangeHandlers from downstream clients
		Object.defineProperty(this, '_dataChangeHandlers', {
			enumerable: false,
			writable: true,
		})

		columnNames.forEach(columnName => {
			Object.defineProperty(this, columnName, {
				enumerable: true,
				get: () => source[columnName],
				set: (value: any) => {
					source[columnName] = value
					this._dataChangeHandlers.forEach((dch: any) => dch())
				},
			})
		})
	}

	public onDataChange(handler: Callback): Unsubscribe {
		this._dataChangeHandlers.push(handler)
		return (): void => {
			this._dataChangeHandlers = this._dataChangeHandlers.filter(
				(h: any) => h !== handler,
			)
		}
	}
}
