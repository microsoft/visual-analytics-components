/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { GraphContainer } from '@topologic/graph'
import { useMemo } from 'react'
import { Manager } from 'visual-analytics-components'
import { readDataset } from '../../data/readDataset'

export function useGraphData(manager: Manager, is3D: boolean): GraphContainer {
	return useMemo(() => readDataset(manager.data, is3D), [is3D, manager.data])
}
