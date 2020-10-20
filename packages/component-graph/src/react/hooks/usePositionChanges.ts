/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { PositionMap, GraphRenderer } from '@graspologic/renderer'
import { useEffect } from 'react'
import { filter, throttleTime } from 'rxjs/operators'
import { Configuration, DEFAULT_INSTANCE_ID } from '../../interfaces'

import { GraphMessageType } from '../../types'
import { useVertexTable } from './tables'
import { Manager, SliceType, Message } from 'visual-analytics-components'

export function usePositionChanges(
	api: GraphRenderer | undefined,
	config: Configuration,
	manager: Manager,
): void {
	const vertexTable = useVertexTable(manager)
	useEffect(() => {
		if (api) {
			const subscription = manager.messages
				.pipe(
					filter(isPositionChange(config)),
					throttleTime(50, undefined, { trailing: true }),
				)
				.subscribe(() => {
					const newPositions: PositionMap = {}
					const slice = vertexTable.slice(SliceType.All)
					for (let i = 0; i < slice.length(); ++i) {
						const row = slice.get(i)!
						newPositions[row.id] = { x: row.x, y: row.y, z: row.z }
					}
					api.changePositions(newPositions)
				})

			return (): void => subscription.unsubscribe()
		}
	}, [api, config, manager, vertexTable])
}

const isPositionChange = (config: Configuration) => (
	evt: Message<any>,
): boolean =>
	evt.type === GraphMessageType.PositionsChanged &&
	evt.payload.instanceId === (config.instanceId || DEFAULT_INSTANCE_ID)
