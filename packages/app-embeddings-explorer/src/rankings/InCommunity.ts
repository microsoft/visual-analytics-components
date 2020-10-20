/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { filter } from 'rxjs/operators'
import { Vertex } from '../interfaces'
import { RelatedToSelectionRanking } from './abstract/RelatedToSelection'
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

export class InCommunityRanking
	extends RelatedToSelectionRanking
	implements Ranking {
	public id = 'INCOMMUNITY'
	public label = 'In Community with Selected'
	public isVisible = true

	public connect = (): Unsubscribe => {
		const manager = this.manager!
		const vertexTable = manager.data.table<Vertex>('vertices')
		const vertexSlice = vertexTable.slice(SliceType.FilteredIn)
		setTimeout(() => this.readSlice(vertexSlice), 0)

		const subscription = manager.messages
			.pipe(filter(isReadSliceEvent))
			.subscribe(() => this.readSlice(vertexSlice))
		return (): void => subscription.unsubscribe()
	}

	private readSlice(vertexSlice: TableSlice<Vertex>): void {
		if (this.selectedVertex == null || this.selectedVertex.community == null) {
			this._groups = []
		} else {
			const communityVertices: RankedRow[] = []
			for (const vertex of vertexSlice) {
				if (
					vertex &&
					vertex.community != null &&
					vertex.community === this.selectedVertex.community
				) {
					const { id, label, community } = vertex
					communityVertices.push({
						id,
						category: community,
						label,
					})
				}
			}

			this._groups = [communityVertices]
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
