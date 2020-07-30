/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	Message,
	DataChangedMessagePayload,
	MessageTypes,
	SliceType,
} from 'visual-analytics-components'

export function isVertexTableChangeEvent(evt: Message<any>): boolean {
	if (evt.type === MessageTypes.Data.Changed) {
		const changeEvt = evt.payload as DataChangedMessagePayload
		if (
			changeEvt.slice === SliceType.FilteredIn &&
			changeEvt.table === 'vertices'
		) {
			return true
		}
	}
	return false
}

export function isVertexSelectionChangeEvent(evt: Message<any>): boolean {
	if (evt.type === MessageTypes.Data.Changed) {
		const changeEvt = evt.payload as DataChangedMessagePayload
		if (
			changeEvt.slice === SliceType.Selected &&
			changeEvt.table === 'vertices'
		) {
			return true
		}
	}
	return false
}
