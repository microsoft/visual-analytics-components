/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export type Procedure = any

export interface Options {
	isImmediate: boolean
}

export function debounce<F extends Procedure>(
	func: F,
	waitMilliseconds = 150,
	options: Options = {
		isImmediate: false,
	},
): F {
	let timeoutId: any

	return function (this: any, ...args: any[]) {
		const doLater = (): void => {
			timeoutId = undefined
			if (!options.isImmediate) {
				func.apply(this, args)
			}
		}

		const shouldCallNow = options.isImmediate && timeoutId === undefined

		if (timeoutId !== undefined) {
			clearTimeout(timeoutId)
		}

		timeoutId = setTimeout(doLater, waitMilliseconds)

		if (shouldCallNow) {
			func.apply(this, args)
		}
	} as any
}
