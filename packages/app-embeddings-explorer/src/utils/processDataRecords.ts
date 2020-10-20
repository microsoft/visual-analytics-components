/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export interface ClassifiedFile {
	name: string
	file: File | BlobEntry
	ext: string
	templateName: string
}

interface FileMapping {
	[key: string]: DataRecord[]
}

interface BlobContentSettings {
	contentType: string
	contentEncoding: string
	contentLanguage: string
	contentMD5: string
	cacheControl: string
	contentDisposition: string
}

export interface BlobEntry {
	name: string
	creationTime: string
	lastModified: string
	etag: string
	contentLength: string
	contentSettings: BlobContentSettings
	blobType: string
	accessTier: string
	accessTierInferred: boolean
	lease: any
	serverEncrypted: string
}
export enum DataTypes {
	graph = 'graph',
	edges = 'edges',
	vertices = 'vertices',
	partitions = 'partitions',
	communities = 'communities',
	model = 'model',
	other = 'other',
}

export interface DataRecord {
	name: string
	data: BlobEntry | File | string
	source: Source
	dataType: DataTypes
	ext: string
	size?: number
}

export enum Source {
	file = 'file',
	blob = 'blob',
}

const FILE_TYPE_LOAD_ORDER: Record<string, number> = {
	json: 0,
	tsv: 1,
	csv: 2,
	model: 3,
}

const FILE_NAME_LOAD_ORDER: Record<string, number> = {
	// graph json files representing a full garph
	graph: 0,

	// Vertex and Edge Lists
	edges: 1,
	vertices: 1,

	// partitions = per vertex community membership
	partitions: 2,

	// communities = data per community
	communities: 3,
}

// return fuzzy match on file names
function classifyItem(file: File | BlobEntry): DataTypes {
	const fileKeys = getFilingMapping()
	const cleanName = cleanFileName(file)
	const ext = fileExtension(file.name).toLowerCase()
	let classification: DataTypes = DataTypes.other
	if (ext === 'json') {
		// every json file is a graph
		classification = DataTypes.graph
	} else {
		fileKeys.forEach((templateName: string) => {
			if (cleanName.indexOf(templateName) >= 0 || ext === templateName) {
				classification = DataTypes[templateName as DataTypes]
			}
		})
	}
	return classification
}

function getFilingMapping(): string[] {
	return [...Object.keys(DataTypes)]
}

function cleanFileName(file: File | BlobEntry): string {
	return file.name.replace(/\.[^/.]+$/, '').toLowerCase()
}

function getFileSize(file: File): number {
	return file.size
}

/**
 * Classifies the files that we have recieved from the drag n drop into the different types of files that we require
 * Graph, Edges, Vertices, Partitions, Communities
 */
export function classifyFileTypes(
	recievedFiles: File[] | BlobEntry[],
	type: Source,
): [
	// The files to load
	DataRecord[],
	// The full file set
	DataRecord[],
] {
	const fileKeys = getFilingMapping()
	const fileMapping = fileKeys.reduce((acc: FileMapping, key: string) => {
		acc[key] = []
		return acc
	}, {} as FileMapping)
	let totalFiles: DataRecord[] = []

	recievedFiles.forEach((file: File | BlobEntry) => {
		file = type === Source.file ? (file as File) : (file as BlobEntry)
		const classifaction = classifyItem(file)
		const size = type === Source.file ? getFileSize(file as File) : undefined
		const item: DataRecord = {
			name: file.name,
			data: file,
			source: type,
			ext: fileExtension(file.name).toLowerCase(),
			dataType: classifaction,
			size,
		}
		fileMapping[classifaction] = [...fileMapping[classifaction], item]
	})
	let requiredDocsFound = false
	const files = Object.keys(fileMapping)
		.reduce((acc: DataRecord[], fileType: string) => {
			const fileArray: DataRecord[] = fileMapping[fileType]
			totalFiles = [...totalFiles, ...fileArray]

			if (fileArray.length > 0 && fileType !== DataTypes.other) {
				// check it contains either edges or model files
				if (
					fileType === DataTypes.model ||
					fileType === DataTypes.edges ||
					fileType === DataTypes.graph
				) {
					requiredDocsFound = true
				}
				const sorted: DataRecord[] = fileArray.sort(
					(fileA: DataRecord, fileB: DataRecord) => {
						return FILE_TYPE_LOAD_ORDER[fileA.ext]! - FILE_TYPE_LOAD_ORDER[fileB.ext]!
					},
				)
				const selected: DataRecord = sorted[0] // only take first file of type
				acc.push(selected)
			} else {
				if (fileType !== DataTypes.other) {
					console.log('missing: ', fileType)
				}
			}
			return acc
		}, [] as DataRecord[])
		.sort(
			(fileA: DataRecord, fileB: DataRecord) =>
				fileNameLoadOrder(fileA.dataType as string)! -
				fileNameLoadOrder(fileB.dataType as string)!,
		)

	if (!requiredDocsFound) {
		throw new Error(
			'missing required documents: must contain either a edges, model, or graph json file',
		)
	}

	return [files, totalFiles]
}

function fileExtension(fileName: string): string {
	const fileNameParts = fileName.split('.')
	return fileNameParts[fileNameParts.length - 1]
}

function fileNameLoadOrder(fileName?: string): number | undefined {
	let order
	if (fileName) {
		order = FILE_NAME_LOAD_ORDER[fileName]
	}
	return order == null ? 100 : order
}
