/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export function chunkRequest<T>(
	maxRequestSize: number,
	payload: T[],
	size?: number,
): T[][] {
	const payloadSize = size || JSON.stringify(payload).length
	const iterations = Math.round(payloadSize / maxRequestSize) + 1
	const paritions: T[][] = []
	const indexInterval = Math.round(payload.length / iterations)
	for (let i = 0; i <= iterations; i++) {
		const partitionValues = payload.slice(
			indexInterval * i,
			indexInterval * (i + 1),
		)
		if (partitionValues.length > 0) {
			paritions.push(partitionValues)
		}
	}
	return paritions
}
