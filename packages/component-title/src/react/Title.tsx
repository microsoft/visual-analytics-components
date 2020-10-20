/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import * as React from 'react'
import { memo } from 'react'
import { Configuration } from '../interfaces'
import { GlobalStyles } from './GlobalStyles'
import { useLatestInteractionTitle } from './useLatestInteractionTitle'
import { Manager } from 'visual-analytics-components'

export interface TitleProps {
	configuration: Configuration
	manager: Manager
}

const DEFAULT_TITLE = ''
const DEFAULT_CONFIGURATION: Configuration = {
	title: DEFAULT_TITLE,
}

export const Title: React.FC<TitleProps> = memo(function Title({
	configuration = DEFAULT_CONFIGURATION,
	manager,
}) {
	const currentTitle = useLatestInteractionTitle(
		manager,
		configuration.title || DEFAULT_TITLE,
	)
	return (
		<>
			<GlobalStyles config={configuration} />
			<div className="title">{currentTitle}</div>
		</>
	)
})
