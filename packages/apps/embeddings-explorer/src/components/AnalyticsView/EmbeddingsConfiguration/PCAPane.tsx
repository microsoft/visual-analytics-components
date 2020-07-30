/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import React, { memo, useCallback, useMemo, useEffect, useState } from 'react'
import styled from 'styled-components'
import { DimensionVariance } from '../../../dimensionalityReduction'
import { PcaAlgorithm } from '../../../dimensionalityReduction/PcaAlgorithm'

export interface PCAPaneProps {
	algorithm: PcaAlgorithm
	dimIndices: [number, number, number]
	onChangeSelected: (dims: [number, number, number]) => void
	onInfoChanged: (info: string) => void
}

const EMPTY: DimensionVariance[] = [
	{ index: 0, variance: 0 },
	{ index: 1, variance: 0 },
	{ index: 2, variance: 0 },
]

export const PCAPane: React.FC<PCAPaneProps> = memo(function PCAPane({
	dimIndices,
	algorithm,
	onChangeSelected,
	onInfoChanged,
}) {
	const selectDimension = useCallback(
		(index: number) => onChangeSelected([index, dimIndices[0], dimIndices[1]]),
		[dimIndices, onChangeSelected],
	)
	const variance = usePcaDimensions(algorithm)
	const visualizedVariance = useVisualizedVariance(variance, dimIndices)
	const infoText = useInfoText(visualizedVariance, onInfoChanged)

	// Start PCA Immediately
	useEffect(() => {
		algorithm.start()
	}, [algorithm])

	return (
		<div>
			<div>{infoText}</div>
			<VarianceList>
				{variance.map(({ variance, index }) => (
					<VarianceItem
						key={index}
						onClick={(): void => selectDimension(index)}
						onKeyDown={(): void => selectDimension(index)}
						tabIndex={0}
						role="button"
					>
						<VarianceIndex>#{index}</VarianceIndex>
						<VarianceValue>{(variance * 100).toFixed(3)}%</VarianceValue>
						{dimIndices[0] === index ? <Dimension>x</Dimension> : null}
						{dimIndices[1] === index ? <Dimension>y</Dimension> : null}
						{dimIndices[2] === index ? <Dimension>z</Dimension> : null}
					</VarianceItem>
				))}
			</VarianceList>
		</div>
	)
})

function usePcaDimensions(algorithm: PcaAlgorithm): DimensionVariance[] {
	const [variance, setVariance] = useState<DimensionVariance[]>(
		algorithm.result || EMPTY,
	)
	useEffect(() => {
		const subscription = algorithm.onResultChanged.subscribe(r => setVariance(r))
		return (): void => subscription.unsubscribe()
	}, [algorithm, setVariance])
	return variance
}

function useVisualizedVariance(
	variance: DimensionVariance[],
	dimIndices: [number, number, number],
): number {
	return useMemo(() => {
		return (
			dimIndices
				.map(di => (variance[di] && variance[di].variance) || 0)
				.reduce((prev, curr) => prev + curr, 0) * 100
		)
	}, [variance, dimIndices])
}

function useInfoText(
	visualizedVariance: number,
	onInfoChanged: (info: string) => void,
): string {
	const [text, setText] = useState('PCA')
	useEffect(() => {
		if (visualizedVariance > 0.0) {
			const newText = `PCA visualizing ${visualizedVariance.toFixed(3)}%`
			setText(newText)
			onInfoChanged(newText)
		}
	}, [visualizedVariance, onInfoChanged])
	return text
}

const VarianceList = styled.div`
	list-style: none;
	width: 100%;
	overflow-y: scroll;
	padding: 8px;
	margin-top: 0;
`

const VarianceItem = styled.div`
	height: 25px;
	font-size: 16px;
	display: flex;
	align-items: center;
	padding: 0 4px 0 4px;
	margin-top: 2px;
	cursor: pointer;
`

const Dimension = styled.span`
	padding: 4px;
	margin: 4px;
	background-color: grey;
	color: black;
	border-radius: 5px;
`

const VarianceIndex = styled.span`
	margin-right: 5px;
	font-weight: bold;
`

const VarianceValue = styled.span`
	width: 150px;
`
