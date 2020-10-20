/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { storiesOf } from '@storybook/react'
import { scaleLinear } from 'd3-scale'
import React from 'react'
import { Observable, Subject } from 'rxjs'
import { filter } from 'rxjs/operators'
import styled from 'styled-components'
import { createManager, lesMisDataset } from './util'
import { Edge } from '@visual-analytics-components/graph-component'
import {
	RankListComponent,
	Ranking,
	RankedRow,
	Configuration as RLConfig,
} from '@visual-analytics-components/ranklist-component'
import { ManagerContext } from '@visual-analytics-components/react'
import { SearchComponent } from '@visual-analytics-components/search-component'
import {
	Message,
	SliceType,
	TableSlice,
	Unsubscribe,
	MessageTypes,
	Manager,
	DataChangedMessagePayload,
	NO_OP,
} from 'visual-analytics-components'

storiesOf('Ranklist Component', module).add('basic example', () => {
	return (
		<Frame>
			<ManagerContext.Provider value={createManager(lesMisDataset())}>
				<SearchComponent
					configuration={{ scope: 'search-for-stuff' }}
					style={{ height: 35, marginBottom: 8 }}
				/>
				<RankListComponent configuration={rankListConfig} />
			</ManagerContext.Provider>
		</Frame>
	)
})

const Frame = styled.div`
	width: 1024px;
	height: 768px;
`

interface Vertex {
	label: string
}

abstract class BaseRank<Item> implements Ranking {
	public abstract id: string
	public abstract label: string
	public isVisible = true
	public isEnabled = true
	public changes = new Subject<void>()
	public get onChange(): Observable<void> {
		return this.changes
	}
	public groups: RankedRow[][] = []
	public metricScale?: (input: number) => number
	public manager: Manager | undefined

	public initialize(manager: Manager): Unsubscribe {
		this.manager = manager
		return NO_OP
	}

	public connect(): Unsubscribe {
		const manager = this.manager!
		const table = manager.data.table<Item>(this.id).slice(SliceType.FilteredIn)
		const rebuild = (): void => this.rebuild(table)
		setTimeout(rebuild, 0)
		const subscription = manager.messages
			.pipe(filter(isTableChangeEvent(this.id)))
			.subscribe(rebuild)
		return (): void => subscription.unsubscribe()
	}

	protected abstract rebuild(table: TableSlice<Item>): void
}

class NodeRank extends BaseRank<Vertex> {
	public id = 'nodes'
	public label = 'Node List'

	protected rebuild(table: TableSlice<Vertex>): void {
		const rows: RankedRow[] = []
		let minValue = Number.MAX_SAFE_INTEGER
		let maxValue = Number.MIN_SAFE_INTEGER
		for (const row of table) {
			const value = row?.label.length || 0
			minValue = Math.min(minValue, value)
			maxValue = Math.max(maxValue, value)
			rows.push({
				id: row!.label,
				label: row!.label,
				category: 0,
				metric: value,
			})
		}

		this.metricScale = scaleLinear().domain([minValue, maxValue])

		this.groups = [rows]
		this.changes.next()
	}
}

class EdgeRank extends BaseRank<Edge> {
	public id = 'edges'
	public label = 'Edge List'

	protected rebuild(table: TableSlice<Edge>): void {
		const rows: RankedRow[] = []
		let minValue = Number.MAX_SAFE_INTEGER
		let maxValue = Number.MIN_SAFE_INTEGER
		for (const row of table) {
			minValue = Math.min(minValue, row?.weight || 0)
			maxValue = Math.max(maxValue, row?.weight || 0)
			const id = `${row!.source}->${row!.target}`
			rows.push({
				id,
				label: id,
				category: 0,
				metric: row!.weight,
			})
		}

		this.metricScale = scaleLinear().domain([minValue, maxValue])

		this.groups = [rows]
		this.changes.next()
	}
}

const isTableChangeEvent = (name: string) => (
	evt: Message<unknown>,
): boolean => {
	if (evt.type === MessageTypes.Data.Changed) {
		const changeEvt = evt.payload as DataChangedMessagePayload
		if (changeEvt.slice === SliceType.FilteredIn && changeEvt.table === name) {
			return true
		}
	}
	return false
}

const rankListConfig: RLConfig = {
	rankings: [new EdgeRank(), new NodeRank()],
	searchScope: 'search-for-stuff',
}
