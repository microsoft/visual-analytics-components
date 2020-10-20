/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import * as React from 'react'
import { memo, useMemo } from 'react'
import styled from 'styled-components'
import { NO_OP } from 'visual-analytics-components'
import { useHoverState } from '../hooks'
import { CategoryStripe } from './CategoryStripe'
import { Label } from './Label'
import { MetricBar } from './MetricBar'

export interface DataRowProps {
	label: string
	color: string

	// Optional style to apply to the item
	style?: React.CSSProperties

	// Interaction state
	hidden?: boolean
	highlighted?: boolean

	// Annotation Data
	annotationText?: string
	annotationWidthPercent?: number
	subAnnotationText?: string
	subAnnotationWidthPercent?: number

	// Event Callbacks
	onStartHover?: () => void
	onEndHover?: () => void
	onClick?: () => void

	tabIndex?: number
}

export const DataRow: React.FC<DataRowProps> = memo(function DataRow({
	hidden,
	highlighted,
	annotationText,
	annotationWidthPercent,
	subAnnotationWidthPercent,
	label,
	color,
	style,
	onStartHover = NO_OP,
	onClick = NO_OP,
	tabIndex = 0,
}) {
	const [hovered, startHover, endHover] = useHoverState(onStartHover)
	const labelHover = useMemo(() => hovered || highlighted, [
		hovered,
		highlighted,
	])

	return hidden ? null : (
		<Item
			style={style}
			onMouseOver={startHover}
			onFocus={startHover}
			onMouseLeave={endHover}
			onKeyDown={onClick}
			onClick={onClick}
			tabIndex={tabIndex}
			role="button"
		>
			<MetricBar
				className="item-metric-bar"
				widthPercent={annotationWidthPercent}
				color={color}
			/>
			<MetricBar
				className="item-submetric-bar"
				widthPercent={subAnnotationWidthPercent}
			/>
			<ItemContent>
				<ItemNameContainer>
					<CategoryStripe color={color} />
					<Label className="item-name" hovered={labelHover} text={`${label}`} />
				</ItemNameContainer>
				<Label
					className="item-name"
					hovered={labelHover}
					text={annotationText || ''}
				/>
			</ItemContent>
		</Item>
	)
})

const ItemNameContainer = styled.div`
	display: flex;
`

const Item = styled.div`
	cursor: pointer;
	display: flex;
	align-items: center;
`

const ItemContent = styled.div`
	display: flex;
	justify-content: space-between;
	width: 100%;
`
