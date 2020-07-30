/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { MessageHubReceiver } from '../messaging'
import { FilterExpression } from './filters'

/**
 * A datum type, usually associated with column metadata
 */
export enum DatumType {
	String = 'string',
	Number = 'number',
	Date = 'date',
	Boolean = 'boolean',
	Object = 'object',
	Array = 'array',
	Any = 'any',
}

/**
 * The Data Shape specification is defined in the VAC component manifest. It defines what tables it understands
 * and what fields it expects to exist.
 *
 * e.g.
 *
 *		{
 *		  "vertices": {
 *        "x": {
 *           "type": "number"
 *				},
 *        "y": {
 * 					 "type": number
 *        }
 *      }
 *   }
 */
export interface DataShape {
	[tableName: string]: TableShape
}

/**
 * The schema for one table within a Data Shape.
 */
export interface TableShape {
	[fieldName: string]: DatumType
}

export enum SliceType {
	/**
	 * The 'All' selection level represents all data. It cannot be filtered down, but the data
	 * may be mutated by the table permanently.
	 */
	All = 'all',

	/**
	 * This represents data that has been filtered out of view. This may result in not being
	 * rendered or being rendered in a muted fashion. This is the setwise complement of the FilteredIn
	 * selection.
	 */
	FilteredOut = 'filtered_out',

	/**
	 * This represents data that has been filtered into view. This is the setwise complement of the
	 * FilteredOut selection.
	 */
	FilteredIn = 'filtered_in',

	/**
	 * This represents a user selection action.
	 */
	Selected = 'selected',

	/**
	 * This represents a more ephemeral and visually active user highlight action.
	 */
	Highlighted = 'highlighted',
}

/**
 * Interface for a set of named Tables
 */
export interface DataSet extends MessageHubReceiver {
	/**
	 * The available table names
	 */
	tables: string[]

	/**
	 * Gets a table by name
	 * @param name The table name
	 */
	table<T>(name: string): Table<T>
}

/**
 * Interface for a data table
 */
export interface Table<T> extends MessageHubReceiver {
	/**
	 * The name of the table
	 */
	name: string

	/**
	 * The columns of the table
	 */
	columns: ColumnSpecification[]

	/**
	 * Gets a data slice
	 * @param type Selection level of the slice to retrieve
	 */
	slice(type: SliceType): TableSlice<T>
}

/**
 * Interface for a column specification
 */
export interface ColumnSpecification {
	/**
	 * The name of the column
	 */
	name: string
	/**
	 * The data type for this column
	 */
	type: DatumType
}

/**
 * Interface for a data selection
 */
export interface TableSlice<T>
	extends Iterable<T | undefined>,
		MessageHubReceiver {
	/**
	 * The name of the table this slice is associated with
	 */
	table: string

	/**
	 * The type of table slice this slice represents
	 */
	slice: SliceType

	/**
	 * The current filter applied to the slice.
	 * If the slice is Selection/Highlighted, then the absense of a filter
	 * implies no rows.
	 */
	filter: FilterExpression

	/**
	 * Gets the length of the table
	 */
	length(): number

	/**
	 * Gets a row at a specified rowIndex
	 * @param rowNum The row index to retrieve
	 */
	get(index: number): T | undefined
}
