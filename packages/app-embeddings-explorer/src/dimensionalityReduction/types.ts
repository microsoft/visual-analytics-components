/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Observable } from 'rxjs'

export interface DimensionVariance {
	index: number
	variance: number
}

export enum DimensionalityReduction {
	PCA = 'pca',
	UMAP = 'umap',
	TSNE = 'tsne',
}
export type EmbeddingVector = number[][]

export interface DRAlgorithm<Config, Result> {
	readonly type: DimensionalityReduction
	/**
	 * Configures the DR algorithm
	 * @param conf The configuration to apply
	 */
	configure(conf: Partial<Config>): void

	/**
	 * Event stream for progress messages
	 * @param listener The progress listener
	 */
	onProgress: Observable<any>

	/**
	 * Event stream for results being ready
	 */
	onResultChanged: Observable<any>

	/**
	 * Executes the dimensionality reduction. The rows are augmented by
	 * setting their <resultField> attribute, and the overall result object is returned.
	 */
	start(): Promise<Result>

	/**
	 * Halts an in-progress execution
	 */
	stop(): void

	/**
	 * Gets the current result
	 */
	readonly result: Result | undefined
}

export interface TsneConfig {
	dim: number
	perplexity: number
	earlyExaggeration: number
	learningRate: number
	nIter: number
	metric: 'euclidean' | 'manhattan'
}

export interface UmapOptions {
	nEpochs: number
	nComponents: number
	nNeighbors: number
	minDist: number
	spread: number
	distanceFn: 'euclidean' | 'manhattan'
}
export interface UmapResult {
	embeddings: EmbeddingVector
}

export interface TsneResult {
	embeddings: EmbeddingVector
}
