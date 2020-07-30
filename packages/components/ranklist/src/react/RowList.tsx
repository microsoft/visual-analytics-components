/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Theme } from '@thematic/core'
import { useThematic } from '@thematic/react'
import * as React from 'react'
import { memo, useCallback } from 'react'
import AutoSizer from 'react-virtualized-auto-sizer'
import { FixedSizeList, ListChildComponentProps } from 'react-window'
import styled from 'styled-components'
import { RankedRow, Ranking } from '../interfaces'
import { BoundDataRow } from './BoundDataRow'

export interface RowListProps {
	ranking: Ranking
	rows: (RankedRow | null)[]
	colorScale: (input: RankedRow) => string
	searchTerm?: string
}

const ITEM_HEIGHT = 15
const DEFAULT_SEPARATOR_STYLE = {
	marginTop: ITEM_HEIGHT / 2,
}

export const RowList: React.FC<RowListProps> = memo(function RowList({
	ranking,
	rows,
	colorScale,
	searchTerm,
}) {
	const handleClick = useCallback(
		(row: RankedRow) => {
			if (ranking.handleClick) {
				ranking.handleClick(row)
			}
		},
		[ranking],
	)

	const handleHover = useCallback(
		(row: RankedRow) => {
			if (ranking.handleHover) {
				ranking.handleHover(row)
			}
		},
		[ranking],
	)

	const theme = useThematic()
	/**
	 * Renders each row
	 */
	const rowRenderer = useCallback(
		({ index, style }: ListChildComponentProps) => {
			const row = rows[index]
			const label = row ? `${row.label}` || '' : ''
			const hidden = searchTerm
				? label.toLowerCase().indexOf(searchTerm) === -1
				: false
			if (!hidden) {
				return row ? (
					<BoundDataRow
						key={row.id}
						style={style}
						row={row}
						label={label}
						hidden={hidden}
						ranking={ranking}
						colorScale={colorScale}
						handleClick={handleClick}
						handleHover={handleHover}
					/>
				) : (
					<Separator
						key={index}
						theme={theme}
						style={{ ...DEFAULT_SEPARATOR_STYLE, ...style }}
					/>
				)
			}
			return null
		},
		[colorScale, handleClick, handleHover, ranking, rows, searchTerm, theme],
	)

	const list = useCallback(
		({ width, height }) => (
			<FixedSizeList
				layout="vertical"
				itemSize={ITEM_HEIGHT}
				height={height}
				width={width}
				itemCount={(rows && rows.length) || 0}
			>
				{rowRenderer}
			</FixedSizeList>
		),
		[rowRenderer, rows],
	)

	// TODO: Swap out the implementation with one from @essex/toolkit, this one doesn't work correctly
	return <AutoSizer>{list}</AutoSizer>
})

interface SeparatorProps {
	theme: Theme
}
const Separator = styled.div`
	border-top: ${({ theme }: SeparatorProps) =>
		`1px solid ${theme != null ? theme.gridLines().stroke().hex() : '#ddd'}`};
	/* margin-top dynamically calculated */
`
