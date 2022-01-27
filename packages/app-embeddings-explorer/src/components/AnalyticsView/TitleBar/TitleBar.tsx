/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { FilterChipComponent } from '@visual-analytics-components/filterchip-component'
import { TitleComponent } from '@visual-analytics-components/title-component'
import React, { memo } from 'react'
import styled from 'styled-components'
import { Toggle } from './Toggle'

export interface TitleBarProps {
	isTopOpen: boolean
	isBottomOpen: boolean
	onToggleTop: (expanded: boolean) => void
	onToggleBottom: (expanded: boolean) => void
}
export const TitleBar: React.FC<TitleBarProps> = memo(function TitleBar({
	isTopOpen,
	isBottomOpen,
	onToggleTop,
	onToggleBottom,
}) {
	return (
		<Container>
			<TitleComponent />
			<Content>
				<FilterChipComponent />
				<Toggle expanded={isTopOpen} title="Graph" onToggle={onToggleTop} />
				<Toggle
					expanded={isBottomOpen}
					title="Embeddings"
					onToggle={onToggleBottom}
				/>
			</Content>
		</Container>
	)
})

const Container = styled.div`
	overflow: hidden;
	display: flex;
	flex-direction: row;
	width: 100%;
	height: 25px;
	min-height: 25px;
	justify-content: space-between;
`

const Content = styled.div`
	display: flex;
	flex-direction: row;
`
