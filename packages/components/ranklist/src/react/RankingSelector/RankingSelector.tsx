/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable jsx-a11y/no-onchange */
import { Theme } from '@thematic/core/dist/types/Theme'
import { useThematic } from '@thematic/react'
import * as React from 'react'
import { memo, useCallback } from 'react'
import styled from 'styled-components'
import { Ranking } from '../../interfaces'
import { useIdHash } from './../hooks'
import { RankingOption } from './RankingOption'

export interface RankingSelectorProps {
	rankings: Ranking[]
	selectedRanking: Ranking
	onSelectRanking: (block: Ranking) => void
}

export const RankingSelector: React.FC<RankingSelectorProps> = memo(
	function RankingSelector({ rankings, selectedRanking, onSelectRanking }) {
		const rankingMap = useIdHash(rankings)
		const options = rankings.map(ranking => (
			<RankingOption key={ranking.id} ranking={ranking} />
		))

		const onRankingSelectChange = useCallback(
			(e: React.ChangeEvent<any>) => {
				const rankingId = e.target.value as string
				onSelectRanking(rankingMap[rankingId])
			},
			[onSelectRanking, rankingMap],
		)
		const theme = useThematic()

		return (
			<BlockTitle>
				<BlockSelect
					theme={theme}
					value={selectedRanking.id}
					title={selectedRanking.label}
					onChange={onRankingSelectChange}
				>
					{options}
				</BlockSelect>
			</BlockTitle>
		)
	},
)

const BlockTitle = styled.div`
	display: flex;
	flex-direction: row;
	width: 100%;
	max-width: 100%;
	align-items: center;
	padding-left: 2px;
	padding-right: 2px;
`

export interface BlockSelectProps {
	theme: Theme
}
const BlockSelect = styled.select`
	width: 100%;
	margin: 5px;
	-webkit-appearance: none;
	-moz-appearance: none;
	appearance: none;
	font-size: 14px;
	padding-left: 10px;
	background-color: transparent;
	color: ${({ theme }: BlockSelectProps) =>
		theme ? theme.text().fill().hex() : '#333'};
	border: 1px solid
		${({ theme }: BlockSelectProps) =>
			theme ? theme.tooltip().stroke().hex() : 'grey'};
	border-radius: 5px;
`
