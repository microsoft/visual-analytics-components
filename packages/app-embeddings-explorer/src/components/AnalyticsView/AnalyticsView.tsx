/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import React, { memo } from 'react'
import { Graph } from '../../interfaces'
import { VacPane } from './VacPane'

export interface AnalyticsViewProps {
	data: Graph
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = memo(
	function AnalyticsView({ data }) {
		return <VacPane data={data} />
	},
)
