/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	GraphComponent,
	Configuration,
} from '@visual-analytics-components/graph-component'
import { ManagerContext } from '@visual-analytics-components/react'
import React, { memo, useContext } from 'react'
import { DataMapping } from 'visual-analytics-components'
import { Component } from '../common'

export const TopPane: React.FC = memo(function TopPane() {
	const manager = useContext(ManagerContext)
	return (
		<Component>
			<GraphComponent configuration={GRAPH_CONFIG} manager={manager} />
		</Component>
	)
})

const mapping: DataMapping = {
	vertices: {
		fields: {
			category: 'community',
		},
	},
}

const GRAPH_CONFIG: Configuration = {
	instanceId: 'graph',
	isLayoutSupported: true,
	dataMapping: mapping,
}
