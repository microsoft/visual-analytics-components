/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Theme } from '@thematic/core'
import { useMemo } from 'react'
import { ManagerImpl, Manager } from 'visual-analytics-components'
import { createDataset } from '../createDataset'
import { Graph } from '../interfaces'

export function useManager(
	data: Graph | undefined,
	theme: Theme,
): Manager | undefined {
	return useMemo(() => {
		if (!data) {
			return undefined
		}
		const dataset = createDataset(data)
		return ManagerImpl.createInstance(dataset, theme as any)
	}, [data, theme])
}
