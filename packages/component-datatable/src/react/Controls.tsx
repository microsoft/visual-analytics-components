/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable jsx-a11y/no-onchange */
import * as React from 'react'
import { memo } from 'react'
import styled from 'styled-components'
import { Dropdown } from './Dropdown'
import { SliceType } from 'visual-analytics-components'

const SLICE_OPTIONS = [
	{ value: SliceType.All, name: 'All' },
	{ value: SliceType.FilteredIn, name: 'Filtered-In' },
	{ value: SliceType.FilteredOut, name: 'Filtered-Out' },
	{ value: SliceType.Selected, name: 'Selected' },
	{ value: SliceType.Highlighted, name: 'Highlighted' },
]
const SLICE_VALUES = SLICE_OPTIONS.map(s => s.value)
const SLICE_LABELS = SLICE_OPTIONS.map(s => s.name)

export interface ControlsProps {
	tableNames: string[]
	table: string
	slice: SliceType
	onTableChanged: (table: string) => void
	onSliceChanged: (slice: SliceType) => void
}

export const Controls: React.FC<ControlsProps> = memo(function Controls({
	tableNames,
	table,
	slice,
	onTableChanged,
	onSliceChanged,
}) {
	return (
		<ControlsContainer>
			<Dropdown options={tableNames} value={table} onChange={onTableChanged} />
			<Dropdown
				options={SLICE_VALUES}
				labels={SLICE_LABELS}
				value={slice}
				onChange={onSliceChanged as any}
			/>
		</ControlsContainer>
	)
})

const ControlsContainer = styled.div`
	display: flex;
	flex-direction: row;
	min-height: 25px;
`
