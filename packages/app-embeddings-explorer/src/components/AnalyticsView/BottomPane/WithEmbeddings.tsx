/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import React, { memo, useContext, useState, useMemo, useCallback } from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import {
	getDRAlgorithm,
	DimensionalityReduction,
} from '../../../dimensionalityReduction'
import { EmbeddingsConfiguration } from '../EmbeddingsConfiguration'
import { Component } from '../common'
import { getMapping } from './getMapping'
import { DatatableComponent } from '@visual-analytics-components/datatable-component'
import {
	GraphComponent,
	Configuration,
} from '@visual-analytics-components/graph-component'
import { ManagerContext } from '@visual-analytics-components/react'
import { DataMapping } from 'visual-analytics-components'
import 'react-tabs/style/react-tabs.css'
import './react-tabs.css'

export const WithEmbeddings: React.FC = memo(function WithEmbeddings() {
	const manager = useContext(ManagerContext)
	const [dimIndices, setDimIndices] = useState<[number, number, number]>([
		0,
		1,
		2,
	])
	const [technique, setTechnique] = useState(DimensionalityReduction.PCA)

	// x,y,z indices in embedding
	const drAlgo = useMemo(() => getDRAlgorithm(technique, manager), [
		technique,
		manager,
	])

	const mapping = useMemo(() => getMapping(technique, ...dimIndices), [
		dimIndices,
		technique,
	])
	const handleChangeTechnique = useCallback(
		(v: DimensionalityReduction) => {
			setTechnique(v)
			setDimIndices([0, 1, 2])
		},
		[setTechnique, setDimIndices],
	)
	const graphConfig = useMemo(() => getGraphConfig(technique, mapping), [
		technique,
		mapping,
	])

	return (
		<Tabs>
			<TabList>
				<Tab>Embeddings</Tab>
				<Tab>Tables</Tab>
			</TabList>
			<TabPanel>
				<EmbeddingsConfiguration
					algorithm={drAlgo}
					dimIndices={dimIndices}
					onChangeTechnique={handleChangeTechnique}
					onChangeSelected={setDimIndices}
				/>
				<Component>
					<GraphComponent configuration={graphConfig} />
				</Component>
			</TabPanel>
			<TabPanel>
				<Component>
					<DatatableComponent />
				</Component>
			</TabPanel>
		</Tabs>
	)
})

const getGraphConfig = (
	technique: DimensionalityReduction,
	mapping: DataMapping,
): Configuration => ({
	instanceId: `embeddings_${technique}`,
	dataMapping: mapping,
	rendering: {
		drawEdges: false,
		nodeMinRadius: 2.5,
		nodeMaxRadius: 8,
		is3D: true,
		drawAxes: true,
	},
})
