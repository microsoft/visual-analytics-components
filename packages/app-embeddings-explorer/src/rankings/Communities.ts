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
import { SliceType, TableSlice, Unsubscribe } from 'visual-analytics-components'
import { Community } from '../interfaces'
import { RankingBase } from './abstract/RankingBase'
import { isVertexTableChangeEvent } from './util/eventPredicates'
import { filterToVerticesInCommunity } from './util/handlers'

export class CommunityRanking extends RankingBase implements Ranking {
	public id = 'COMMUNITIES'
	public label = 'Community List'
	public isVisible = true
	public isEnabled = true
	public metricScale: ((input: number) => number) | undefined
	public submetricScale: ((input: number) => number) | undefined

	public connect = (): Unsubscribe => {
		const manager = this.manager!
		const vertexTable = manager.data.table<Community>('communities')
		const slice = vertexTable.slice(SliceType.FilteredIn)
		setTimeout(() => this.readSlice(slice), 0)

		const subscription = manager.messages
			.pipe(filter(isVertexTableChangeEvent))
			.subscribe(() => this.readSlice(slice))
		return (): void => subscription.unsubscribe()
	}

	private readSlice(slice: TableSlice<Community>): void {
		const rows: RankedRow[] = []
		let minSize = Number.MAX_SAFE_INTEGER
		let maxSize = Number.MIN_SAFE_INTEGER
		let minCoverage = Number.MAX_SAFE_INTEGER
		let maxCoverage = Number.MIN_SAFE_INTEGER
		let numSizedCommunities = 0
		let numCoverageCommunities = 0

		for (const community of slice) {
			const { id, label, size, integrity } = community as any

			if (size != null) {
				minSize = Math.min(minSize, size)
				maxSize = Math.max(maxSize, size)
				numSizedCommunities++
			}
			if (integrity != null) {
				minCoverage = Math.min(minCoverage, integrity)
				maxCoverage = Math.max(maxCoverage, integrity)
				numCoverageCommunities++
			}
			rows.push({
				id,
				category: id,
				label,
				metric: size,
				submetric: integrity,
			})
		}

		if (numSizedCommunities > 0) {
			this.metricScale = scaleLinear().domain([minSize, maxSize]) as (input: number) => number
		}

		if (numCoverageCommunities > 0) {
			this.submetricScale = scaleLinear().domain([0, 1]) as (input: number) => number
		}

		this.groups = [rows]
		this.onChangeSubject.next()
	}

	/**
	 * When a community row is clicked, filter the vertex list down to vertices in that community
	 * @param row The community row benig clicked
	 */
	public handleClick = (row: RankedRow): void => {
		filterToVerticesInCommunity(row.id, this.manager!)
	}
}
