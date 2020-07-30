/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import React, { memo, useCallback } from 'react'
import styled from 'styled-components'
import { DimensionalityReduction } from '../../../dimensionalityReduction'

export interface TechniqueSelectorProps {
	className?: string
	style?: React.CSSProperties
	technique: DimensionalityReduction
	onChangeTechnique: (dr: DimensionalityReduction) => void
}

export const TechniqueSelector: React.FC<TechniqueSelectorProps> = memo(
	function TechniqueSelector({
		className,
		technique,
		style,
		onChangeTechnique,
	}) {
		const changeHandler = useCallback(
			e => onChangeTechnique(e.target.value as DimensionalityReduction),
			[onChangeTechnique],
		)
		return (
			<Container className={className} style={style}>
				Dimensionality Reduction:
				<select value={technique} onChange={changeHandler} onBlur={changeHandler}>
					<option value={DimensionalityReduction.PCA}>PCA</option>
					<option value={DimensionalityReduction.UMAP}>UMAP</option>
					<option value={DimensionalityReduction.TSNE}>t-SNE</option>
				</select>
			</Container>
		)
	},
)

const Container = styled.div`
	align-items: center;
	align-self: flex-start;
	margin-bottom: 10px;
`
