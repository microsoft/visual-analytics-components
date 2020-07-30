/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import React, { useCallback, useMemo, useState } from 'react'
import { Graph } from './../interfaces'
import { AnalyticsView } from './AnalyticsView'
import { UploadView } from './UploadView'

const Application: React.FC = () => {
	const [graphData, setGraphData] = useState<Graph | undefined>(undefined)
	const handleGraphLoad = useCallback(graph => setGraphData(graph), [
		setGraphData,
	])

	const content = useMemo(
		() =>
			graphData ? (
				<AnalyticsView data={graphData} />
			) : (
				<UploadView onGraphLoaded={handleGraphLoad} />
			),
		[graphData, handleGraphLoad],
	)

	return <>{content}</>
}

export default Application
