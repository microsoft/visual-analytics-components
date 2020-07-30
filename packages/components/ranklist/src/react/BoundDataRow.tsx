/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import * as React from 'react'
import { memo, useMemo, useCallback } from 'react'
import { RankedRow, Ranking } from '../interfaces'
import { DataRow } from './DataRow'

export interface BoundDataRowProps {
	ranking: Ranking
	row: RankedRow
	label: string
	hidden: boolean

	// Optional style to apply to the item
	style?: React.CSSProperties

	colorScale: (input: RankedRow) => string
	handleClick: (input: RankedRow) => void
	handleHover: (input: RankedRow) => void
}

export const BoundDataRow: React.FC<BoundDataRowProps> = memo(
	function BoundDataRow({
		ranking,
		row,
		label,
		hidden,
		colorScale,
		handleClick,
		handleHover,
		style,
	}) {
		const color = useMemo(() => colorScale(row), [colorScale, row])
		const annotationText = useMemo(
			() => (row.metric != null ? row.metric.toFixed(3) : undefined),
			[row],
		)
		const subAnnotationText = useMemo(
			() => (row.metric != null ? row.metric.toFixed(3) : undefined),
			[row],
		)
		const annotationWidthPercent = useMemo(
			() =>
				row.metric != null && ranking.metricScale != null
					? ranking.metricScale(row.metric) * 100
					: undefined,
			[row.metric, ranking],
		)
		const subAnnotationWidthPercent = useMemo(
			() =>
				row.submetric != null && ranking.submetricScale != null
					? ranking.submetricScale(row.submetric) * 100
					: undefined,
			[row.submetric, ranking],
		)

		const onClick = useCallback(() => handleClick(row), [handleClick, row])
		const onHover = useCallback(() => handleHover(row), [handleHover, row])

		return (
			<DataRow
				label={label}
				color={color}
				hidden={hidden}
				style={style}
				annotationText={annotationText}
				subAnnotationText={subAnnotationText}
				annotationWidthPercent={annotationWidthPercent}
				subAnnotationWidthPercent={subAnnotationWidthPercent}
				onClick={onClick}
				onStartHover={onHover}
			/>
		)
	},
)
