/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { VertexClickHandler } from '@graspologic/react'
import { useCallback } from 'react'
import {
	MessageCreators,
	Manager,
	FilterLocation,
	Message,
	UpdateFilterMessagePayload,
} from 'visual-analytics-components'

export function useVertexClickHandler(manager: Manager): VertexClickHandler {
	return useCallback(
		(id: string | undefined) => {
			const evt = id ? newVertexSelectionEvent(id) : clearVertexSelectionEvent()
			manager.publish(evt)
		},
		[manager],
	)
}

const clearVertexSelectionEvent = (): Message<FilterLocation> =>
	MessageCreators.Selection.clear(LOCATION)

const newVertexSelectionEvent = (
	id: string,
): Message<UpdateFilterMessagePayload> =>
	MessageCreators.Selection.replaceWithIds(LOCATION, [id], SELECTION_LOG)

const LOCATION: FilterLocation = {
	table: 'vertices',
	key: 'graph_view',
}

const SELECTION_LOG = 'Examining Vertex'
