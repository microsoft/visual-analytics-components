/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useMemo } from 'react'
import { Table, Manager } from 'visual-analytics-components'
import { Vertex } from '../../interfaces'

export function useVertexTable(manager: Manager): Table<Vertex> {
	return useMemo(() => manager.data.table<Vertex>('vertices'), [manager])
}

export function useEdgeTable(manager: Manager): Table<Vertex> {
	return useMemo(() => manager.data.table<Vertex>('edges'), [manager])
}
