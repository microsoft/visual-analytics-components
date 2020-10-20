/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useCallback, useState } from 'react'

/**
 * A hook for using state mutated by a ChangeEvent
 */
export function useInputValue(): [string | undefined, (...evt: any) => void] {
	const [value, setValue] = useState<string | undefined>()
	const changeHandler = useCallback(
		(val: string) => {
			setValue(val)
		},
		[setValue],
	)
	return [value, changeHandler]
}
