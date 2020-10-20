/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DimensionalityReduction } from '../../../dimensionalityReduction'
import { DataMapping } from 'visual-analytics-components'

export function getMapping(
	technique: DimensionalityReduction,
	xIndex: number,
	yIndex: number,
	zIndex: number,
): DataMapping {
	const techniqueField = TECHNIQUE_FIELDS[technique]
	return {
		vertices: {
			fields: {
				category: 'community',
				x: `${techniqueField}[${xIndex}]`,
				y: `${techniqueField}[${yIndex}]`,
				z: `${techniqueField}[${zIndex}]`,
			},
		},
	}
}

const TECHNIQUE_FIELDS: Record<DimensionalityReduction, string> = {
	[DimensionalityReduction.PCA]: 'embeddings_pca',
	[DimensionalityReduction.UMAP]: 'embeddings_umap',
	[DimensionalityReduction.TSNE]: 'embeddings_tsne',
}
