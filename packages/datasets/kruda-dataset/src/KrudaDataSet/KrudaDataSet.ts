/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DataSet, MessageHub, Table } from 'visual-analytics-components'

export class KrudaDataSet implements DataSet {
	public readonly tables: string[] = []
	private tableInstances: Record<string, Table<unknown>> = {}

	public constructor(tables: Record<string, Table<unknown>>) {
		this.tableInstances = tables
		Object.keys(tables).forEach(tableName => {
			this.tables.push(tableName)
			this.tableInstances[tableName] = tables[tableName]
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
