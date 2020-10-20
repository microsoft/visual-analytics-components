/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export const MessageTypes = Object.freeze({
	Search: Object.freeze({
		Execute: 'VAC::Search::execute',
	}),
	Data: Object.freeze({
		// Event for when data has changed on a table slice
		RowsChanged: 'VAC::Data::data_change',
		// Event for when data has changed on a table slice
		Changed: 'VAC::Data::data_change',
	}),
	Selection: Object.freeze({
		/**
		 * Replaces the current selection with a new selection
		 */
		Replace: 'VAC::Slices::Selection::replace',

		/**
		 * Clears the current selection
		 */
		Clear: 'VAC::Slices::Selection::clear',
	}),
	Highlight: Object.freeze({
		/**
		 * Replaces the current selection with a new selection
		 */
		Replace: 'VAC::Slices::Highlight::replace',

		/**
		 * Clears the current selection
		 */
		Clear: 'VAC::Slices::Highlight::clear',
	}),
	Filter: Object.freeze({
		/**
		 * Replaces the current selection with a new selection
		 */
		Replace: 'VAC::Slices::Filter::replace',

		/**
		 * Clears the current selection
		 */
		Clear: 'VAC::Slices::Filter::clear',
	}),
})
