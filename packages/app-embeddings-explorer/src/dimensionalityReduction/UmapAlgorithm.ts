/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable import/no-webpack-loader-syntax */
import { Message } from 'visual-analytics-components'
import { BaseDRAlgorithm } from './BaseDRAlgorithm'
import { DimensionalityReduction, UmapResult, UmapOptions } from './types'
import { UmapMessageType } from './umap/types'
/* eslint-disable @typescript-eslint/ban-ts-comment, import/no-unresolved */
// @ts-ignore
import UmapWorker from '!!worker-loader!./umap/umap-worker'
/* eslint-enable @typescript-eslint/ban-ts-comment, import/no-unresolved */

export class UmapAlgorithm extends BaseDRAlgorithm<UmapOptions, UmapResult> {
	public readonly type = DimensionalityReduction.UMAP
	private _pendingResult: Promise<UmapResult> | undefined
	protected readonly emptyRow = (): number[] => [0, 0, 0]
	protected readonly resultField = 'embeddings_umap'
	private readonly _worker: Worker = new UmapWorker() as Worker

	public configure(config: Partial<UmapOptions>): void {
		this._worker.postMessage(msgConfigure(config))
	}

	public stop(): void {
		this._worker.postMessage(msgCancel())
	}

	public start(): Promise<UmapResult> {
		if (this.result) {
			return Promise.resolve(this.result)
		} else if (this._pendingResult) {
			return this._pendingResult
		} else {
			const executionPromise = new Promise<UmapResult>((resolve, reject) => {
				const handlWorkerError: EventListener = (err: any) => {
					clearWorkerListeners()
					reject(err)
				}
				const handleWorkerMessage = (evt: MessageEvent): void => {
					if (evt.data.type === UmapMessageType.Progress) {
						const embeddings = evt.data.payload.embedding
						console.log('Progress', evt.data.payload.epochNumber)
						this.packEmbeddings(embeddings)
						this.onProgress.next({ embeddings })
					} else if (evt.data.type === UmapMessageType.Complete) {
						clearWorkerListeners()
						const embeddings = evt.data.payload.embedding
						console.log('Complete')
						const result: UmapResult = { embeddings }

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
	type: UmapMessageType.Execute,
	payload: { data },
})

const msgCancel = (): Message<void> => ({
	type: UmapMessageType.Cancel,
})

const msgConfigure = (
	payload: Partial<UmapOptions>,
): Message<Partial<UmapOptions>> => ({
	type: UmapMessageType.Configure,
	payload,
})
