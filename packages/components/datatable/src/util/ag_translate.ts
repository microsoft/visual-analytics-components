/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ColDef } from 'ag-grid-community'
import {
	BooleanClause,
	DatumType,
	ColumnSpecification,
	FilterClause,
	BooleanOperation,
	FilterOperation,
} from 'visual-analytics-components'

import {
	AGFilter,
	AGFilterCondition,
	AGCombinedFilter,
	AGFieldFilter,
} from './ag_interfaces'

export function transformColumnDefinitionsIntoAgGrid(
	columns: ColumnSpecification[],
): ColDef[] {
	return columns
		.filter(
			// ignore columns that are objects or arrays. They introduce systematic
			// complexities WRT filtering and sorting, and they will slow down the
			// app by possibly blowing up the DOM weight with large structures.
			c =>
				c.type === DatumType.String ||
				c.type === DatumType.Number ||
				c.type === DatumType.Date ||
				c.type === DatumType.Boolean,
		)
		.map(({ name, type }: ColumnSpecification) => ({
			headerName: name,
			field: name,
			sortable: false, // TODO
			filter: translateColumnTypeIntoAgFilterType(type),
			type: translateColumnTypeIntoAgColumnType(type),
		}))
}

function getColumnNameSet(
	columns: ColumnSpecification[],
): Record<string, boolean> {
	const columnNameMap: Record<string, boolean> = {}
	columns.forEach(c => (columnNameMap[c.name] = true))
	return columnNameMap
}

function resolveFieldName(
	fieldName: string,
	knownColumnNames: Record<string, boolean>,
): string {
	// HACK: Ag-Grid will append a suffix to the fieldName (e.g. _1) when we
	// switch between tables that share a field in common (e.g. 'weight' in
	// graph tables). We do this to map back to the original fieldName.
	//
	// Our strategy to find the original fieldname is to consider field names
	// that the ag-field starts with and then select the longest of those
	// candidates.
	//
	if (!knownColumnNames[fieldName]) {
		let longest = ''
		Object.keys(knownColumnNames).forEach(candidate => {
			if (fieldName.startsWith(candidate) && candidate.length > longest.length) {
				longest = candidate
			}
		})
		return longest
	} else {
		return fieldName
	}
}

export function translateAgGridFilter(
	filter: AGFilter,
	columns: ColumnSpecification[],
): BooleanClause {
	const result: BooleanClause = { operation: BooleanOperation.AND, clauses: [] }

	// Determine what column names exist in the source table.
	const knownColumnNames = getColumnNameSet(columns)

	Object.keys(filter).forEach(fieldName => {
		const fieldFilter = filter[fieldName]
		fieldName = resolveFieldName(fieldName, knownColumnNames)
		if ((fieldFilter as any).operator) {
			const booleanFieldFilter = fieldFilter as AGCombinedFilter<any>
			// Compound Operator
			const cond1 = translateAgFilterItem(fieldName, booleanFieldFilter.condition1)
			const cond2 = translateAgFilterItem(fieldName, booleanFieldFilter.condition2)
			if (booleanFieldFilter.operator === 'OR') {
				result.clauses.push({
					operation: BooleanOperation.OR,
					clauses: [cond1, cond2],
				})
			} else {
				result.clauses.push(cond1, cond2)
			}
		} else {
			const directFieldFilter = fieldFilter as AGFieldFilter<any>
			result.clauses.push(translateAgFilterItem(fieldName, directFieldFilter))
		}
	})
	return result
}

function translateAgFilterItem(
	field: string,
	filter: AGFieldFilter<any>,
): FilterClause {
	return {
		field,
		value: filter.filter,
		operation: translateAgFilterConditionIntoDV(filter.type)!,
	}
}

export function translateColumnTypeIntoAgColumnType(
	columnType: DatumType,
): string | undefined {
	switch (columnType) {
		case DatumType.String:
			return undefined
		case DatumType.Number:
			return 'numericColumn'
		case DatumType.Date:
			return 'dateColumn'
		default:
			return undefined
	}
}

export function translateColumnTypeIntoAgFilterType(
	columnType: DatumType,
): string | boolean | undefined {
	switch (columnType) {
		case DatumType.String:
			return true
		case DatumType.Number:
			return 'agNumberColumnFilter'
		case DatumType.Date:
			return 'agDateColumnFilter'
		default:
			return undefined
	}
}

export function translateAgFilterConditionIntoDV(
	filterType: AGFilterCondition,
): FilterOperation | undefined {
	switch (filterType) {
		case AGFilterCondition.Contains:
			return FilterOperation.Contains
		case AGFilterCondition.NotContains:
			return FilterOperation.NotContains
		case AGFilterCondition.StartsWith:
			return FilterOperation.StartsWith
		case AGFilterCondition.EndsWith:
			return FilterOperation.EndsWith
		case AGFilterCondition.Equals:
			return FilterOperation.Equal
		case AGFilterCondition.NotEqual:
			return FilterOperation.NotEqual
		case AGFilterCondition.GreaterThan:
			return FilterOperation.GreaterThan
		case AGFilterCondition.GreaterThanOrEqual:
			return FilterOperation.GreaterThanOrEqual
		case AGFilterCondition.LessThan:
			return FilterOperation.LessThan
		case AGFilterCondition.LessThanOrEqual:
			return FilterOperation.LessThanOrEqual
		default:
			return undefined
	}
}
