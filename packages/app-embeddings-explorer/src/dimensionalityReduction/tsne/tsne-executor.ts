/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import TSNE from 'tsne-js'
import { EmbeddingVector, TsneConfig } from '../types'

export class TsneExecutor {
	private _canceled = false
	private _algo: any
	private _embedding!: EmbeddingVector
	private _status = 'Initialization'

	public constructor(config: TsneConfig) {
		this._algo = new TSNE(config)
	}

	public cancel(): void {
		this._canceled = true
	}

	public async execute(
		data: number[][],
		onProgress: (epochNumber: number) => void,
	): Promise<number[][]> {
		this._embedding = data
		let iter = 0
		this._algo.init({ data, type: 'dense' })

		this._algo.on('progressStatus', (status: string) => (this._status = status))
		this._algo.on('progressIter', ([iteration]: number[]) => (iter = iteration))
		this._algo.on('progressData', (embedding: EmbeddingVector) => {
			this._embedding = embedding
			onProgress(iter)
		})
		return new Promise<EmbeddingVector>(resolve => {
			this._algo.run()
			resolve(this._algo.getOutput())
		})
	}

	public get status(): string {
		return this._status
	}

	public get embedding(): number[][] {
		return this._embedding
	}
}
