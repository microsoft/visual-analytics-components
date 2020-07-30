/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useMemo } from 'react'

export function useErrorOrInfoMessage(
	errorMessage: string | undefined,
	infoMessage: string | undefined,
): [string | undefined, 'error' | 'info'] {
	const info = useMemo(() => {
		return errorMessage ? errorMessage : infoMessage
	}, [errorMessage, infoMessage])

	const msgClass = useMemo(() => (errorMessage ? 'error' : 'info'), [
		errorMessage,
	])
	return [info, msgClass]
}
