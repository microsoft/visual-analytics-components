/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useThematic } from '@thematic/react'
import { ManagerContext } from '@visual-analytics-components/react'
import React, { memo, useEffect, useState, useCallback } from 'react'
import styled from 'styled-components'
import { useManager } from '../../hooks/useManager'
import { useRankListConfiguration } from '../../hooks/useRankListConfiguration'
import { Graph } from '../../interfaces'
import { GraphPane } from './GraphPane'
/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
// @ts-ignore
import { Sidebar } from './Sidebar'
import { TitleBar } from './TitleBar'

export interface AnalyticsViewProps {
	data: Graph
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = memo(
	function AnalyticsView({ data }) {
		const theme = useThematic()
		const manager = useManager(data, theme)
		const hasEmbeddings = Boolean(data.hasEmbeddings)
		const vertexListConfiguration = useRankListConfiguration(hasEmbeddings)

		// Initialize Ranking Classes
		useEffect(() => {
			if (manager && vertexListConfiguration.rankings) {
				vertexListConfiguration.rankings.forEach(r => r.initialize(manager))
			}
		}, [manager, vertexListConfiguration.rankings])

		const [isTopOpen, setTopOpen] = useState(true)
		const [isBottomOpen, setBottomOpen] = useState(true)
		const onToggleTop = useCallback(
			(expanded: boolean) => setTopOpen(expanded),
			[setTopOpen],
		)
		const onToggleBottom = useCallback(
			(expanded: boolean) => setBottomOpen(expanded),
			[setBottomOpen],
		)
		return manager ? (
			<ManagerContext.Provider value={manager}>
				<AnalyticsArea>
					<GraphColumn>
						<TitleBar
							isTopOpen={isTopOpen}
							isBottomOpen={isBottomOpen}
							onToggleTop={onToggleTop}
							onToggleBottom={onToggleBottom}
						/>
						<GraphPane
							isTopOpen={isTopOpen}
							isBottomOpen={isBottomOpen}
							hasEmbeddings={hasEmbeddings}
						/>
					</GraphColumn>
					<Sidebar hasEmbeddings={hasEmbeddings} />
				</AnalyticsArea>
			</ManagerContext.Provider>
		) : null
	},
)

const AnalyticsArea = styled.div`
	display: flex;
	flex: 1;
	flex-direction: row;
`

const GraphColumn = styled.div`
	display: flex;
	flex: 4;
	flex-direction: column;
	max-height: 100%;
`
