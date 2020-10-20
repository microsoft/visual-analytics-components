/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export interface HasEmbeddings {
	embeddings: number[]
}

export function euclideanDistance(
	a: HasEmbeddings,
	b: HasEmbeddings,
): number | undefined {
	if (!a.embeddings || !b.embeddings) {
		return undefined
	}

	const src = a.embeddings
	const tgt = b.embeddings
	const diffs = tgt.map((val, idx) => Math.pow(val - src[idx], 2))
	const diffSum = diffs.reduce((prev, curr) => prev + curr, 0)
	return Math.sqrt(diffSum)
}

export function cosineSimilarity(
	a: HasEmbeddings,
	b: HasEmbeddings,
): number | undefined {
	if (!a.embeddings || !b.embeddings) {
		return undefined
	}

	const src = a.embeddings
	const tgt = b.embeddings
	return similarity(src, tgt)
}

function dotproduct(a: number[], b: number[]): number {
	let n = 0
	const lim = Math.min(a.length, b.length)
	for (let i = 0; i < lim; i++) n += a[i] * b[i]
	return n
}

function norm2(a: number[]): number {
	let sumsqr = 0
	for (let i = 0; i < a.length; i++) sumsqr += a[i] * a[i]
	return Math.sqrt(sumsqr)
}

function similarity(a: number[], b: number[]): number {
	return dotproduct(a, b) / norm2(a) / norm2(b)
}
