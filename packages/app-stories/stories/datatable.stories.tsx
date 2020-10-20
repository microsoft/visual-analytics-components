/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { storiesOf } from '@storybook/react'
import React from 'react'
import styled from 'styled-components'
import { createManager, lesMisDataset } from './util'
import { DatatableComponent } from '@visual-analytics-components/datatable-component'
import { ManagerContext } from '@visual-analytics-components/react'

storiesOf('Datatable Component', module).add('basic example', () => {
	return (
		<Frame>
			<ManagerContext.Provider value={createManager(lesMisDataset())}>
				<DatatableComponent />
			</ManagerContext.Provider>
		</Frame>
	)
})

const Frame = styled.div`
	width: 1024px;
	height: 768px;
`
