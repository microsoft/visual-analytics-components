/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export interface AGCombinedFilter<T> {
	operator: 'AND' | 'OR'
	condition1: AGFieldFilter<T>
	condition2: AGFieldFilter<T>
}

export enum AGFilterCondition {
	Equals = 'equals',
	NotEqual = 'notEqual',
	Contains = 'contains',
	StartsWith = 'startsWith',
	EndsWith = 'endssWith',
	NotContains = 'notContains',

	// Numeric Comparators
	LessThan = 'lessThan',
	LessThanOrEqual = 'lessThanOrEqual',
	GreaterThan = 'greaterThan',
	GreaterThanOrEqual = 'greaterThanOrEqual',
}

export enum AGFilterDataType {
	Text = 'text',
	Number = 'number',
}

export interface AGFilter {
	[fieldName: string]: AGFieldFilter<any> | AGCombinedFilter<any>
}

export interface AGFieldFilter<T> {
	filter: T
	filterTo?: T
	filterType: AGFilterDataType
	type: AGFilterCondition
}
