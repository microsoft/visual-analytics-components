/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { RankListComponent } from '@visual-analytics-components/ranklist-component'
import { SearchComponent } from '@visual-analytics-components/search-component'
import React, { memo } from 'react'
import styled from 'styled-components'
import { useRankListConfiguration } from '../../../hooks/useRankListConfiguration'
import { Component } from '../common'

export interface SidebarProps {
	hasEmbeddings: boolean
}

export const Sidebar: React.FC<SidebarProps> = memo(function Sidebar({
	hasEmbeddings,
}) {
	const vertexListConfiguration = useRankListConfiguration(hasEmbeddings)

	return (
		<Container>
			<TitlePane>
				<SearchComponent configuration={SEARCH_CONFIGURATION} />
			</TitlePane>
			<Component>
				<RankListComponent configuration={vertexListConfiguration} />
			</Component>
		</Container>
	)
})

const SEARCH_CONFIGURATION = { wait: 250, scope: 'ranklist' }

const Container = styled.div`
	display: flex;
	flex: 1;
	flex-direction: column;
`

const TitlePane = styled.div`
	overflow: hidden;
	display: flex;
	flex-direction: row;
	width: 100%;
	height: 25px;
	min-height: 25px;
	justify-content: space-between;
`
