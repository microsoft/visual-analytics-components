/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import * as React from 'react'
import { memo, useState, useCallback, useMemo, useEffect } from 'react'
import { filter } from 'rxjs/operators'

import styled from 'styled-components'
import {
	SliceType,
	Manager,
	BooleanClause,
	MessageCreators,
	MessageTypes,
	DataChangedMessagePayload,
	Message,
	Table,
} from 'visual-analytics-components'
import { AgFilterStore } from '../util/AgFilterStore'
import { Controls } from './Controls'
import { GlobalStyles } from './GlobalStyles'
import { Grid } from './Grid'

export interface DatatableProps {
	manager: Manager
	configuration: any
}

export const Datatable: React.FC<DatatableProps> = memo(function Datatable({
	manager,
}) {
	const tableNames = useTableNames(manager)
	const store = useMemo(() => new AgFilterStore(), [])

	const [slice, setSlice] = useState(SliceType.FilteredIn)
	const [table, setTable] = useState(tableNames[0])
	const filterLocation = useMemo(() => ({ table, key: 'datatable' }), [table])
	const dataTable = useTable(manager, table)
	const dataSlice = useMemo(() => dataTable.slice(slice), [dataTable, slice])
	const [dataVersion, setDataVersion] = useState<any>(undefined)
	const [filterExpression, setFilterExpression] = useState(
		() => dataTable.slice(slice).filter.expressions['datatable'],
	)

	const onFilterChanged = useCallback(
		(expr: BooleanClause | undefined, agExpr: any) => {
			if (expr) {
				store.setFilter(table, slice, agExpr)
				setFilterExpression(expr)
				manager.publish(
					MessageCreators.Filter.replace(filterLocation, expr, 'Apply Data Filter'),
				)
			} else {
				store.clearFilter(table, slice)
				manager.publish(
					MessageCreators.Filter.clear(filterLocation, 'Clear Data Filter'),
				)
			}
		},
		[filterLocation, manager, slice, store, table],
	)

	const handleTableChanged = useCallback((tableName: string) => {
		console.log('set table', tableName)
		setTable(tableName)
	}, [])

	const handleSliceChanged = useCallback(
		(slice: SliceType) => setSlice(slice),
		[],
	)

	const isDataChangeEvent = useCallback(
		(evt: Message<any>) => {
			return (
				evt.type === MessageTypes.Data.Changed &&
				(evt as Message<DataChangedMessagePayload>).payload!.table === table &&
				(evt as Message<DataChangedMessagePayload>).payload!.slice === slice
			)
		},
		[table, slice],
	)

	useEffect(() => {
		const subscription = manager.messages
			.pipe(filter(isDataChangeEvent))
			.subscribe((evt: Message<DataChangedMessagePayload>) => {
				setFilterExpression(dataTable.slice(slice).filter.expressions['datatable'])
				setDataVersion(evt)
			})
		return (): void => subscription.unsubscribe()
	}, [manager, isDataChangeEvent, dataTable, slice])

	return (
		<>
			<GlobalStyles />
			<Container>
				<Controls
					tableNames={tableNames}
					table={table}
					slice={slice}
					onTableChanged={handleTableChanged}
					onSliceChanged={handleSliceChanged}
				/>
				<Grid
					filterExpression={filterExpression}
					agFilterExpression={store.getFilter(table, slice)}
					dataVersion={dataVersion}
					columns={dataTable.columns}
					slice={dataSlice}
					onFilterChanged={onFilterChanged}
				/>
			</Container>
		</>
	)
})

function useTableNames(manager: Manager): string[] {
	return useMemo(() => manager.data.tables, [manager])
}

function useTable(manager: Manager, name: string): Table<unknown> {
	return useMemo(() => manager.data.table(name), [manager, name])
}

const Container = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
`
