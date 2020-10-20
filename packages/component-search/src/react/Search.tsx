/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { debounce } from 'lodash'
import * as React from 'react'
import { memo, useCallback, useMemo } from 'react'
import { Configuration } from '../interfaces'
import { GlobalStyles } from './GlobalStyles'
import { Manager, MessageCreators } from 'visual-analytics-components'

interface SearchProps {
	manager: Manager
	configuration: Configuration
}

const DEFAULT_PLACEHOLDER = ''
const DEFAULT_TITLE = 'Search'
const DEFAULT_WAIT = 150

export const Search: React.FC<SearchProps> = memo(function Search({
	manager,
	configuration: {
		scope,
		placeholder = DEFAULT_PLACEHOLDER,
		title = DEFAULT_TITLE,
		wait = DEFAULT_WAIT,
	},
}) {
	const emitSearchEvent = useMemo(() => {
		return debounce((term: string) => {
			if (term) {
				manager.publish(
					MessageCreators.Search.execute(term, scope, `Search for '${term}'`),
				)
			} else {
				manager.publish(MessageCreators.Search.execute(term, scope, `Clear Search`))
			}
		}, wait)
	}, [manager, scope, wait])
	const onSearchChange = useCallback(
		(evt: React.ChangeEvent<HTMLInputElement>) =>
			emitSearchEvent(evt.target.value),
		[emitSearchEvent],
	)
	return (
		<>
			<GlobalStyles />
			<input
				className="search-box"
				aria-label={`Search box, ${title}`}
				placeholder={placeholder}
				title={title}
				onChange={onSearchChange}
			></input>
		</>
	)
})
