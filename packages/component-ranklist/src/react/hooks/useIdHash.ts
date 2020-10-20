/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useMemo } from 'react'

/**
 * Gets a hash of items by their id
 * @param input An input array of items
 */
export function useIdHash<T extends { id: string }>(
	input: T[],
): Record<string, T> {
	return useMemo(() => {
		const result: Record<string, T> = {}
		input.forEach(item => (result[item.id] = item))
		return result
	}, [input])
}
