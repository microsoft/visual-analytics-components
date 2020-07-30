/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Fabric, Slider, PrimaryButton } from '@fluentui/react'
import React, { memo, useEffect, useCallback } from 'react'
import { TsneAlgorithm } from '../../../dimensionalityReduction/TsneAlgorithm'

export interface TSNEPaneProps {
	algorithm: TsneAlgorithm
	onInfoChanged: (info: string) => void
}
export const TSNEPane: React.FC<TSNEPaneProps> = memo(function TSNEPane({
	algorithm,
	onInfoChanged,
}) {
	useEffect(() => onInfoChanged('t-SNE'), [onInfoChanged])

	return (
		<Fabric>
			<Slider
				label="Perplexity"
				min={configs.perplexity.min}
				max={configs.perplexity.max}
				step={1}
				defaultValue={configs.perplexity.default}
				showValue={true}
				onChange={useCallback(
					(perplexity: number) => algorithm.configure({ perplexity }),
					[algorithm],
				)}
			/>
			<Slider
				label="Early Exaggeration"
				min={configs.earlyExaggeration.min}
				max={configs.earlyExaggeration.max}
				step={0.1}
				defaultValue={configs.earlyExaggeration.default}
				showValue={true}
				onChange={useCallback(
					(earlyExaggeration: number) => algorithm.configure({ earlyExaggeration }),
					[algorithm],
				)}
			/>
			<Slider
				label="Learning Rate"
				min={configs.learningRate.min}
				max={configs.learningRate.max}
				step={0.1}
				defaultValue={configs.learningRate.default}
				showValue={true}
				onChange={useCallback(
					(learningRate: number) => algorithm.configure({ learningRate }),
					[algorithm],
				)}
			/>
			<Slider
				label="# Iterations"
				min={configs.nIter.min}
				max={configs.nIter.max}
				step={0.1}
				defaultValue={configs.nIter.default}
				showValue={true}
				onChange={useCallback((nIter: number) => algorithm.configure({ nIter }), [
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
	perplexity: {
		min: 5,
		max: 50,
		default: 10,
	},
	earlyExaggeration: {
		min: 1.0,
		max: 10.0,
		default: 4,
	},
	learningRate: {
		min: 100,
		max: 1000,
		default: 100,
	},
	nIter: {
		min: 200,
		max: 1000,
		default: 400,
	},
}
