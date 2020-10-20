/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	Ranking,
	RankedRow,
} from '@visual-analytics-components/ranklist-component'
import { scaleLinear } from 'd3-scale'
import { filter } from 'rxjs/operators'
import {
	Message,
	SliceType,
	TableSlice,
	Unsubscribe,
} from 'visual-analytics-components'
import { Edge, Vertex } from '../interfaces'
import { RelatedToSelectionRanking } from './abstract/RelatedToSelection'
import {
	isVertexTableChangeEvent,
	isVertexSelectionChangeEvent,
} from './util/eventPredicates'
import { setSelectedVertex, setHighlightedVertex } from './util/handlers'

function isReadSliceEvent(event: Message<any>): boolean {
	return isVertexTableChangeEvent(event) || isVertexSelectionChangeEvent(event)
}

export class NeighborsRanking extends RelatedToSelectionRanking
	implements Ranking {
	public id = 'NEIGHBORS'
	public label = 'Neighbors of Selected'
	public isVisible = true
	public metricScale: ((input: number) => number) | undefined

	public connect = (): Unsubscribe => {
		const manager = this.manager!
		const vertexTable = manager.data.table<Vertex>('vertices')
		const edgeTable = manager.data.table<Edge>('edges')
		const vertexSlice = vertexTable.slice(SliceType.FilteredIn)
		const edgeSlice = edgeTable.slice(SliceType.FilteredIn)
		setTimeout(() => this.readSlice(edgeSlice, vertexSlice), 0)

		const subscription = manager.messages
			.pipe(filter(isReadSliceEvent))
			.subscribe(() => this.readSlice(edgeSlice, vertexSlice))
		return (): void => subscription.unsubscribe()
	}

	private readSlice(
		edgeSlice: TableSlice<Edge>,
		vertexSlice: TableSlice<Vertex>,
	): void {
		const selectedVertexId = this.selectedVertex && this.selectedVertex.id
		if (this.selectedVertex == null) {
			this.groups = []
		} else {
			const neighborVertices: Record<string, RankedRow[]> = {}
			const neighbors = new Set<string>()
			const neighborWeights = new Map<string, number>()
			let minWeight = Number.MAX_SAFE_INTEGER
			let maxWeight = Number.MIN_SAFE_INTEGER

			for (const edge of edgeSlice) {
				if (edge) {
					const { source, target, weight } = edge
					if (source === selectedVertexId) {
						neighbors.add(target)
						neighborWeights.set(target, weight)
						minWeight = Math.min(minWeight, weight)
						maxWeight = Math.max(maxWeight, weight)
					} else if (target === selectedVertexId) {
						neighbors.add(source)
						neighborWeights.set(source, weight)
						minWeight = Math.min(minWeight, weight)
						maxWeight = Math.max(maxWeight, weight)
					}
				}
			}

			// TODO: this could be faster if we implemented lookup by index in the TableSlice
			for (const vertex of vertexSlice) {
				if (vertex && neighbors.has(vertex.id)) {
					const { id, label, community } = vertex
					if (!neighborVertices[community]) {
						neighborVertices[community] = []
					}
					neighborVertices[community].push({
						id,
						category: community,
						label,
						metric: neighborWeights.get(vertex.id),
					})
				}
			}

			this.metricScale = scaleLinear().domain([minWeight, maxWeight]) as (input: number) => number
			this._groups = Object.values(neighborVertices)
		}

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
