/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { mount } from 'enzyme'
import * as React from 'react'
import {
	ManagerImpl,
	PlainObjectDataSet,
	DatumType,
	Manager,
	DataMapping,
	SliceType,
} from 'visual-analytics-components'
import { Vertex } from '../../../../apps/embeddings-explorer/src/interfaces'
import { ManagerContext } from '../context'
import { createComponent } from '../createComponent'

describe('createComponent', () => {
	it('creates a vac react component', () => {
		const Component: React.FC = () => null
		const Comp = createComponent(Component)
		expect(Comp).toBeDefined()
	})

	it('will not mount the inner component if a manager is not in context', () => {
		const Component: React.FC = () => {
			throw new Error('inner component should not mount')
		}
		const Comp = createComponent(Component)
		expect(() => mount(<Comp />)).not.toThrow()
	})

	it('will mount the disvin component if the component is in context', () => {
		const dataset = new PlainObjectDataSet({
			nodes: {
				columns: [
					{ name: 'id', type: DatumType.String },
					{ name: 'embeddings', type: DatumType.Array },
					{ name: 'x', type: DatumType.Number },
					{ name: 'y', type: DatumType.Number },
				],
				data: [
					{ id: 'abc', x: 0.0, y: 5.0, embeddings: [0.0, 1.0] },
					{ id: 'def', x: 1.0, y: 6.0, embeddings: [0.0, 1.0] },
					{ id: 'hij', x: 2.0, y: 7.0, embeddings: [0.0, 1.0] },
				],
			},
		})
		let mounted = false
		const Component: React.FC<{ manager: Manager }> = ({ manager }) => {
			mounted = true
			expect(dataset).toEqual(manager.data)
			return null
		}
		const Comp = createComponent(Component)
		const manager = ManagerImpl.createInstance(dataset, {} as any)
		mount(
			<ManagerContext.Provider value={manager}>
				<Comp />
			</ManagerContext.Provider>,
		)
		expect(mounted).toBeTruthy()
	})

	it('will apply a data transformation', () => {
		const dataset = new PlainObjectDataSet({
			nodes: {
				columns: [
					{ name: 'id', type: DatumType.String },
					{ name: 'embeddings', type: DatumType.Array },
					{ name: 'x', type: DatumType.Number },
					{ name: 'y', type: DatumType.Number },
					{ name: 'community', type: DatumType.Number },
				],
				data: [
					{ id: 'abc', x: 0.0, y: 5.0, embeddings: [0.0, 1.0], community: 2 },
					{ id: 'def', x: 1.0, y: 6.0, embeddings: [0.0, 1.0], community: 3 },
					{ id: 'hij', x: 2.0, y: 7.0, embeddings: [0.0, 1.0], community: 4 },
				],
			},
		})
		let mounted = false
		const Component: React.FC<{ manager: Manager }> = ({ manager }) => {
			mounted = true
			expect(dataset).not.toEqual(manager.data)
			const nodeTable = manager.data.table<Vertex>('nodes')
			expect(nodeTable.columns.some(c => c.name === 'category')).toBeTruthy()
			const allNodes = nodeTable.slice(SliceType.All)
			for (let i = 0; i < allNodes.length(); ++i) {
				expect(allNodes.get(i)!.category).toBeGreaterThan(0)
			}
			return null
		}
		const Comp = createComponent(Component)
		const manager = ManagerImpl.createInstance(dataset, {} as any)
		const dataMapping: DataMapping = {
			nodes: {
				fields: {
					category: 'community',
				},
			},
		}
		mount(
			<ManagerContext.Provider value={manager}>
				<Comp configuration={{ dataMapping }} />
			</ManagerContext.Provider>,
		)
		expect(mounted).toBeTruthy()
	})
})
