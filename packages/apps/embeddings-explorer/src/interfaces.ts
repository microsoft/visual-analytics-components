/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ColumnSpecification } from 'visual-analytics-components'

export interface Graph {
	hasEmbeddings: boolean

	edges: Edge[]
	nodes: Vertex[]
	communities: Community[]

	// Additional attribute definitions
	edgeAttributes: ColumnSpecification[]
	vertexAttributes: ColumnSpecification[]
	communityAttributes: ColumnSpecification[]
}

export interface Community extends Record<string, any> {
	id: number
	label: string
	size: number
	integrity?: number
}

export interface Edge extends Record<string, any> {
	source: string
	target: string
	weight: number
}

export interface Vertex extends Record<string, any> {
	id: string
	label: string
	weight: number
}
