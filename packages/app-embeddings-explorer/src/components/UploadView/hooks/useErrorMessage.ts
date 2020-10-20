/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useState, useCallback } from 'react'

/**
 * Encapsulates state for using Error Messages
 */
export function useErrorMessage(): [
	string | undefined,
	(errorMessage: string | undefined) => void,
	() => void,
	(err: Error) => void,
] {
	const [message, setMessage] = useState<string | undefined>()
	const clearMessage = useCallback(() => setMessage(undefined), [setMessage])
	const onError = useCallback((err: Error) => setMessage(err.message), [
		setMessage,
	])
	return [message, setMessage, clearMessage, onError]
}
