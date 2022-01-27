/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { MessageHubImpl } from '@visual-analytics-components/manager'
import { MessageCreators } from '@visual-analytics-components/messages'
import { PlainObjectDataSet } from '@visual-analytics-components/plain-object-dataset'
import {
	DatumType,
	SliceType,
	FilterOperation,
} from '@visual-analytics-components/types'

describe('the plain object dataset', () => {
	it('set and clear a selection', () => {
		const tables = createDataset()
		const hub = new MessageHubImpl(false) // use synchronous messaging
		tables.receiveMessageHub(hub)

		const slice = tables.table('nodes')!.slice(SliceType.Selected)
		expect(slice.length()).toBe(0)

		// Selecting a node  results in a valid selection length
		hub.publish(
			MessageCreators.Selection.replaceWithIds({ table: 'nodes' }, ['abc']),
		)
		expect(slice.length()).toBe(1)

		// Clearing the selection goes back to empty set
		hub.publish(MessageCreators.Selection.clear({ table: 'nodes' }))
		expect(slice.length()).toBe(0)
	})

	it('set and clear a highlight', () => {
		const tables = createDataset()
		const hub = new MessageHubImpl(false) // use synchronous messaging
		tables.receiveMessageHub(hub)

		const slice = tables.table('nodes')!.slice(SliceType.Highlighted)
		expect(slice.length()).toBe(0)

		// Selecting a node  results in a valid selection length
		hub.publish(
			MessageCreators.Highlight.replaceWithIds({ table: 'nodes' }, ['abc']),
		)
		expect(slice.length()).toBe(1)

		// Clearing the selection goes back to empty set
		hub.publish(MessageCreators.Highlight.clear({ table: 'nodes' }))
		expect(slice.length()).toBe(0)
	})
})

it('set and clear a filter', () => {
	const tables = createDataset()
	const hub = new MessageHubImpl(false) // use synchronous messaging
	tables.receiveMessageHub(hub)

	const slice = tables.table('nodes')!.slice(SliceType.FilteredIn)
	expect(slice.length()).toBe(3)

	// Selecting a node  results in a valid selection length
	hub.publish(
		MessageCreators.Filter.replace(
			{ table: 'nodes' },
			{ field: 'id', operation: FilterOperation.In, value: ['abc'] },
		),
	)
	expect(slice.length()).toBe(1)

	// Clearing the selection goes back to empty set
	hub.publish(MessageCreators.Filter.clear({ table: 'nodes' }))
	expect(slice.length()).toBe(3)
})

function createDataset(): PlainObjectDataSet {
	return new PlainObjectDataSet({
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
}
