/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	FilterOperation,
	FilterExpression,
	FilterClause,
	BooleanOperation,
	BooleanClause,
} from '@visual-analytics-components/types'

export function applyFilterExpression<T>(
	data: T[],
	expression: FilterExpression,
	noFilterNoData?: boolean,
): T[] {
	// for the selection and highlight slices, the absence of a filter means that no data
	// should be present.
	if (Object.keys(expression.expressions).length === 0 && noFilterNoData) {
		return []
	}
	return data.filter(d => applyExpressionToDatum(d, expression))
}

export function applyInverseFilterExpression<T>(
	data: T[],
	expression: FilterExpression,
	noFilterNoData?: boolean,
): any[] {
	if (Object.keys(expression.expressions).length === 0 && noFilterNoData) {
		return data
	}
	return data.filter(d => !applyExpressionToDatum(d, expression))
}

function applyExpressionToDatum<T>(
	d: T,
	{ expressions, operation }: FilterExpression,
): boolean {
	const clauses = Object.values(expressions)
	// convert the top-level filter to a boolean expression and apply it
	return applyBooleanClauseToDatum(d, {
		clauses,
		operation,
	})
}

function applyExpressionClauseToDatum<T>(
	d: T,
	expr: BooleanClause | FilterClause,
): boolean {
	if ((expr as BooleanClause).clauses) {
		return applyBooleanClauseToDatum(d, expr as BooleanClause)
	} else {
		return applyFilterClauseToDatum(d, expr as FilterClause)
	}
}

function applyBooleanClauseToDatum<T>(d: T, expr: BooleanClause): boolean {
	for (const clause of expr.clauses) {
		const result = applyExpressionClauseToDatum(d, clause)
		if (expr.operation === BooleanOperation.AND) {
			if (!result) {
				// short-circuit if a clause item fails, since the ANDed expression cannot be true
				return false
			}
		} else {
			if (result) {
				// short circuit if the clause item passes, since the ORed expression must be true
				return true
			}
		}
	}
	return expr.operation === BooleanOperation.AND
}

function applyFilterClauseToDatum<T>(
	datum: T,
	{ operation, field, value }: FilterClause,
): boolean {
	if (!datum) {
		return false
	}
	const testValue = (datum as any)[field]

	switch (operation) {
		case FilterOperation.Contains:
			return contains(testValue, value)
		case FilterOperation.NotContains:
			return !contains(testValue, value)
		case FilterOperation.Equal:
			return equals(testValue, value)
		case FilterOperation.NotEqual:
			return !equals(testValue, value)
		case FilterOperation.In:
			return isIn(testValue, value)
		case FilterOperation.NotIn:
			return !isIn(testValue, value)
		case FilterOperation.GreaterThan:
			return testValue > value
		case FilterOperation.GreaterThanOrEqual:
			return testValue >= value
		case FilterOperation.LessThan:
			return testValue < value
		case FilterOperation.LessThanOrEqual:
			return testValue <= value
		default:
			throw new Error(`unhandled filter operation ${operation}`)
	}
}

function arrayContainsValue<T>(testValue: T[], value: T): boolean {
	return testValue.indexOf(value) > -1
}

function stringContainsValue(testValue: string, value: string): boolean {
	return testValue.toLowerCase().indexOf(value.toLowerCase()) > -1
}

function contains<T>(testValue: T, value: T): boolean {
	if (Array.isArray(testValue)) {
		return arrayContainsValue(testValue, value)
	} else if (typeof testValue === 'string' && typeof value === 'string') {
		return stringContainsValue(testValue, value)
	} else {
		return stringContainsValue(`${testValue}`, `${value}`)
	}
}

function equals<T>(testValue: T, value: T): boolean {
	if (Array.isArray(testValue) && Array.isArray(value)) {
		if (testValue.length !== value.length) {
			return false
		}
		return testValue.every((v, i) => value[i] === v)
	} else if (!Array.isArray(testValue) && !Array.isArray(value)) {
		return testValue === value
	} else {
		return false
	}
}

function isIn<T>(testValue: T, value: T): boolean {
	if (Array.isArray(value)) {
		return value.indexOf(testValue) > -1
	} else if (typeof value === 'string' && typeof testValue === 'string') {
		return value.toLowerCase().indexOf(testValue.toLowerCase()) > -1
	}
	return false
}
