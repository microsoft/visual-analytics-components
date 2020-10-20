/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { PlainObjectRowProxy } from '../PlainObjectRowProxy'

interface TestItem {
	x: number
	y: boolean
	z: string
}

describe('The plain object row proxy', () => {
	it('can proxy a simple object', () => {
		const source = { x: 0, y: true, z: 'abc' }
		const proxy = PlainObjectRowProxy.create<TestItem>(source, ['x', 'y', 'z'])

		expect(proxy['x']).toEqual(0)
		expect(proxy['y']).toEqual(true)
		expect(proxy['z']).toEqual('abc')

		// Object splat works
		expect({ ...proxy }).toEqual(source)
	})

	it('can enumerate on defined keys', () => {
		const source = { x: 0, y: true, z: 'abc' }
		const proxy = PlainObjectRowProxy.create<TestItem>(source, ['x', 'y', 'z'])

		// no datachange handlers present
		expect(Object.keys(proxy)).toEqual(['x', 'y', 'z'])
	})

	it('can splat out object properties', () => {
		const source = { x: 0, y: true, z: 'abc' }
		const proxy = PlainObjectRowProxy.create<TestItem>(source, ['x', 'y', 'z'])
		expect({ ...proxy }).toEqual(source)
	})

	it('can emit datachange events', () => {
		const source = { x: 0, y: true, z: 'abc' }
		const row = PlainObjectRowProxy.create<TestItem>(source, ['x', 'y', 'z'])

		let dataChangeFirings = 0
		row.onDataChange(() => dataChangeFirings++)

		row['x'] = 1
		expect(row['x']).toEqual(1)

		expect(dataChangeFirings).toEqual(1)
	})
})
