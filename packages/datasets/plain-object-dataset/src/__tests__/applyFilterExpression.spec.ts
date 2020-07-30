/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	FilterOperation,
	BooleanOperation,
	FilterExpression,
} from '@visual-analytics-components/types'
import {
	applyFilterExpression,
	applyInverseFilterExpression,
} from '../applyFilterExpression'

describe('Filter Expressions', () => {
	it('can perform a contains expression on an array', () => {
		const data = [
			{ id: 1, smoodges: ['a', 'b', 'c'] },
			{ id: 2, smoodges: ['a', 'd', 'e'] },
			{ id: 3, smoodges: ['x', 'y', 'z'] },
		]
		const expr: FilterExpression = {
			operation: BooleanOperation.AND,
			expressions: {
				__global__: {
					field: 'smoodges',
					operation: FilterOperation.Contains,
					value: 'a',
				},
			},
		}
		const result = applyFilterExpression(data, expr)
		expect(result).toHaveLength(2)
		expect(result.map(r => r.id)).toEqual([1, 2])

		const inverse = applyInverseFilterExpression(data, expr)
		expect(inverse).toHaveLength(1)
		expect(inverse.map(r => r.id)).toEqual([3])
	})

	it('can perform a contains expression on a string', () => {
		const data = [
			{ id: 1, smoodges: 'there is no dana only zuul' },
			{ id: 2, smoodges: 'insane in the membrane' },
			{ id: 3, smoodges: 'bling zuul mayo' },
		]
		const expr: FilterExpression = {
			operation: BooleanOperation.AND,
			expressions: {
				__global__: {
					field: 'smoodges',
					operation: FilterOperation.Contains,
					value: 'zuul',
				},
			},
		}
		const result = applyFilterExpression(data, expr)
		expect(result).toHaveLength(2)
		expect(result.map(r => r.id)).toEqual([1, 3])

		const inverse = applyInverseFilterExpression(data, expr)
		expect(inverse).toHaveLength(1)
		expect(inverse.map(r => r.id)).toEqual([2])
	})

	it('can perform an equals expression on strings', () => {
		const data = [
			{ id: 1, smoodges: 'a' },
			{ id: 2, smoodges: 'a' },
			{ id: 3, smoodges: 'c' },
		]

		const expr: FilterExpression = {
			operation: BooleanOperation.AND,
			expressions: {
				__global__: {
					field: 'smoodges',
					operation: FilterOperation.Equal,
					value: 'a',
				},
			},
		}
		const result = applyFilterExpression(data, expr)
		expect(result).toHaveLength(2)
		expect(result.map(r => r.id)).toEqual([1, 2])

		const inverse = applyInverseFilterExpression(data, expr)
		expect(inverse).toHaveLength(1)
		expect(inverse.map(r => r.id)).toEqual([3])
	})

	it('can perform an equals expression on an array', () => {
		const data = [
			{ id: 1, smoodges: ['a'] },
			{ id: 2, smoodges: ['a'] },
			{ id: 3, smoodges: ['c'] },
			{ id: 4, smoodges: 7 },
		]

		const expr: FilterExpression = {
			operation: BooleanOperation.AND,
			expressions: {
				__global__: {
					field: 'smoodges',
					operation: FilterOperation.Equal,
					value: ['a'],
				},
			},
		}
		const result = applyFilterExpression(data, expr)
		expect(result).toHaveLength(2)
		expect(result.map(r => r.id)).toEqual([1, 2])

		const inverse = applyInverseFilterExpression(data, expr)
		expect(inverse).toHaveLength(2)
		expect(inverse.map(r => r.id)).toEqual([3, 4])
	})

	it('can perform an in expression on an array', () => {
		const data = [{ id: 1 }, { id: 2 }, { id: 3 }]
		const expr: FilterExpression = {
			operation: BooleanOperation.AND,
			expressions: {
				__global__: {
					field: 'id',
					operation: FilterOperation.In,
					value: [2, 3],
				},
			},
		}
		const result = applyFilterExpression(data, expr)
		expect(result).toHaveLength(2)
		expect(result.map(r => r.id)).toEqual([2, 3])

		const inverse = applyInverseFilterExpression(data, expr)
		expect(inverse).toHaveLength(1)
		expect(inverse.map(r => r.id)).toEqual([1])
	})

	it('can perform an in expression on a string', () => {
		const data = [
			{ id: 1, foo: 'x' },
			{ id: 2, foo: 'y' },
			{ id: 3, foo: 'z' },
		]
		const expr: FilterExpression = {
			operation: BooleanOperation.AND,
			expressions: {
				__global__: {
					field: 'foo',
					operation: FilterOperation.In,
					value: 'derp xy',
				},
			},
		}
		const result = applyFilterExpression(data, expr)
		expect(result).toHaveLength(2)
		expect(result.map(r => r.id)).toEqual([1, 2])

		const inverse = applyInverseFilterExpression(data, expr)
		expect(inverse).toHaveLength(1)
		expect(inverse.map(r => r.id)).toEqual([3])
	})
})
