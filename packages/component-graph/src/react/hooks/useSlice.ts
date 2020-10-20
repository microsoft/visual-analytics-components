/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useMemo } from 'react'
import { Vertex } from '../../interfaces'
import { Manager, SliceType, TableSlice } from 'visual-analytics-components'

export function useSlice(
	manager: Manager | undefined,
	slice: SliceType,
): TableSlice<Vertex> | undefined {
	return useMemo(() => {
		if (manager) {
			const table = manager.data.table<Vertex>('vertices')
			if (table) {
				return table.slice(slice)
			}
		}
		return undefined
	}, [manager, slice])
}
