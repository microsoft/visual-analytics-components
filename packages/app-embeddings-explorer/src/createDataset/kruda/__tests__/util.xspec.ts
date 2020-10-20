/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { computeLengthStats } from '../util'

describe('Kruda Loading Utilities', () => {
	it('can compute length statistics for fierds', () => {
		const stats = computeLengthStats(
			[{ id: 'a' }, { id: 'b' }, { id: 'c' }],
			['id'],
		)
		// byte align the length
		expect(stats.id).toBe(1)
	})
})
