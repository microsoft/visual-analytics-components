/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Slider, PrimaryButton, Fabric } from '@fluentui/react'
import React, { memo, useEffect, useCallback } from 'react'
import { UmapAlgorithm } from '../../../dimensionalityReduction/UmapAlgorithm'

export interface UMAPPaneProps {
	algorithm: UmapAlgorithm
	onInfoChanged: (info: string) => void
}

export const UMAPPane: React.FC<UMAPPaneProps> = memo(function UMAPPane({
	algorithm,
	onInfoChanged,
}) {
	useEffect(() => onInfoChanged('UMAP'), [onInfoChanged])

	return (
		<Fabric>
			<Slider
				label="Num Epochs"
				min={configs.epochs.min}
				max={configs.epochs.max}
				step={1}
				defaultValue={configs.epochs.default}
				showValue={true}
				onChange={useCallback(
					(nEpochs: number) => algorithm.configure({ nEpochs }),
					[algorithm],
				)}
			/>
			<Slider
				label="Num Neighbors"
				min={configs.neighbors.min}
				max={configs.neighbors.max}
				step={1}
				defaultValue={configs.neighbors.default}
				showValue={true}
				onChange={useCallback(
					(nNeighbors: number) => algorithm.configure({ nNeighbors }),
					[algorithm],
				)}
			/>
			<Slider
				label="Min Dist"
				min={configs.minDist.min}
				max={configs.minDist.max}
				step={0.01}
				defaultValue={configs.minDist.default}
				showValue={true}
				onChange={useCallback(
					(minDist: number) => algorithm.configure({ minDist }),
					[algorithm],
				)}
			/>
			<Slider
				label="Spread"
				min={configs.spread.min}
				max={configs.spread.max}
				step={0.01}
				defaultValue={configs.spread.default}
				showValue={true}
				onChange={useCallback((spread: number) => algorithm.configure({ spread }), [
					algorithm,
				])}
			/>
			<PrimaryButton
				onClick={useCallback(() => {
					algorithm.start()
				}, [algorithm])}
			>
				Execute
			</PrimaryButton>
		</Fabric>
	)
})

const configs = {
	epochs: {
		min: 10,
		max: 500,
		default: 500,
	},
	neighbors: {
		min: 3,
		max: 50,
		default: 15,
	},
	minDist: {
		min: 0.01,
		default: 0.1,
		max: 0.8,
	},
	spread: {
		default: 1.0,
		min: 0.01,
		max: 5.0,
	},
}
