/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IDatasource, IGetRowsParams } from 'ag-grid-community'
import { TableSlice } from 'visual-analytics-components'

export class TableDataSource implements IDatasource {
	public constructor(private slice: TableSlice<unknown>) {}

	public getRows(params: IGetRowsParams): void {
		this.doGetRows(params)
	}

	private async doGetRows(params: IGetRowsParams): Promise<void> {
		const result: unknown[] = []
		const tableLength = await this.slice.length()
		let endRow: number | undefined

		for (let i = params.startRow; i < params.endRow && i < tableLength; ++i) {
			if (i === tableLength - 1) {
				endRow = i
			}
			const row = await this.slice.get(i)
			if (row) result.push(row)
		}

		if (endRow) {
			params.successCallback(result, endRow)
		} else {
			params.successCallback(result)
		}
	}

	public destroy(): void {
		// do nothing
	}
}
