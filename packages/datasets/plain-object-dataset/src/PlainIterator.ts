/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export class PlainIterator<S> implements Iterator<S> {
	private index = 0
	public constructor(private items: S[]) {}

	public next(): IteratorResult<S> {
		const value = this.items[this.index++]
		return {
			value,
			done: !(this.index < this.items.length),
		}
	}
}
