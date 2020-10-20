/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { scaleLinear } from 'd3-scale'
import { filter } from 'rxjs/operators'
import { Vertex } from '../interfaces'
import { SortOrder } from './abstract/RankingBase'
import { RelatedToSelectionRanking } from './abstract/RelatedToSelection'
import { euclideanDistance } from './util/distance'
import {
	isVertexTableChangeEvent,
	isVertexSelectionChangeEvent,
} from './util/eventPredicates'
import { setSelectedVertex, setHighlightedVertex } from './util/handlers'
import {
	Ranking,
	RankedRow,
} from '@visual-analytics-components/ranklist-component'
import {
	Message,
	SliceType,
	TableSlice,
	Unsubscribe,
} from 'visual-analytics-components'

function isReadSliceEvent(event: Message<any>): boolean {
	return isVertexTableChangeEvent(event) || isVertexSelectionChangeEvent(event)
}

export class EmbeddingNeighborsEuclidean
	extends RelatedToSelectionRanking
	implements Ranking {
	public id = 'EN_EUCLIDEAN'
	public label = 'Embedding Distance (Euclidean)'
	public isVisible = true
	public metricScale: ((input: number) => number) | undefined

	public constructor() {
		super()
		this.sortOrder = SortOrder.Ascending
	}

	public connect = (): Unsubscribe => {
		const manager = this.manager!
		const vertexTable = manager.data.table<Vertex>('vertices')
		const vertexSlice = vertexTable.slice(SliceType.FilteredIn)
		setTimeout(async () => {
			await this.readSlice(vertexSlice)
		}, 0)

		const subscription = manager.messages
			.pipe(filter(isReadSliceEvent))
			.subscribe(() => this.readSlice(vertexSlice))
		return (): void => subscription.unsubscribe()
	}

	public get isEnabled(): boolean {
		return this.selectedVertex && this.selectedVertex.embeddings
	}

	public set isEnabled(_value: boolean) {
		// no
	}

	private readSlice = (slice: TableSlice<Vertex>): void => {
		const rows: RankedRow[] = []
		let minValue = Number.MAX_SAFE_INTEGER
		let maxValue = Number.MIN_SAFE_INTEGER
		let numMetrics = 0

		for (const vertex of slice) {
			if (vertex && vertex.embeddings) {
				const { id, community, label } = vertex as any
				const metric = euclideanDistance(vertex as any, this.selectedVertex as any)
				if (metric != null && !Number.isNaN(metric)) {
					minValue = Math.min(minValue, metric)
					maxValue = Math.max(maxValue, metric)
					numMetrics++
					rows.push({
						id,
						category: community,
						label,
						metric,
					})
				}
			}
		}

		if (numMetrics > 0) {
			this.metricScale = scaleLinear().domain([minValue, maxValue]) as (
				input: number,
			) => number
		}
		this._groups = [rows]
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
