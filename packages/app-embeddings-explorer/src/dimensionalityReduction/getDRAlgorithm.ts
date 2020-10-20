/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { PcaAlgorithm } from './PcaAlgorithm'
import { TsneAlgorithm } from './TsneAlgorithm'
import { UmapAlgorithm } from './UmapAlgorithm'
import { DimensionalityReduction, DRAlgorithm } from './types'
import { Manager } from 'visual-analytics-components'
type ManagerId = string

const DR_CACHE: Record<
	ManagerId,
	Record<DimensionalityReduction, DRAlgorithm<any, any>>
> = {}

export function getDRAlgorithm(
	technique: DimensionalityReduction,
	manager: Manager | undefined,
): DRAlgorithm<any, any> | undefined {
	if (!manager) {
		return undefined
	}
	if (!DR_CACHE[manager.id]) {
		DR_CACHE[manager.id] = {
			[DimensionalityReduction.PCA]: new PcaAlgorithm(manager),
			[DimensionalityReduction.UMAP]: new UmapAlgorithm(manager),
			[DimensionalityReduction.TSNE]: new TsneAlgorithm(manager),
		}
	}

	return DR_CACHE[manager.id][technique]!
}
