/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Graph, Vertex, Edge, Community } from '../interfaces'
import { ColumnSpecification, DatumType } from 'visual-analytics-components'

function inferColumnType(name: string, value: any): DatumType {
	let type = DatumType.Any
	if (typeof value === 'undefined') {
		console.log(`Could not infer type of column ${name}`, value)
		return DatumType.Any
	}
	if (Array.isArray(value)) {
		type = DatumType.Array
	} else if (typeof value === 'string') {
		type = DatumType.String
	} else if (typeof value === 'number') {
		type = DatumType.Number
	} else if (typeof value === 'object') {
		type = DatumType.Object
	} else if (typeof value.getMonth === 'function') {
		type = DatumType.Date
	} else if (typeof value === 'boolean') {
		type = DatumType.Boolean
	}
	return type
}

export default class GraphBuilder {
	private vertexMap: Record<string, Vertex> = {}
	private edgeMap: Record<string, Edge> = {}
	private communityMap: Record<string, Community> = {}
	private errorCallback?: (msg: string) => void

	public hasVertex(id: string): boolean {
		return this.vertexMap[id] != null
	}

	public addVertex(vertex: Vertex): void {
		this.vertexMap[vertex.id] = vertex
	}

	public getVertex(id: string): Vertex {
		return this.vertexMap[id]
	}

	public hasEdge(source: string, target: string): boolean {
		return this.edgeMap[`${source}:${target}`] != null
	}

	public addEdge(edge: Edge): void {
		this.edgeMap[`${edge.source}:${edge.target}`] = edge
	}

	public getEdge(source: string, target: string): Edge {
		return this.edgeMap[`${source}:${target}`]
	}

	public hasCommunity(id: number): boolean {
		return this.communityMap[id] != null
	}

	public addCommunity(community: Community): void {
		this.communityMap[community.id] = community
	}

	public getCommunity(id: number): Community {
		return this.communityMap[id]
	}

	public setErrorCallback(efunc: (msg: string) => void): void {
		this.errorCallback = efunc
	}

	public build(): Graph {
		const vertexAttributes: ColumnSpecification[] = []
		const edgeAttributes: ColumnSpecification[] = []
		const communityAttributes: ColumnSpecification[] = []

		const nodes = Object.values(this.vertexMap)
		const edges = Object.values(this.edgeMap)
		const communities = Object.values(this.communityMap)

		function mapDynamicProps(
			props: Record<string, any>,
			filetype: string,
			errorCb?: (error: string) => void,
		): ColumnSpecification[] {
			return Object.keys(props).map(name => {
				const value = props[name]
				if (!value && errorCb) {
					errorCb(`missing prop label ${name} in ${filetype} file`)
				}
				const type = inferColumnType(name, value)
				return { name, type }
			})
		}

		if (nodes.length > 0) {
			const first = nodes[0]

			// It is important that these extra properties stay in this destructuring
			// It strips known properties that we don't need to add
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { id, label, weight, community, embeddings, x, y, z, ...props } = first
			vertexAttributes.push(
				...mapDynamicProps(props, 'vertices', this.errorCallback),
			)
		}
		if (edges.length > 0) {
			const first = edges[0]

			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { weight, source, target, ...props } = first
			edgeAttributes.push(...mapDynamicProps(props, 'edges', this.errorCallback))
		}
		if (communities.length > 0) {
			const first = communities[0]

			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { id, label, size, integrity, ...props } = first
			communityAttributes.push(
				...mapDynamicProps(props, 'communities', this.errorCallback),
			)
		}

		const hasEmbeddings = nodes.some(n => !!n.embeddings)

		const result = {
			hasEmbeddings,
			nodes,
			edges,
			communities,
			communityAttributes,
			vertexAttributes,
			edgeAttributes,
		}
		return result
	}
}
