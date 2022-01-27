/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useState, useEffect } from 'react'
import { filter, throttleTime } from 'rxjs/operators'
import {
	Manager,
	TableSlice,
	SliceType,
	Message,
	MessageTypes,
} from 'visual-analytics-components'
import { useSlice } from './useSlice'

export function useHighlightedVertices(manager: Manager | undefined): string[] {
	const vertices = useSlice(manager, SliceType.Highlighted)
	const [ids, setIds] = useState<string[]>([])
	useEffect(() => {
		if (vertices) {
			manager!.messages
				.pipe(
					filter(isHighlightChangeEvent),
					throttleTime(50, undefined, { trailing: true }),
				)
				.subscribe(() => {
					setIds(readSlice(vertices))
				})
		}
	}, [manager, vertices])
	return ids
}

export function useSelectedVertices(manager: Manager | undefined): string[] {
	const vertices = useSlice(manager, SliceType.Selected)
	const [ids, setIds] = useState<string[]>([])
	useEffect(() => {
		if (vertices) {
			manager!.messages
				.pipe(
					filter(isSelectionChangeEvent),
					throttleTime(50, undefined, { trailing: true }),
				)
				.subscribe(() => {
					setIds(readSlice(vertices))
				})
		}
	}, [manager, vertices])
	return ids
}

function readSlice(slice: TableSlice<{ id: string }>): string[] {
	const result: string[] = []
	for (let i = 0; i < slice.length(); ++i) {
		result.push(slice.get(i)!.id)
	}
	return result
}

const isHighlightChangeEvent = (evt: Message<any>): boolean =>
	evt.type === MessageTypes.Data.Changed &&
	evt.payload.table === 'vertices' &&
	evt.payload.slice === SliceType.Highlighted

const isSelectionChangeEvent = (evt: Message<any>): boolean =>
	evt.type === MessageTypes.Data.Changed &&
	evt.payload.table === 'vertices' &&
	evt.payload.slice === SliceType.Selected
