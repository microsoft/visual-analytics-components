/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	DataSet,
	Table,
	DataMapping,
	MessageHub,
} from '@visual-analytics-components/types'
import { MappedTable } from './MappedTable'

/**
 * Class that applies a data-map to a DataSet
 */
export class MappedDataSet implements DataSet {
	public readonly tables: string[] = []
	private tablesInstances: Record<string, Table<unknown>> = {}

	public constructor(private source: DataSet, mapping: DataMapping) {
		// Load the source tables into the tableset
		source.tables.forEach(sourceTableName => {
			this.tablesInstances[sourceTableName] = source.table(sourceTableName)
		})

		// Load the mapped tables, possibly overriding source tables
		Object.keys(mapping).forEach(mappedTableName => {
			const tableMapping = mapping[mappedTableName]
			const sourceTableName = tableMapping.table || mappedTableName
			const sourceTable = source.table(sourceTableName)
			if (!sourceTable) {
				throw new Error(
					`could not find table ${sourceTableName} in (${source.tables.join(',')})`,
				)
			}
			this.tablesInstances[mappedTableName] = new MappedTable(
				mappedTableName,
				tableMapping.fields,
				sourceTable,
			)
		})
		this.tables = Object.keys(this.tables)
	}

	public receiveMessageHub(hub: MessageHub): void {
		this.source.receiveMessageHub(hub)
	}

	public table<T>(name: string): Table<T> {
		return this.tablesInstances[name] as Table<T>
	}
}
