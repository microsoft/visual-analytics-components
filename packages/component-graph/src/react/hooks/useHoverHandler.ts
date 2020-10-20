/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useCallback } from 'react'
import {
	Manager,
	MessageCreators,
	FilterLocation,
	UpdateFilterMessagePayload,
	Message,
	Handler,
} from 'visual-analytics-components'

export function useHoverHandler(
	manager: Manager | undefined,
): Handler<string | undefined> {
	return useCallback(
		(id: string | undefined) => {
			if (manager) {
				const evt = id ? setSelection(id) : clearSelection()
				manager.publish(evt)
			}
		},
		[manager],
	)
}

const setSelection = (id: string): Message<UpdateFilterMessagePayload> =>
	MessageCreators.Highlight.replaceWithIds(LOCATION, [id])

const clearSelection = (): Message<FilterLocation> =>
	MessageCreators.Highlight.clear(LOCATION)

const LOCATION: FilterLocation = {
	table: 'vertices',
}
