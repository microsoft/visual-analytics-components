/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import * as React from 'react'
import { useEffect, memo, useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import { Manager } from 'visual-analytics-components'
import { Configuration, Ranking } from '../interfaces'
import { isSearchScopeEvent } from '../util/predicates'
import { DataRanking } from './DataRanking'
import { GlobalStyles } from './GlobalStyles'
import { RankingSelector } from './RankingSelector'
import { useCategoricalScale, useSearchTerm } from './hooks'

export interface AppProps {
	manager: Manager
	configuration: Configuration
}

const DEFAULT_RANKINGS: Ranking[] = []

export const App: React.FC<AppProps> = memo(function App({
	manager,
	configuration,
}) {
	const { rankings = DEFAULT_RANKINGS, searchScope } = configuration
	const isSSE = useMemo(
		() => isSearchScopeEvent(searchScope || ''),
		[searchScope],
	)
	const [selectedRanking, setSelectedRanking] = useState<Ranking | undefined>(
		rankings.length > 0 ? rankings[0] : undefined,
	)
	const onSelectRanking = useCallback(r => setSelectedRanking(r), [])
	const colorScale = useCategoricalScale(manager, configuration)

	// Initialize the rankings with the Manager
	useInitalizedRankings(rankings, manager)
	useSelectedRankingConnection(selectedRanking)
	const searchTerm = useSearchTerm(manager, isSSE)

	return (
		<>
			<GlobalStyles />
			<Container>
				{rankings.length === 0 ? null : (
					<>
						<RankingSelector
							rankings={rankings}
							selectedRanking={selectedRanking!}
							onSelectRanking={onSelectRanking}
						/>
						<DataRanking
							ranking={selectedRanking!}
							fallbackColorScale={colorScale as any}
							searchTerm={searchTerm}
						/>
					</>
				)}
			</Container>
		</>
	)
})

const Container = styled.div`
	display: flex;
	flex-direction: column;
	height: 100%;
	width: 100%;
	max-width: 100%;
	max-height: 100%;
`

function useInitalizedRankings(rankings: Ranking[], manager: Manager): void {
	useEffect(() => {
		const unsubs = rankings.map(r => r.initialize(manager))
		return (): void => unsubs.forEach(us => us())
	}, [rankings, manager])
}

/**
 *  Reconnect the ranking when it is selected
 * @param selectedRanking
 */
function useSelectedRankingConnection(
	selectedRanking: Ranking | undefined,
): void {
	const connect = selectedRanking?.connect
	useEffect(() => {
		if (connect) {
			return connect()
		}
	}, [connect])
}
