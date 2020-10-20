/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { filter } from 'rxjs/operators'
import { Vertex } from '../interfaces'
import { RankingBase } from './abstract/RankingBase'
import { isVertexTableChangeEvent } from './util/eventPredicates'
import { setSelectedVertex, setHighlightedVertex } from './util/handlers'
import {
	Ranking,
	RankedRow,
} from '@visual-analytics-components/ranklist-component'
import { SliceType, TableSlice, Unsubscribe } from 'visual-analytics-components'

export class VerticesRanking extends RankingBase implements Ranking {
	public id = 'VERTICES'
	public label = 'Vertex List'
	public isVisible = true
	public isEnabled = true

	public connect = (): Unsubscribe => {
		const manager = this.manager!
		const vertexTable = manager.data.table<Vertex>('vertices')
		const slice = vertexTable.slice(SliceType.FilteredIn)
		setTimeout(() => this.readSlice(slice), 0)

		const subscription = manager.messages
			.pipe(filter(isVertexTableChangeEvent))
			.subscribe(() => this.readSlice(slice))
		return (): void => subscription.unsubscribe()
	}

	private readSlice(slice: TableSlice<Vertex>): void {
		const rows: Record<string, RankedRow[]> = {}
		for (const vertex of slice) {
			const { id, community, label } = vertex as any
			if (!rows[community]) {
				rows[community] = []
			}
			rows[community].push({
				id,
				category: community,
				label,
			})
		}
		this.groups = Object.values(rows)
		this.onChangeSubject.next()
	}

	/**
	 * When a vertex row is clicked, mark it as selected in the selection slice
	 */
	public handleClick = (row: RankedRow): void => {
		setSelectedVertex(row.id, row.label || row.id, this.manager!)
	}

	/**
	 * When a vertex row is hovered, mark it as selected in the highlight slice
	 */
	public handleHover = (row: RankedRow): void => {
		setHighlightedVertex(row.id, this.manager!)
	}
}
