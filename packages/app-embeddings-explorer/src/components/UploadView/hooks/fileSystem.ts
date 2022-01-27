/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useCallback, useState } from 'react'
import { Graph } from '../../../interfaces'
import GraphBuilder from '../../../utils/GraphBuilder'
import { postprocess, readDataFile } from '../../../utils/buildGraph'
import {
	DataRecord,
	classifyFileTypes,
	Source,
} from '../../../utils/processDataRecords'

export function useIngestDataFilesCallback(
	files: DataRecord[],
	onInfo: (message: string) => void,
	onError: (message: string) => void,
	onGraphLoaded: (input: Graph) => void,
): () => void {
	return useCallback(async () => {
		const graphBuilder = new GraphBuilder()
		graphBuilder.setErrorCallback(onError)
		if (files) {
			console.log(`loading ${files.map((f: DataRecord) => f.name).join(', ')}`)
			for (let i = 0; i < files.length; ++i) {
				const file = files[i]
				onInfo(`ingesting ${file.name}...`)
				await readDataFile(file, graphBuilder)
			}
			const graph = graphBuilder.build()
			postprocess(graph)
			onGraphLoaded(graph)
		} else {
			onError('No Loading Files')
		}
	}, [files, onGraphLoaded, onError, onInfo])
}

export enum FileStatus {
	Accepted = 'accepted',
	Rejected = 'rejected',
}

export const getStatus = (
	file: DataRecord,
	acceptedFiles: DataRecord[],
): FileStatus =>
	acceptedFiles && acceptedFiles.some(f => f.name === file.name)
		? FileStatus.Accepted
		: FileStatus.Rejected

const compareFiles = (
	file: DataRecord,
	acceptedFiles: DataRecord[],
): number => {
	const status = getStatus(file, acceptedFiles)
	return status === FileStatus.Accepted ? 1 : 100
}

export const sortFiles = (
	avaliableFiles: DataRecord[],
	acceptedFiles: DataRecord[],
): DataRecord[] => {
	return avaliableFiles.sort(
		(fileA: DataRecord, fileB: DataRecord) =>
			compareFiles(fileA, acceptedFiles)! - compareFiles(fileB, acceptedFiles)!,
	)
}

export function useFilesystemFiles(
	onError: (message?: string) => void,
): [
	DataRecord[],
	(input: DataRecord[]) => void,
	DataRecord[],
	(input: DataRecord[]) => void,
	(input: File[]) => void,
] {
	const [filesAvailable, setFilesAvailable] = useState<DataRecord[]>([])
	const [loadingFiles, setLoadingFiles] = useState<DataRecord[]>([])

	const onDrop = useCallback(
		(files: File[]) => {
			onError(undefined)
			if (files && files.length) {
				try {
					const [filesToLoad, totalFiles] = classifyFileTypes(files, Source.file)
					const sortedFiles = sortFiles(totalFiles, filesToLoad)
					setFilesAvailable(sortedFiles)
					setLoadingFiles(filesToLoad)
				} catch (err: any) {
					onError(err?.message)
				}
			}
		},
		[onError, setFilesAvailable, setLoadingFiles],
	)

	return [
		filesAvailable,
		setFilesAvailable,
		loadingFiles,
		setLoadingFiles,
		onDrop,
	]
}
