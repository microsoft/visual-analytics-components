/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { MessageTypes } from './messageTypes'
import {
	Message,
	makeSelectionFilter,
	UpdateFilterMessagePayload,
	ClearSliceMessagePayload,
	FilterLocation,
	SliceType,
	DataChangedMessagePayload,
	ExecuteSearchMessagePayload,
	BooleanClause,
	FilterClause,
} from '@visual-analytics-components/types'

/**
 * A namespace of action creators
 */
export const MessageCreators = Object.freeze({
	Data: Object.freeze({
		changed(
			table: string,
			slice: SliceType,
			description?: string,
		): Message<DataChangedMessagePayload> {
			return {
				type: MessageTypes.Data.Changed,
				description,
				payload: {
					table,
					slice,
				},
			}
		},
		rowsChanged(
			table: string,
			slice: SliceType,
			description?: string,
		): Message<DataChangedMessagePayload> {
			return {
				type: MessageTypes.Data.Changed,
				description,
				payload: {
					table,
					slice,
				},
			}
		},
	}),
	Search: Object.freeze({
		execute(
			value: string,
			searchScope: string | undefined,
			description?: string,
		): Message<ExecuteSearchMessagePayload> {
			return {
				type: MessageTypes.Search.Execute,
				description,
				payload: { value, searchScope },
			}
		},
	}),
	/**
	 * Message creators for selection management
	 */
	Selection: Object.freeze({
		/**
		 * Creates a message for clearing the current selection on a table
		 */
		clear(
			location: FilterLocation,
			description?: string,
		): Message<ClearSliceMessagePayload> {
			return {
				type: MessageTypes.Selection.Clear,
				description,
				payload: location,
			}
		},

		/**
		 * Creates an event type for replacing the current filter on a table
		 * @param location Specifies the name of the table and a filter section identifier
		 * @param filter The new filter expression for highlights
		 * @param description* Optional description, for the interaction log
		 */
		replace(
			location: FilterLocation,
			filter: BooleanClause | FilterClause,
			description?: string,
		): Message<UpdateFilterMessagePayload> {
			return {
				type: MessageTypes.Selection.Replace,
				description,
				payload: {
					location,
					filter,
				},
			}
		},

		/**
		 * Creates an event type for replacing the current filter on a table
		 * @param location Specifies the name of the table and a filter section identifier
		 * @param ids The row identifiers that comprises the new highlight
		 * @param description* Optional description, for the interaction log
		 */
		replaceWithIds(
			location: FilterLocation,
			ids: string[] | number[],
			description?: string,
		): Message<UpdateFilterMessagePayload> {
			return {
				type: MessageTypes.Selection.Replace,
				description,
				payload: {
					location,
					filter: makeSelectionFilter('id', ids),
				},
			}
		},
	}),

	/**
	 * Message creators for highlight management
	 */
	Highlight: Object.freeze({
		/**
		 * Creates an event type for clearing the current selection on a table
		 * @param location Specifies the name of the table and a filter section identifier
		 * @param description* Optional description, for the interaction log
		 */
		clear(
			location: FilterLocation,
			description?: string,
		): Message<ClearSliceMessagePayload> {
			return {
				type: MessageTypes.Highlight.Clear,
				description,
				payload: location,
			}
		},

		/**
		 * Creates an event type for replacing the current highlight on a table
		 * @param location Specifies the name of the table and a filter section identifier
		 * @param ids The row identifiers that comprises the new highlight
		 * @param description* Optional description, for the interaction log
		 */
		replaceWithIds(
			location: FilterLocation,
			ids: string[] | number[],
			description?: string,
		): Message<UpdateFilterMessagePayload> {
			return MessageCreators.Highlight.replace(
				location,
				makeSelectionFilter('id', ids),
				description,
			)
		},

		/**
		 * Creates an event type for replacing the current highlight on a table
		 * @param location Specifies the name of the table and a filter section identifier
		 * @param filter The new filter expression for highlights
		 * @param description* Optional description, for the interaction log
		 */
		replace(
			location: FilterLocation,
			filter: BooleanClause | FilterClause,
			description?: string,
		): Message<UpdateFilterMessagePayload> {
			return {
				type: MessageTypes.Highlight.Replace,
				description,
				payload: {
					location,
					filter,
				},
			}
		},
	}),

	Filter: Object.freeze({
		/**
		 * Creates an event type for clearing the current filter on a table
		 */
		clear(
			location: FilterLocation,
			description?: string,
		): Message<ClearSliceMessagePayload> {
			return {
				type: MessageTypes.Filter.Clear,
				description,
				payload: location,
			}
		},

		/**
		 * Creates an event type for replacing the current filter on a table
		 * @param location Specifies the name of the table and a filter section identifier
		 * @param filter The row predicate to apply. If this returns true for a row, it will
		 * be in the filteredIn set, if it returns false, it will be in the filteredOut set.
		 * @param description* Optional description, for the interaction log
		 */
		replace(
			location: FilterLocation,
			filter: BooleanClause | FilterClause,
			description?: string,
		): Message<UpdateFilterMessagePayload> {
			return {
				type: MessageTypes.Filter.Replace,
				description,
				payload: {
					location,
					filter,
				},
			}
		},
	}),
})
