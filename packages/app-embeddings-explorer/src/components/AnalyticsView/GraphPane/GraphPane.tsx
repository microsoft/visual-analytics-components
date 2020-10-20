/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import React, { memo } from 'react'
import styled from 'styled-components'
import { Maybe } from '../../Maybe'
import { BottomPane } from '../BottomPane'
import { TopPane } from './TopPane'

export interface GraphPaneProps {
	isTopOpen: boolean
	isBottomOpen: boolean
	hasEmbeddings: boolean
}

export const GraphPane: React.FC<GraphPaneProps> = memo(function GraphPane({
	isTopOpen,
	isBottomOpen,
	hasEmbeddings,
}) {
	return (
		<Container>
			<Maybe if={isTopOpen}>
				<ColumnPane>
					<TopPane />
				</ColumnPane>
			</Maybe>
			<Maybe if={isBottomOpen}>
				<ColumnPane>
					<BottomPane hasEmbeddings={hasEmbeddings} />
				</ColumnPane>
			</Maybe>
		</Container>
	)
})

const Container = styled.div`
	flex: 1;
	display: flex;
	flex-direction: column;
`

const ColumnPane = styled.div`
	flex: 1;
	display: flex;
`
