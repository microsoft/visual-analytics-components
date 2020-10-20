/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useState, useEffect } from 'react'
import { filter } from 'rxjs/operators'
import {
	Manager,
	Message,
	ExecuteSearchMessagePayload,
} from 'visual-analytics-components'

/**
 * Uses a search term from the Manager
 * @param manager The Manager
 * @param isSearchEvent The predicate function to determine if events are search events for this visual
 */
export function useSearchTerm(
	manager: Manager,
	isSearchEvent: (evt: Message<any>) => boolean,
): string | undefined {
	const [searchTerm, setSearchTerm] = useState<string | undefined>(undefined)
	useEffect(() => {
		const subscription = manager.messages
			.pipe(filter(isSearchEvent))
			.subscribe((evt: Message<any>) => {
				const searchEvent = evt as Message<ExecuteSearchMessagePayload>
				if (!searchEvent.payload) {
					setSearchTerm(undefined)
				} else {
					setSearchTerm(searchEvent.payload.value.toLowerCase())
				}
			})
		return (): void => subscription.unsubscribe()
	}, [manager, isSearchEvent])
	return searchTerm
}
