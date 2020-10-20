/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Subject } from 'rxjs'
import { Vertex } from '../interfaces'
import { EmbeddingVector, DRAlgorithm, DimensionalityReduction } from './types'
import { GraphMessageType } from '@visual-analytics-components/graph-component'
import { Manager, SliceType, TableSlice } from 'visual-analytics-components'

interface VectorizedEmbeddings {
	embeddings: EmbeddingVector
	rowIndices: Record<string, number>
}

/**
 * A static cache of vectorized embeddings per DVManager
 */
const vectorizedEmbeddings: Record<string, VectorizedEmbeddings> = {}

function getVectorizedEmbeddings(
	vertices: TableSlice<Vertex>,
): VectorizedEmbeddings {
	const result: number[][] = []
	const idIndices: Record<string, number> = {}
	for (let i = 0; i < vertices.length(); ++i) {
		const row = vertices.get(i)
		if (row?.embeddings) {
			result.push(row.embeddings)
			idIndices[row.id] = result.length - 1
		}
	}

	return { embeddings: result, rowIndices: idIndices }
}

export abstract class BaseDRAlgorithm<Config, Result>
	implements DRAlgorithm<Config, Result> {
	private _result: Result | undefined = undefined

	public constructor(private readonly _manager: Manager) {
		if (!vectorizedEmbeddings[_manager.id]) {
			vectorizedEmbeddings[_manager.id] = getVectorizedEmbeddings(this.vertexSlice)
		}
	}

	public readonly onProgress = new Subject<any>()
	public readonly onResultChanged = new Subject<Result>()

	public get result(): Result | undefined {
		return this._result
	}

	protected setResult(r: Result): Result {
		this._result = r
		this.onResultChanged.next(r)
		return r
	}

	protected get rowIndices(): Record<string, number> {
		return vectorizedEmbeddings[this.manager.id].rowIndices
	}

	protected get rawEmbeddings(): EmbeddingVector {
		return vectorizedEmbeddings[this.manager.id].embeddings
	}

	protected get manager(): Manager {
		return this._manager
	}

	protected get vertexSlice(): TableSlice<Vertex> {
		return this._manager.data.table<Vertex>('vertices').slice(SliceType.All)
	}

	protected get hasEmbeddings(): boolean {
		const firstRow = this.vertexSlice.get(0)
		return firstRow && firstRow.embeddings
	}

	/**
	 * Packs the embedding result into DV data storage
	 *
	 * @param embedding The embedding result data
	 */
	protected packEmbeddings(embedding: EmbeddingVector): void {
		const rowIndices = this.rowIndices
		const field = this.resultField
		const vertices = this.vertexSlice
		for (let i = 0; i < vertices.length(); ++i) {
			const row = vertices.get(i) as any
			const rowIdx = rowIndices[row.id]
			row[field] = rowIdx != null ? embedding[rowIdx] : this.emptyRow()
		}
		this.manager.publish({
			type: GraphMessageType.PositionsChanged,
			payload: {
				instanceId: `embeddings_${this.type}`,
			},
		})
	}

	/**
	 * The result field on the DV Rows where data should be loaded
	 */
	protected abstract get resultField(): string

	/**
	 * Gets an empty embedding row
	 */
	protected abstract emptyRow(): number[]

	/**
	 * The DR Type
	 */
	public abstract get type(): DimensionalityReduction

	/**
	 * Configures the DR algorithm
	 * @param conf The configuration to apply
	 */
	public abstract configure(conf: Partial<Config>): void

	/**
	 * Executes the dimensionality reduction. The rows are augmented by
	 * setting their <resultField> attribute, and the overall result object is returned.
	 */
	public abstract start(): Promise<Result>

	/**
	 * Halts an in-progress execution
	 */
	public abstract stop(): void
}
