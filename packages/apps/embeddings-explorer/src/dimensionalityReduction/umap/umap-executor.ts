/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { UMAP, UMAPParameters } from 'umap-js'

export class UmapExecutor {
	private _canceled = false
	private _umap: UMAP

	public constructor(config: UMAPParameters) {
		this._umap = new UMAP(config)
	}

	public cancel(): void {
		this._canceled = true
	}

	public async execute(
		data: number[][],
		onProgress: (epochNumber: number) => void,
	): Promise<number[][]> {
		return this._umap.fitAsync(data, (epochNumber: number) => {
			onProgress(epochNumber)
			if (this._canceled) {
				return false
			}
		})
	}

	public get embedding(): number[][] {
		return this._umap.getEmbedding()
	}
}
