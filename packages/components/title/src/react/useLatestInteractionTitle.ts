/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useState, useEffect } from 'react'
import { Manager } from 'visual-analytics-components'

export function useLatestInteractionTitle(
	manager: Manager,
	initialValue: string,
): string {
	const [currentTitle, setCurrentTitle] = useState(initialValue)
	useEffect(() => {
		const subscription = manager.messages.subscribe(() => {
			setCurrentTitle(manager.getInteractionLog().getLastEntry() || '')
		})
		return (): void => subscription.unsubscribe()
	})
	return currentTitle
}
