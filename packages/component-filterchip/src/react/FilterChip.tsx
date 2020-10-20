/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Theme } from '@thematic/core'
import { useThematic } from '@thematic/react'
import * as React from 'react'
import { memo } from 'react'
import styled from 'styled-components'
import { FilterChipData } from './interfaces'

export interface FilterChipProps {
	data: FilterChipData
	onClick: () => void
	tabIndex?: number
}

const DEFAULT_TAB_INDEX = 0

export const FilterChip: React.FC<FilterChipProps> = memo(function FilterChip({
	data,
	onClick,
	tabIndex = DEFAULT_TAB_INDEX,
}) {
	const theme = useThematic()
	return (
		<Container
			theme={theme}
			onClick={onClick}
			onKeyDown={onClick}
			role="button"
			tabIndex={tabIndex}
		>
			{data.label}
			<CloseButton>X</CloseButton>
		</Container>
	)
})

interface ContainerProps {
	theme: Theme
}

const Container = styled.div`
	background-color: ${({ theme }: ContainerProps) => theme.area().fill().hex()};
	border-radius: 10px;
	padding: 2px 5px 2px 5px;
	display: flex;
	align-items: center;
	font-weight: 300;
	font-size: 12px;
	cursor: pointer;
	margin-left: 4px;
	margin-top: 2px;
	margin-bottom: 2px;
`

const CloseButton = styled.span`
	margin-left: 5px;
	font-weight: bold;
`
