/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { SliceType } from './dataset'

export enum BooleanOperation {
	AND = 'and',
	OR = 'or',
}

export enum FilterOperation {
	/**
	 * Indicates that string-based values contains the given value, or that
	 * collection-based values contain the given value
	 */
	Contains = 'contains',

	/**
	 * Indicates that string-based values dose not contain the given value, or that
	 * collection-based values do not contain the given value
	 */
	NotContains = 'not_contains',

	/**
	 * Indicates that the row value is part of the given array of values
	 */
	In = 'in',

	/**
	 * Indicates that row value is not in the given array of values
	 */
	NotIn = 'not_in',

	/**
	 * Filters for rows where the target field equals the value
	 */
	Equal = 'equal',

	/**
	 * Filters for rows where the target field is not equal to the value
	 */
	NotEqual = 'not_equal',

	/**
	 * Filters for rows where the value is greater than the given value
	 */
	GreaterThan = 'greater_than',

	/**
	 * Filters for rows where the value is greater than the given value
	 */
	GreaterThanOrEqual = 'greater_than_or_equal',

	/**
	 * Filters for rows where the value is less than the given value
	 */
	LessThan = 'less_than',

	/**
	 * Filters for rows where the value is less than the given value
	 */
	LessThanOrEqual = 'less_than_or_equal',

	/**
	 * Filters for rows where the string value starts with the given value
	 */
	StartsWith = 'starts_with',

	/**
	 * Filters for rows where the string value ends with the given value
	 */
	EndsWith = 'ends_with',
}

export interface FilterExpression {
	expressions: Record<string, BooleanClause | FilterClause>
	operation: BooleanOperation
}

/**
 * An filter expression for a field value
 */
export interface FilterClause {
	/**
	 * The name of the field this filter applies to
	 */
	field: string

	/**
	 * The value to use to filter the field
	 */
	value: any

	/**
	 * The operation to perform
	 */
	operation: FilterOperation
}

export interface BooleanClause {
	clauses: (BooleanClause | FilterClause)[]
	operation: BooleanOperation
}

/**
 * Interface used when specifying cooperative filters.
 * Specifies a table to filter and an identifier for (this section of) the filter.
 */
export interface FilterLocation {
	/**
	 * The table this filter applies to
	 */
	table: string

	/**
	 * An identifier for this filter. If undefined, then this is the entire filter.
	 * If defined, this allows multiple vac components to specify cooperative filter
	 * sections.
	 */
	key?: string
}

/**
 * Utility to create a Filter Clause for explicit row selection
 * @param field Name of the field to select on
 * @param ids Row IDs to select
 */
export function makeSelectionFilter(
	field: string,
	ids: string[] | number[],
): FilterClause {
	return {
		field,
		operation: FilterOperation.In,
		value: ids,
	}
}

export interface UpdateFilterMessagePayload {
	location: FilterLocation
	filter: BooleanClause | FilterClause
}

export type ClearSliceMessagePayload = FilterLocation

export interface DataChangedMessagePayload {
	table: string
	slice: SliceType
}

export interface ExecuteSearchMessagePayload {
	value: string
	searchScope?: string
}
