/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ManagerImpl } from '../ManagerImpl'
import { PlainObjectDataSet } from '@visual-analytics-components/plain-object-dataset'
import { DatumType, DataMapping } from '@visual-analytics-components/types'

describe('VAC Manager', () => {
	it('can apply a data mapping', async () => {
		const sourceDataSet = new PlainObjectDataSet({
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
		const instance = ManagerImpl.createInstance(sourceDataSet, {} as any)
		expect(instance).toBeDefined()
		expect(instance.data).toBeDefined()
		expect(instance.id).toBeTruthy()

		const mapping: DataMapping = {
			vertices: {
				table: 'nodes',
			},
		}
		const mappedInstance = instance.applyMapping(mapping)
		expect(mappedInstance).toBeDefined()
		expect(mappedInstance.data).toBeDefined()
	})
})
