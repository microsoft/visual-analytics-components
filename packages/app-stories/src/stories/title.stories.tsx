/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { storiesOf } from '@storybook/react'
import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import { createManager, lesMisDataset } from '../util'
import { ManagerContext } from '@visual-analytics-components/react'
import { TitleComponent } from '@visual-analytics-components/title-component'

storiesOf('Title Component', module).add('basic example', () => {
	const manager = createManager(lesMisDataset())
	const [text, setText] = useState('')
	return (
		<Frame>
			<ManagerContext.Provider value={manager}>
				<h4>The title component displays descriptions from events</h4>
				<TitleComponent style={styles.searchComponent} />
				<br />
				<h4>
					Use the textbox below to create a description for an event, and click
					&lquo;publish&rsquo; to emit it
				</h4>
				<textarea
					style={styles.textArea}
					onChange={useCallback(arg => setText(arg.target.value), [])}
				/>
				<button
					onClick={useCallback(
						() => manager.publish({ type: '__TEST_SENTINEL', description: text }),
						[manager, text],
					)}
				>
					publish
				</button>
			</ManagerContext.Provider>
		</Frame>
	)
})

const Frame = styled.div`
	width: 1024px;
	height: 768px;
`

const styles: Record<string, React.CSSProperties> = {
	searchComponent: {
		height: 50,
		border: '1px solid grey',
		borderRadius: 5,
	},
	textArea: {
		border: '1px solid grey',
		height: 150,
		width: '100%',
		marginTop: 10,
	},
}
