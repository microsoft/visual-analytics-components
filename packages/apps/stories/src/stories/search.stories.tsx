/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { storiesOf } from '@storybook/react'
import { ManagerContext } from '@visual-analytics-components/react'
import { SearchComponent } from '@visual-analytics-components/search-component'
import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { createManager, lesMisDataset } from '../util'

storiesOf('Search Component', module).add('basic example', () => {
	const manager = createManager(lesMisDataset())
	const [text, setText] = useState('')
	useEffect(() => {
		const subscription = manager.messages.subscribe(evt =>
			setText(JSON.stringify(evt, null, 4).replace('\n', '<br />')),
		)
		return (): void => subscription.unsubscribe()
	}, [manager])
	return (
		<Frame>
			<ManagerContext.Provider value={manager}>
				<SearchComponent style={styles.searchComponent} />
				<Result dangerouslySetInnerHTML={{ __html: text }} />
			</ManagerContext.Provider>
		</Frame>
	)
})

const Frame = styled.div`
	width: 1024px;
	height: 768px;
`
const Result = styled.div`
	margin-top: 10px;
`

const styles: Record<string, React.CSSProperties> = {
	searchComponent: {
		height: 50,
	},
	textArea: {
		border: '1px solid grey',
		height: 150,
		width: '100%',
		marginTop: 10,
	},
}
