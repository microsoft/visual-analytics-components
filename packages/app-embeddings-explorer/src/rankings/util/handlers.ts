/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	Manager,
	MessageCreators,
	FilterOperation,
} from 'visual-analytics-components'

export function setSelectedVertex(
	id: string,
	label: string,
	manager: Manager,
): void {
	manager.publish(
		MessageCreators.Selection.replace(
			{
				table: 'vertices',
			},
			{
				field: 'id',
				operation: FilterOperation.Equal,
				value: id,
			},
			`Examining Vertex ${label}`,
		),
	)
}

export function filterToVerticesInCommunity(
	communityId: string,
	manager: Manager,
): void {
	manager.publish(
		MessageCreators.Filter.replace(
			{
				table: 'vertices',
				key: 'in_community',
			},
			{
				field: 'community',
				operation: FilterOperation.Equal,
				value: communityId,
			},
		),
	)
}

export function setHighlightedVertex(id: string, manager: Manager): void {
	setTimeout(
		() =>
			manager &&
			manager.publish(
				MessageCreators.Highlight.replace(
					{
						table: 'vertices',
						key: '__GLOBAL__',
					},
					{
						field: 'id',
						operation: FilterOperation.Equal,
						value: id,
					},
				),
			),
		0,
	)
}
