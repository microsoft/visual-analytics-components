/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

/**
 * A predicate interface for input types
 */
export type Predicate<T> = (input: T) => boolean

/**
 * A generic event handling type
 */
export type Handler<T> = (input: T) => void

export const NO_OP = () => {
	/* do nothing */
}
