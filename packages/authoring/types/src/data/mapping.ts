/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

/**
 * Interface for a dataset mapping
 */
export interface DataMapping {
	/**
	 * Maps a target tablename to a table mapping
	 */
	[tableName: string]: TableMapping
}

/**
 * A data mapping for a table
 */
export interface TableMapping {
	/**
	 * The source table name this table should map to
	 */
	table?: string

	/**
	 * The field mappings for this table
	 */
	fields?: FieldMapping
}

export interface FieldMapping {
	/**
	 * The path to locate data, either per row or in a result object.
	 * e.g.
	 * 'my_attribute'
	 * 'my_list_attribute[0]'
	 * 'my_object_attribute.sub_attribute'
	 */
	[targetField: string]: string
}
