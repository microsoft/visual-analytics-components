/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Subject, Observable } from 'rxjs'
import {
	Ranking,
	RankedRow,
} from '@visual-analytics-components/ranklist-component'
import { Manager, Unsubscribe, NO_OP } from 'visual-analytics-components'

export enum SortOrder {
	Ascending = 'asc',
	Descending = 'desc',
}

export abstract class RankingBase implements Ranking {
	public abstract id: string
	public abstract label: string
	public abstract isVisible: boolean
	public abstract isEnabled: boolean
	public abstract connect(): Unsubscribe
	protected sortOrder: SortOrder = SortOrder.Descending

	protected manager: Manager | undefined

	public initialize(manager: Manager): Unsubscribe {
		this.manager = manager
		return NO_OP
	}

	protected _groups: RankedRow[][] = []
	protected onChangeSubject = new Subject<void>()

	public set groups(value: RankedRow[][]) {
		this._groups = value.map(v =>
			v.sort((a, b) => {
				const aMet = a.metric || 0
				const bMet = b.metric || 0
				return this.sortOrder === SortOrder.Descending ? bMet - aMet : aMet - bMet
			}),
		)
	}
	public get groups(): RankedRow[][] {
		return this._groups
	}

	public get onChange(): Observable<void> {
		return this.onChangeSubject
	}
}
