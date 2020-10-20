/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { FilterChangedEvent, GridReadyEvent, GridApi } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { isEqual } from 'lodash'
import * as React from 'react'
import { memo, useMemo, useEffect, useCallback, useState } from 'react'
import styled from 'styled-components'
import { TableDataSource } from '../TableDataSource'
import {
	translateAgGridFilter,
	transformColumnDefinitionsIntoAgGrid,
} from '../util/ag_translate'
import {
	TableSlice,
	ColumnSpecification,
	BooleanClause,
	FilterClause,
} from 'visual-analytics-components'

export interface GridProps {
	dataVersion: any
	slice: TableSlice<unknown>
	filterExpression: BooleanClause | FilterClause | undefined
	agFilterExpression: any
	columns: ColumnSpecification[]
	onFilterChanged: (expr: BooleanClause | undefined, agExpr: any) => void
}

function isEmptyFilter(agFilter: any): boolean {
	return !agFilter || Object.keys(agFilter).length === 0
}

export const Grid: React.FC<GridProps> = memo(function Grid({
	slice,
	columns,
	filterExpression,
	agFilterExpression,
	onFilterChanged,
}) {
	const [api, setApi] = useState<GridApi | undefined>(undefined)
	const rowData = useMemo(() => new TableDataSource(slice), [slice])
	const columnDefinitions = useMemo(
		() => transformColumnDefinitionsIntoAgGrid(columns),
		[columns],
	)

	const handleFilterChanged = useCallback(
		(evt: FilterChangedEvent) => {
			const filters = evt.api.getFilterModel()
			if (isEmptyFilter(filters)) {
				onFilterChanged(undefined, undefined)
			} else {
				const newFilter = translateAgGridFilter(filters, columns)
				if (!isEqual(newFilter, filterExpression)) {
					onFilterChanged(newFilter, filters)
				}
			}
		},
		[columns, filterExpression, onFilterChanged],
	)

	const handleOnGridReady = useCallback(
		({ api }: GridReadyEvent) => setApi(api),
		[],
	)

	useEffect(() => {
		if (api) {
			const current = api.getFilterModel()

			// Clear the existing filter
			if (!isEmptyFilter(current) && !filterExpression) {
				api.setFilterModel(null)
				return
			}

			// Update the existing filter
			if (agFilterExpression && !isEqual(current, agFilterExpression)) {
				api.setFilterModel(agFilterExpression)
				return
			}
		}
	})

	return (
		<TableContainer>
			<TableTarget className="ag-theme-dark">
				<AgGridReact
					onGridReady={handleOnGridReady}
					onFilterChanged={handleFilterChanged}
					datasource={rowData}
					rowModelType="infinite"
					columnDefs={columnDefinitions}
				/>
			</TableTarget>
		</TableContainer>
	)
})

const TableContainer = styled.div`
	flex: 1;
`

const TableTarget = styled.div`
	height: 100%;
	width: 100%;
`
