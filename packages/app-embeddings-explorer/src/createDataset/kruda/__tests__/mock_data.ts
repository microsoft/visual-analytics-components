/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @essex/adjacent-await */
import * as fs from 'fs'
import * as path from 'path'
import { Graph } from '../../../interfaces'
import GraphBuilder from '../../../utils/GraphBuilder'
import { readFileString } from '../../../utils/buildGraph'

function readFile(name: string): string {
	return fs.readFileSync(
		path.join(__dirname, '../../../../../../datasets/auto_cluster', name),
		{ encoding: 'utf8' },
	)
}

export async function readAutoCluster(): Promise<Graph> {
	const communitiesFile = readFile('communities.csv')
	const edgesFile = readFile('edges.csv')
	const verticesFile = readFile('vertices.csv')
	const partitionsFile = readFile('partitions.csv')

	const builder = new GraphBuilder()
	await readFileString('communities.csv', communitiesFile, builder)
	await readFileString('edges.csv', edgesFile, builder)
	await readFileString('vertices.csv', verticesFile, builder)
	await readFileString('partitions.csv', partitionsFile, builder)

	const graph = builder.build()
	expect(graph.nodes).toHaveLength(9452)
	expect(graph.edges).toHaveLength(87478)
	expect(graph.communities).toHaveLength(84)
	return graph
}
