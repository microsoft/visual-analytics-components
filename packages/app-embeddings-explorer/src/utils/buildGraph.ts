/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Graph, Community } from '../interfaces'
import GraphBuilder from './GraphBuilder'
import { DataRecord } from './processDataRecords'
import {parse} from 'csv-parse'


function fileExtension(fileName: string): string {
	const fileNameParts = fileName.split('.')
	return fileNameParts[fileNameParts.length - 1]
}

function fileName(fileName: string): string {
	const fileNameParts = fileName.split('.')
	return fileNameParts[0]
}

export function postprocess(graph: Graph): void {
	if (graph.edges.length === 0) {
		graph.nodes.forEach(node => {
			// create self edges to get data rendered
			graph.edges.push({
				source: node.id,
				target: node.id,
				weight: 1.0,
			})
		})
	}
}

export async function handleDataByType(
	file: DataRecord,
	binaryStr: string | ArrayBuffer,
	graph: GraphBuilder,
): Promise<void> {
	const name = file.dataType
	const ext = file.ext
	if (ext === 'json') {
		return loadJsonFile(graph, binaryStr!.toString())
	} else if (ext === 'model') {
		return loadModelFile(graph, binaryStr!.toString())
	} else if (ext === 'csv') {
		const rows = await readCsv(binaryStr!.toString())
		return await loadFlatFile(name, rows, graph)
	} else if (ext === 'tsv') {
		const rows = await readCsv(binaryStr!.toString(), '\t')
		return await loadFlatFile(name, rows, graph)
	}
}

export function readDataFile(
	fileWrapper: DataRecord,
	graph: GraphBuilder,
): Promise<void> {
	const file = fileWrapper.data as File
	return new Promise((resolve, reject) => {
		const reader = new FileReader()
		reader.onabort = (): void => reject('file reading was aborted')
		reader.onerror = (): void => reject('file reading has failed')
		reader.onload = async (): Promise<void> => {
			const binaryStr = reader.result
			if (binaryStr) {
				try {
					resolve(await handleDataByType(fileWrapper, binaryStr, graph))
				} catch (err) {
					console.error('caught error', err)
					reject('error parsing data')
				}
			} else {
				reject('error reading data')
			}
		}
		reader.readAsBinaryString(file)
	})
}

export async function readFileString(
	nameOfFile: string,
	fileContent: string,
	graph: GraphBuilder,
): Promise<void> {
	const name = fileName(nameOfFile).toLowerCase()
	const ext = fileExtension(nameOfFile).toLowerCase()
	if (ext === 'json') {
		loadJsonFile(graph, fileContent)
	} else if (ext === 'model') {
		loadModelFile(graph, fileContent)
	} else if (ext === 'csv') {
		const rows = await readCsv(fileContent)
		await loadFlatFile(name, rows, graph)
	} else if (ext === 'tsv') {
		const rows = await readCsv(fileContent, '\t')
		await loadFlatFile(name, rows, graph)
	}
}

/**
 * Attempt to load in JSON-based data. The JSON data is expected to adhere to:
 * https://github.com/jsongraph/json-graph-specification
 *
 * @param graph The graph to load inton
 * @param content The JSON File Content
 */
function loadJsonFile(graph: GraphBuilder, content: string): void {
	const data = JSON.parse(content)
	data.graph.nodes.forEach((n: any) =>
		graph.addVertex({
			...(n.metadata || {}),
			...n,
			metadata: undefined,
		}),
	)
	data.graph.edges.forEach((e: any) =>
		graph.addEdge({
			...(e.metadata || {}),
			...e,
			metadata: undefined,
		}),
	)
}

/**
 * Attempt to load in a model file, this contains embeddings for the graph
 * @param graph The graph to load in
 * @param data The model data to load in
 */
function loadModelFile(graph: GraphBuilder, data: string): void {
	data
		.split('\n')
		.slice(1)
		.filter(line => !!line)
		.forEach(line => {
			const tokens = line.split(' ')
			const id = tokens[0]
			const embeddings = tokens.slice(1).map(e => parseFloat(e))
			if (!graph.hasVertex(id)) {
				graph.addVertex({ id, label: id, weight: 1, community: 1 })
			}
			const node = graph.getVertex(id)
			node.embeddings = embeddings
		})
}

async function loadFlatFile(
	name: string,
	rows: any[],
	graph: GraphBuilder,
): Promise<void> {
	if (name === 'vertices') {
		processVertexFile(rows, graph)
	} else if (name === 'edges') {
		processEdgeFile(rows, graph)
	} else if (name === 'partitions') {
		processPartitions(rows, graph)
	} else if (name === 'communities') {
		processCommunities(rows, graph)
	} else {
		console.log('could not process csv with name', name)
	}
}

function processCommunities(rows: any[], graph: GraphBuilder): void {
	rows.forEach(row => {
		const { id, size, label, ...props } = row as Community
		if (graph.hasCommunity(id)) {
			const community = graph.getCommunity(id)
			community.size = size || community.size
			community.label = label || community.label
			Object.assign(community, props)
		} else {
			graph.addCommunity(row)
		}
	})
}

function processPartitions(rows: any[], graph: GraphBuilder): void {
	rows.forEach(row => {
		const { id, community } = row
		if (graph.hasVertex(id)) {
			const vertex = graph.getVertex(id)
			vertex.community = community
		}
	})
}

function processVertexFile(rows: any[], graph: GraphBuilder): void {
	rows.forEach(row => {
		const { id, ...props } = row
		if (id) {
			if (!graph.hasVertex(id)) {
				// insert a new row
				graph.addVertex(row)
			} else {
				// update an existing row
				const vertex = graph.getVertex(id)
				Object.assign(vertex, props)
			}
		}
	})
}

function processEdgeFile(rows: any[], graph: GraphBuilder): void {
	rows.forEach(row => {
		const { source, target, ...props } = row
		if (source && target) {
			if (!graph.hasEdge(source, target)) {
				// insert a new row
				graph.addEdge(row)
			} else {
				// update an existing row
				const edge = graph.getEdge(source, target)
				Object.assign(edge, props)
			}
		}
	})
}

function readCsv(content: string, delimiter = ','): Promise<any> {
	return new Promise((resolve, reject) => {
		parse(
			content,
			{ columns: true, comment: '#', delimiter },
			(err: any, output: any) => {
				if (err) {
					reject(err)
				}
				resolve(output)
			},
		)
	}).then((data: any) => {
		data.forEach((row: any) => {
			Object.keys(row).forEach(col => {
				const val = row[col]
				row[col] = isNaN(val) ? val : parseFloat(val)
			})
		})
		return data
	})
}
