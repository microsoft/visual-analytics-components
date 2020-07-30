/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export class MappedIterator<S, T> implements Iterator<T> {
	public constructor(
		private source: Iterator<S>,
		private transform: (input: S) => T,
	) {}

	public next(): IteratorResult<T> {
		const { value, done } = this.source.next()
		const transformedValue = this.transform(value)
		return {
			value: transformedValue,
			done,
		}
	}
}
