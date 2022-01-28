/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { FieldMapping } from '@visual-analytics-components/types'
import { set, get } from 'lodash'

/**
 * Class that performs row-mapping duties,
 * given a Table Shape schema and a map to data field names.
 * Source refers to the Table Shape schema,
 * while Target refers to the Field Mapping schema (from e.g. a data-map).
 */
export class RowMapper {
	private reverseMappings: Record<string, string> = {}

	public constructor(protected mapping: FieldMapping) {
		Object.keys(mapping).forEach(targetField => {
			const sourceField = mapping[targetField]
			this.reverseMappings[sourceField] = targetField
		})
		this.mapRow = this.mapRow.bind(this)
	}

	/**
	 * Given a Row in the target schema, returns a Row in the source schema.
	 */
	public mapRow<S, T>(row: S): T {
		const result: Record<string, any> = {}

		// Accessors for original row properties
		Object.keys(row).forEach(fieldName => {
			Object.defineProperty(result, fieldName, {
				enumerable: true,
				configurable: true,
				get: () => (row as Record<string, any>)[fieldName],
				set: (value: unknown) => {
					(row as Record<string, any>)[fieldName] = value
				},
			})
		})

		// Accessors for mapped properties
		Object.keys(this.mapping).forEach(fieldName => {
			const fieldMapping = this.mapTargetName(fieldName)
			Object.defineProperty(result, fieldName, {
				enumerable: true,
				configurable: true,
				get: () => get(row, fieldMapping),
				set: (value: unknown) => {
					set(row as Record<string, any>, fieldMapping, value)
				},
			})
		})
		return result as T
	}

	/**
	 * Given a field name from the source schema,
	 * returns the corresponding the target schema field name.
	 */
	public mapSourceName(field: string): string {
		return this.reverseMappings[field] || field
	}

	/**
	 * Given a field name from the target schema,
	 * returns the corresponding the source schema field name.
	 */
	public mapTargetName(field: string): string {
		return this.mapping[field] || field
	}
}
