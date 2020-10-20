/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { InputGraph } from '@graspologic/graph'

export function isLayoutRequired(data: InputGraph, threshold = 0.5): boolean {
	let numPositioned = 0
	data.nodes.forEach(n => {
		if (n.x && n.y) {
			numPositioned++
		}
	})

	return numPositioned / data.nodes.length < threshold
}
