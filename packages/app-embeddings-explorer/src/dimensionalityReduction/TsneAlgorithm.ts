/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable import/no-webpack-loader-syntax */
import { BaseDRAlgorithm } from './BaseDRAlgorithm'
import { TsneMessageType } from './tsne/types'
import { DimensionalityReduction, TsneConfig, TsneResult } from './types'
/* eslint-disable @typescript-eslint/ban-ts-comment, import/no-unresolved */
// @ts-ignore
import TsneWorker from '!!worker-loader!./tsne/tsne-worker'
import { Message } from 'visual-analytics-components'
/* eslint-enable @typescript-eslint/ban-ts-comment, import/no-unresolved */

const DEFAULT_TSNE_CONFIG: TsneConfig = {
	dim: 3,
	perplexity: 10.0,
	earlyExaggeration: 4.0,
	learningRate: 100.0,
	nIter: 200,
	metric: 'euclidean',
}

export class TsneAlgorithm extends BaseDRAlgorithm<TsneConfig, TsneResult> {
	public readonly type = DimensionalityReduction.TSNE
	private _config: TsneConfig = DEFAULT_TSNE_CONFIG
	private _pendingResult: Promise<TsneResult> | undefined
	private readonly _worker: Worker = new TsneWorker() as Worker
	public readonly emptyRow = (): number[] => [0, 0, 0]
	public readonly resultField = 'embeddings_tsne'

	public configure(config: Partial<TsneConfig>): void {
		Object.assign(this._config, config)
	}

	public stop(): void {
		// can't stop won't stop
	}

	public start(): Promise<TsneResult> {
		if (this.result) {
			return Promise.resolve(this.result)
		} else if (this._pendingResult) {
			return this._pendingResult
		} else {
			const executionPromise = new Promise<TsneResult>((resolve, reject) => {
				const handlWorkerError: EventListener = (err: any) => {
					clearWorkerListeners()
					reject(err)
				}
				const handleWorkerMessage = (evt: MessageEvent): void => {
					if (evt.data.type === TsneMessageType.Progress) {
						const embeddings = evt.data.payload.embedding
						console.log('Progress', evt.data.payload.iteration)
						this.packEmbeddings(embeddings)
						this.onProgress.next({ embeddings })
					} else if (evt.data.type === TsneMessageType.Complete) {
						clearWorkerListeners()
						const embeddings = evt.data.payload.embedding
						console.log('Complete')
						const result: TsneResult = { embeddings }

						// set the final result
						this.packEmbeddings(embeddings)
						this.onResultChanged.next(result)

						// clear out the pending promise
						this._pendingResult = undefined

						resolve(result)
					}
				}

				const clearWorkerListeners = (): void => {
					this._worker.removeEventListener('error', handlWorkerError)
					this._worker.removeEventListener('message', handleWorkerMessage)
				}

				this._worker.addEventListener('error', handlWorkerError)
				this._worker.addEventListener('message', handleWorkerMessage)
				this._worker.postMessage(msgExecute(this.rawEmbeddings))
			})
			this._pendingResult = executionPromise
			return executionPromise
		}
	}
}

const msgExecute = (data: number[][]): Message<{ data: number[][] }> => ({
	type: TsneMessageType.Execute,
	payload: { data },
})
