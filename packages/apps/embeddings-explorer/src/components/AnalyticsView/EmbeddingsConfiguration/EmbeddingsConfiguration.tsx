/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import React, { memo, useCallback, useState } from 'react'
import { FaSlidersH as ToggleIcon } from 'react-icons/fa'
import styled from 'styled-components'
import {
	DimensionalityReduction,
	DRAlgorithm,
} from '../../../dimensionalityReduction'
import { EmbeddingsPane } from './EmbeddingsPane'

export interface EmbeddingsConfigurationProps {
	dimIndices: [number, number, number]
	algorithm: DRAlgorithm<any, any> | undefined
	onChangeSelected: (selected: [number, number, number]) => void
	onChangeTechnique: (technique: DimensionalityReduction) => void
}

export const EmbeddingsConfiguration: React.FC<EmbeddingsConfigurationProps> = memo(
	function EmbeddingsConfiguration({
		dimIndices,
		algorithm,
		onChangeSelected,
		onChangeTechnique,
	}) {
		const [showPane, setShowPane] = useState(false)
		const togglePane = useCallback(() => setShowPane(!showPane), [showPane])
		const dismissPane = useCallback(() => setShowPane(false), [setShowPane])
		const [info, setInfo] = useState('getting embeddings info...')

		return (
			<VarianceLabel>
				<StyledToggleIcon onClick={togglePane} />
				{info}
				<EmbeddingsPane
					show={showPane}
					dimIndices={dimIndices}
					onDismiss={dismissPane}
					algorithm={algorithm}
					onInfoChanged={setInfo}
					onChangeSelected={onChangeSelected}
					onChangeTechnique={onChangeTechnique}
				/>
			</VarianceLabel>
		)
	},
)

const VarianceLabel = styled.div`
	position: absolute;
	bottom: 0;
	left: 0;
	padding: 8px;
	font-size: 11pt;
	font-family: sans-serif;
	align-items: center;
	display: flex;

	/* Render over components */
	z-index: 1;
`

const StyledToggleIcon = styled(ToggleIcon)`
	margin-right: 5px;
`
