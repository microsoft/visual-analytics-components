/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Ranking } from '@visual-analytics-components/ranklist-component'
import { filter } from 'rxjs/operators'
import {
	SliceType,
	Unsubscribe,
	TableSlice,
	Manager,
} from 'visual-analytics-components'
import { Vertex } from '../../interfaces'
import { isVertexSelectionChangeEvent } from '../util/eventPredicates'
import { RankingBase } from './RankingBase'

export abstract class RelatedToSelectionRanking
	extends RankingBase
	implements Ranking
{
	public abstract id: string
	public abstract connect(): Unsubscribe

	protected selectedVertex: Record<string, any> | undefined

	public initialize(manager: Manager): Unsubscribe {
		super.initialize(manager)
		const vertexTable = manager.data.table<Vertex>('vertices')
		const vertexSlice = vertexTable.slice(SliceType.Selected)

		setTimeout(async () => {
			await this.readSelection(vertexSlice)
		}, 0)
		const subscription = manager.messages
			.pipe(filter(isVertexSelectionChangeEvent))
			.subscribe(() => this.readSelection(vertexSlice))
		return (): void => subscription.unsubscribe()
	}

	private async readSelection(vertexSlice: TableSlice<Vertex>): Promise<void> {
		const numRows = await vertexSlice.length()
		if (numRows > 0) {
			const firstRow = await vertexSlice.get(0)
			this.selectedVertex = firstRow
			this.onChangeSubject.next()
		} else {
			this.selectedVertex = undefined
			this.onChangeSubject.next()
		}
	}

	public get isEnabled(): boolean {
		return this.selectedVertex != null
	}

	public set isEnabled(_value: boolean) {
		// no
	}
}
