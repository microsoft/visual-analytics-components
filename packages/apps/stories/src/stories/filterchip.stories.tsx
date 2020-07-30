/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { storiesOf } from '@storybook/react'
import { FilterChipComponent } from '@visual-analytics-components/filterchip-component'
import { ManagerContext } from '@visual-analytics-components/react'
import React from 'react'
import styled from 'styled-components'
import { createManager, lesMisDataset } from '../util'

storiesOf('Filterchip Component', module).add('basic example', () => {
	return (
		<Frame>
			<ManagerContext.Provider value={createManager(lesMisDataset())}>
				<FilterChipComponent />
			</ManagerContext.Provider>
		</Frame>
	)
})

const Frame = styled.div`
	width: 1024px;
	height: 768px;
`
