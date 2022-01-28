/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable no-restricted-globals */
import { TsneConfig } from '../types'
import { TsneExecutor } from './tsne-executor'
import { TsneMessageType } from './types'

self.console.log('loading tsne worker')

const config: TsneConfig = {
	dim: 3,
	perplexity: 10.0,
	earlyExaggeration: 4.0,
	learningRate: 100.0,
	nIter: 200,
	metric: 'euclidean',
}
let executor: TsneExecutor | undefined

self.onmessage = (evt: MessageEvent): void => {
	const { type, payload } = evt.data
	self.console.log(`umap received ${type}`)

	switch (type) {
		case TsneMessageType.Configure: {
			Object.assign(config, payload)
			self.console.log('Recive config', payload, config)
			break
		}
		case TsneMessageType.Execute: {
			executor = new TsneExecutor(config)
			executor
				.execute(payload.data, iteration =>
					sendProgress(iteration, executor!.embedding, executor!.status),
				)
				.then(embedding => sendComplete(embedding))
				.catch(err => sendError(err))
			break
		}
		case TsneMessageType.Cancel: {
			if (executor) {
				executor.cancel()
			}
			break
		}
	}
}

const sendProgress = (
	iteration: number,
	embedding: number[][],
	status: string,
): void => {
	(self as any).postMessage({
		type: TsneMessageType.Progress,
		payload: {
			iteration,
			status,
			embedding,
		},
	})
}

const sendComplete = (embedding: number[][]): void => {
	(self as any).postMessage({
		type: TsneMessageType.Complete,
		payload: {
			embedding,
		},
	})
}

const sendError = (error: any): void => {
	(self as any).postMessage({
		type: TsneMessageType.Error,
		payload: {
			error,
		},
	})
}
