/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { BaseDRAlgorithm } from './BaseDRAlgorithm'
import { DimensionVariance, DimensionalityReduction } from './types'
/* eslint-disable @typescript-eslint/no-var-requires */
const numeric = require('numericjs')

const NUM_PCA_COMPONENTS = 10

export class PcaAlgorithm extends BaseDRAlgorithm<void, DimensionVariance[]> {
	protected readonly resultField = 'embeddings_pca'
	public readonly type = DimensionalityReduction.PCA
	protected readonly emptyRow = (): number[] => [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

	public configure(): void {
		// not configurable
	}

	public stop(): void {
		// not async
	}

	public start(): Promise<DimensionVariance[]> {
		if (this.result) {
			return Promise.resolve(this.result)
		}
		const vectors = this.rawEmbeddings
		const scalar = numeric.dot(numeric.transpose(vectors), vectors)
		const sigma = numeric.div(scalar, vectors.length)
		const svd = numeric.svd(sigma)
		const variances: number[] = svd.S
		const totalVariance = variances.reduce((prev, curr) => prev + curr, 0)
		for (let i = 0; i < variances.length; ++i) {
			variances[i] = variances[i] / totalVariance
		}
		const pcaVectors = vectors.map(vector => {
			const newV = new Float32Array(NUM_PCA_COMPONENTS)
			for (let newDim = 0; newDim < NUM_PCA_COMPONENTS; newDim++) {
				let dot = 0
				for (let oldDim = 0; oldDim < vector.length; oldDim++) {
					dot += vector[oldDim] * svd.U[oldDim][newDim]
				}
				newV[newDim] = dot
			}
			return newV
		})

		this.packEmbeddings(pcaVectors as any)
		const result = variances
			.slice(0, NUM_PCA_COMPONENTS)
			.map((variance, index) => ({ variance, index }))
		this.setResult(result)
		return Promise.resolve(result)
	}
}
