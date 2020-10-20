/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import React, { memo } from 'react'
import { Component } from '../common'
import {
	GraphComponent,
	Configuration,
} from '@visual-analytics-components/graph-component'
import { DataMapping } from 'visual-analytics-components'

export const TopPane: React.FC = memo(function TopPane() {
	return (
		<Component>
			<GraphComponent configuration={GRAPH_CONFIG} />
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
