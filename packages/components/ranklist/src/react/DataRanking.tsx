/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import * as React from 'react'
import { memo, useMemo, useState, useEffect } from 'react'
import styled from 'styled-components'
import { Ranking, RankedRow } from '../interfaces'
import { RowList } from './RowList'

export interface DataRankingProps {
	ranking: Ranking
	fallbackColorScale: (input: RankedRow) => string
	searchTerm?: string
}
export const DataRanking: React.FC<DataRankingProps> = memo(
	function DataRanking({ ranking, fallbackColorScale, searchTerm }) {
		const [rows, setRows] = useState<(RankedRow | null)[]>([])

		useEffect(() => {
			setRows(flattenGroups(ranking.groups))
			const subscription = ranking.onChange.subscribe(() =>
				setRows(flattenGroups(ranking.groups)),
			)
			return (): void => subscription.unsubscribe()
		}, [ranking])

		const colorScale = useMemo(() => ranking.colorizer || fallbackColorScale, [
			ranking,
			fallbackColorScale,
		])

		const filteredRows = useMemo(() => {
			return rows.filter(row => {
				const visible = searchTerm
					? row && row.label.toLowerCase().indexOf(searchTerm) > -1
					: true
				return visible
			})
		}, [searchTerm, rows])

		return (
			<Container>
				<RowList
					ranking={ranking}
					rows={filteredRows}
					colorScale={colorScale}
					searchTerm={searchTerm}
				/>
			</Container>
		)
	},
)

const Container = styled.div`
	padding: 0;
	position: relative;
	display: flex;
	flex: 1;
`

/**
 * Flattens groups of RankedRows into a single list containing null as separators between groups
 * @param groups The list of groups to flatten
 */
function flattenGroups(groups: RankedRow[][]): (RankedRow | null)[] {
	const rows: (RankedRow | null)[] = []
	groups.forEach(group => {
		group.forEach(item => {
			rows.push(item)
		})
		rows.push(null)
	})
	return rows
}
