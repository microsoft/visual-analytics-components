/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { GraphContainer } from '@graspologic/graph'
import { useMemo } from 'react'
import { readDataset } from '../../data/readDataset'
import { Manager } from 'visual-analytics-components'

export function useGraphData(manager: Manager, is3D: boolean): GraphContainer {
	return useMemo(() => readDataset(manager.data, is3D), [is3D, manager.data])
}
