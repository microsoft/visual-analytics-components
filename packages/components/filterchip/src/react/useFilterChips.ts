/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useState, useEffect } from 'react'
import { filter } from 'rxjs/operators'
import {
	Manager,
	Message,
	MessageTypes,
	DataChangedMessagePayload,
	SliceType,
} from 'visual-analytics-components'
import { FilterChipData } from './interfaces'

export function useFilterChips(manager: Manager): FilterChipData[] {
	const [chipData, setChipData] = useState<FilterChipData[]>([])
	useEffect(() => {
		const subscription = manager.messages
			.pipe(filter(isFilterInChange))
			.subscribe(() => setChipData(getAllFilterChips(manager)))
		return (): void => subscription.unsubscribe()
	})
	return chipData
}

function isFilterInChange(evt: Message<any>): boolean {
	return (
		evt.type === MessageTypes.Data.Changed &&
		(evt.payload as DataChangedMessagePayload).slice === SliceType.FilteredIn
	)
}

function getAllFilterChips(manager: Manager): FilterChipData[] {
	const result: FilterChipData[] = []
	for (const tableName of manager!.data.tables) {
		const table = manager!.data.table(tableName)
		const filterExpression = table.slice(SliceType.FilteredIn).filter.expressions

		Object.keys(filterExpression).forEach(filterSegmentName => {
			result.push({
				label: `${tableName}.${filterSegmentName}`,
				location: {
					table: tableName,
					key: filterSegmentName,
				},
			})
		})
	}
	return result
}
