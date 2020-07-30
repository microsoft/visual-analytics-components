/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import React, { memo, useMemo } from 'react'
import { FaChevronDown as CloseIcon } from 'react-icons/fa'
import styled from 'styled-components'
import {
	DimensionalityReduction,
	DRAlgorithm,
} from '../../../dimensionalityReduction'
import { PcaAlgorithm } from '../../../dimensionalityReduction/PcaAlgorithm'
import { TsneAlgorithm } from '../../../dimensionalityReduction/TsneAlgorithm'
import { UmapAlgorithm } from '../../../dimensionalityReduction/UmapAlgorithm'
import { PCAPane } from './PCAPane'
import { TSNEPane } from './TSNEPane'
import { TechniqueSelector } from './TechniqueSelector'
import { UMAPPane } from './UMAPPane'

export interface EmbeddingsPaneProps {
	show: boolean
	dimIndices: [number, number, number]
	algorithm: DRAlgorithm<any, any> | undefined
	onDismiss: () => void
	onChangeSelected: (dims: [number, number, number]) => void
	onChangeTechnique: (dr: DimensionalityReduction) => void
	onInfoChanged: (info: string) => void
}

export const EmbeddingsPane: React.FC<EmbeddingsPaneProps> = memo(
	function EmbeddingsPane({
		show,
		dimIndices,
		algorithm,
		onDismiss,
		onInfoChanged,
		onChangeSelected,
		onChangeTechnique,
	}) {
		const technique = useMemo(
			() => (algorithm && algorithm.type) || DimensionalityReduction.PCA,
			[algorithm],
		)
		return (
			<Pane style={{ display: show ? undefined : 'none' }}>
				<Title>
					<TitleText>{display(technique)} Configuration</TitleText>
					<CloseIcon onClick={onDismiss} />
				</Title>
				<Content>
					<TechniqueSelector
						technique={technique}
						onChangeTechnique={onChangeTechnique}
					/>
					{algorithm && technique === DimensionalityReduction.PCA ? (
						<PCAPane
							onInfoChanged={onInfoChanged}
							dimIndices={dimIndices}
							algorithm={algorithm as PcaAlgorithm}
							onChangeSelected={onChangeSelected}
						/>
					) : null}
					{algorithm && technique === DimensionalityReduction.UMAP ? (
						<UMAPPane
							algorithm={algorithm as UmapAlgorithm}
							onInfoChanged={onInfoChanged}
						/>
					) : null}
					{algorithm && technique === DimensionalityReduction.TSNE ? (
						<TSNEPane
							algorithm={algorithm as TsneAlgorithm}
							onInfoChanged={onInfoChanged}
						/>
					) : null}
				</Content>
			</Pane>
		)
	},
)

function display(technique: DimensionalityReduction): string {
	switch (technique) {
		case DimensionalityReduction.PCA:
			return 'PCA'
		case DimensionalityReduction.TSNE:
			return 't-SNE'
		case DimensionalityReduction.UMAP:
			return 'UMAP'
	}
}

const Pane = styled.div`
	background-color: black;
	border: 1px solid lightgrey;
	position: fixed;
	bottom: 0;
	left: 0;
	height: 350px;
	width: 400px;
	display: flex;
	padding: 8px;
	flex-direction: column;
`

const Title = styled.div`
	cursor: pointer;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	margin: 0 4px 10px 4px;
`

const TitleText = styled.span`
	flex: 1;
	text-align: center;
	font-weight: bold;
`

const Content = styled.div`
	flex: 1;
	display: flex;
	flex-direction: column;
`
