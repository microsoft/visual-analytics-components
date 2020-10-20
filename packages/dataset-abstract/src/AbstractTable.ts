/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	MessageTypes,
	MessageCreators,
} from '@visual-analytics-components/messages'
import {
	Message,
	Table,
	ColumnSpecification,
	SliceType,
	MessageHub,
	ClearSliceMessagePayload,
	UpdateFilterMessagePayload,
	FilterLocation,
	FilterExpression,
} from '@visual-analytics-components/types'
import { filter } from 'rxjs/operators'
import { AbstractTableSlice } from './AbstractTableSlice'

export abstract class AbstractTable<T, TableSlice extends AbstractTableSlice<T>>
	implements Table<T> {
	protected messageHub: MessageHub | undefined

	protected noFilterNoData: Record<SliceType, boolean> = {
		[SliceType.FilteredOut]: true,
		[SliceType.Selected]: true,
		[SliceType.Highlighted]: true,
		[SliceType.All]: false,
		[SliceType.FilteredIn]: false,
	}

	protected constructor(
		public readonly name: string,
		public readonly columns: ColumnSpecification[],
	) {}

	public receiveMessageHub(messageHub: MessageHub): void {
		this.messageHub = messageHub
		this.handleSliceEvents(messageHub)

		// pass messagehub to slices
		Object.keys(this.slices).forEach(key =>
			this.slices[key].receiveMessageHub(messageHub),
		)
	}

	private handleSliceEvents(messageHub: MessageHub): void {
		// #region message predicates
		const isReplaceSelectionMessage = (
			event: Message<UpdateFilterMessagePayload>,
		): boolean =>
			event.type === MessageTypes.Selection.Replace &&
			event.payload!.location.table === this.name

		const isClearSelectionMessage = (
			event: Message<ClearSliceMessagePayload>,
		): boolean =>
			event.type === MessageTypes.Selection.Clear &&
			event.payload!.table === this.name

		const isReplaceHighlightMessage = (
			event: Message<UpdateFilterMessagePayload>,
		): boolean =>
			event.type === MessageTypes.Highlight.Replace &&
			event.payload!.location.table === this.name

		const isClearHighlightMessage = (
			event: Message<ClearSliceMessagePayload>,
		): boolean =>
			event.type === MessageTypes.Highlight.Clear &&
			event.payload!.table === this.name

		const isReplaceFilterMessage = (
			event: Message<UpdateFilterMessagePayload>,
		): boolean =>
			event.type === MessageTypes.Filter.Replace &&
			event.payload!.location.table === this.name

		const isClearFilterMessage = (
			event: Message<ClearSliceMessagePayload>,
		): boolean =>
			event.type === MessageTypes.Filter.Clear &&
			event.payload!.table === this.name

		// #endregion

		// Get the data slices by type
		const filteredIn = this.slices[SliceType.FilteredIn]
		const filteredOut = this.slices[SliceType.FilteredOut]

		const refreshFilter = async (): Promise<void> => {
			await Promise.all([
				this.applyDataFilter(filteredIn),
				this.applyInverseDataFilter(filteredOut, filteredIn.filter),
			])
			this.messageHub!.publish(
				MessageCreators.Data.changed(this.name, SliceType.FilteredIn),
			)
		}

		const refreshSliceData = async (sliceType: SliceType): Promise<void> => {
			await this.applyDataFilter(this.slices[sliceType])
			this.messageHub!.publish(MessageCreators.Data.changed(this.name, sliceType))
		}

		const replaceSliceFilter = (
			sliceType: SliceType,
			{ location, filter }: UpdateFilterMessagePayload,
		): void => {
			this.slices[sliceType].setFilter(location.key, filter)
		}

		const clearSliceFilter = (
			sliceType: SliceType,
			location: FilterLocation,
		): void => {
			this.slices[sliceType].clearFilter(location.key)
		}

		// Selections
		messageHub.messages
			.pipe(filter(isReplaceSelectionMessage))
			.subscribe((evt: Message<UpdateFilterMessagePayload>) => {
				replaceSliceFilter(SliceType.Selected, evt.payload!)
				refreshSliceData(SliceType.Selected)
			})
		messageHub.messages
			.pipe(filter(isClearSelectionMessage))
			.subscribe((evt: Message<ClearSliceMessagePayload>) => {
				clearSliceFilter(SliceType.Selected, evt.payload!)
				refreshSliceData(SliceType.Selected)
			})

		// Filter
		messageHub.messages
			.pipe(filter(isReplaceFilterMessage))
			.subscribe((evt: Message<UpdateFilterMessagePayload>) => {
				replaceSliceFilter(SliceType.FilteredIn, evt.payload!)
				refreshFilter()
			})
		messageHub.messages
			.pipe(filter(isClearFilterMessage))
			.subscribe((evt: Message<ClearSliceMessagePayload>) => {
				clearSliceFilter(SliceType.FilteredIn, evt.payload!)
				refreshFilter()
			})

		// Highlight
		messageHub.messages
			.pipe(filter(isReplaceHighlightMessage))
			.subscribe((evt: Message<UpdateFilterMessagePayload>) => {
				replaceSliceFilter(SliceType.Highlighted, evt.payload!)
				refreshSliceData(SliceType.Highlighted)
			})
		messageHub.messages
			.pipe(filter(isClearHighlightMessage))
			.subscribe((evt: Message<ClearSliceMessagePayload>) => {
				clearSliceFilter(SliceType.Highlighted, evt.payload!)
				refreshSliceData(SliceType.Highlighted)
			})
	}

	/**
	 *
	 * @param slice The table slice to refresh
	 */
	protected abstract applyDataFilter(slice: TableSlice): Promise<void>
	protected abstract applyInverseDataFilter(
		slice: TableSlice,
		filter: FilterExpression,
	): Promise<void>
	protected abstract get slices(): Record<string, TableSlice>

	public get indexes(): string[] {
		return []
	}

	public slice(type: SliceType): TableSlice {
		return this.slices[type]
	}
}
