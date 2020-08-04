/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { storiesOf } from '@storybook/react'
import { GraphComponent } from '@visual-analytics-components/graph-component'
import { ManagerContext } from '@visual-analytics-components/react'
import React from 'react'
import styled from 'styled-components'
import { createManager, lesMisDataset, wpagenDataset } from '../util'

storiesOf('Graph Component', module)
	.add('lesmis example', () => {
		const ds = lesMisDataset()
		console.log('LesMis DS', ds)
		return (
			<Frame>
				<ManagerContext.Provider value={createManager(ds)}>
					<GraphComponent
						configuration={{
							dataMapping: {
								vertices: {
									table: 'nodes',
								},
							},
						}}
					/>
				</ManagerContext.Provider>
			</Frame>
		)
	})
	.add('wpagen example', () => {
		const ds = wpagenDataset()
		console.log('WPAGen DS', ds)
		return (
			<Frame>
				<ManagerContext.Provider value={createManager(ds)}>
					<GraphComponent
						configuration={{
							dataMapping: {
								vertices: {
									table: 'nodes',
								},
							},
						}}
					/>
				</ManagerContext.Provider>
			</Frame>
		)
	})

const Frame = styled.div`
	width: 1024px;
	height: 768px;
`
