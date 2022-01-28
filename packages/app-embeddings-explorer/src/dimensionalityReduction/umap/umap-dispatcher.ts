/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable no-restricted-globals */
import { UMAPParameters } from 'umap-js'
import { UmapMessageType } from './types'
import { UmapExecutor } from './umap-executor'

self.console.log('loading umap worker')

const config: UMAPParameters = { nComponents: 3 }
let executor: UmapExecutor | undefined
self.onmessage = (evt: MessageEvent): void => {
	const { type, payload } = evt.data
	self.console.log(`umap received ${type}`)

	switch (type) {
		case UmapMessageType.Configure: {
			Object.assign(config, payload)
			self.console.log('Recive config', payload, config)
			break
		}
		case UmapMessageType.Execute: {
			try {
				self.console.log('execute umap with config', config)
				executor = new UmapExecutor(config)
				executor
					.execute(payload.data, epochNumber => {
						sendProgress(epochNumber, executor!.embedding)
					})
					.then(embedding => sendComplete(embedding))
					.catch(err => sendError(err))
			} catch (err) {
				self.console.log('caught err', err)
				throw err
			}
			break
		}
		case UmapMessageType.Cancel: {
			if (executor) {
				executor.cancel()
			}
			break
		}
	}
}

const sendProgress = (epochNumber: number, embedding: number[][]): void => {
	(self as any).postMessage({
		type: UmapMessageType.Progress,
		payload: {
			epochNumber,
			embedding,
		},
	})
}

const sendComplete = (embedding: number[][]): void => {
	(self as any).postMessage({
		type: UmapMessageType.Complete,
		payload: {
			embedding,
		},
	})
}

const sendError = (error: any): void => {
	self.console.log('worker caught error', error)
	;(self as any).postMessage({
		type: UmapMessageType.Error,
		payload: {
			error,
		},
	})
}
