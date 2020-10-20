/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { PlainObjectTable } from './PlainObjectTable'
import {
	DataSet,
	Table,
	ColumnSpecification,
	MessageHub,
} from '@visual-analytics-components/types'

export interface TableData {
	columns: ColumnSpecification[]
	data: any[]
}

export class PlainObjectDataSet implements DataSet {
	public readonly tables: string[] = []
	private tableInstances: Record<string, Table<unknown>> = {}

	public constructor(tables: Record<string, TableData>) {
		Object.keys(tables).forEach(tableName => {
			this.tables.push(tableName)
			this.tableInstances[tableName] = new PlainObjectTable(
				tableName,
				tables[tableName],
			)
		})
	}

	public receiveMessageHub(messageHub: MessageHub): void {
		Object.keys(this.tableInstances).forEach(tableName =>
			this.tableInstances[tableName].receiveMessageHub(messageHub),
		)
	}

	public table<T>(name: string): Table<T> {
		return this.tableInstances[name] as Table<T>
	}
}
