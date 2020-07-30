/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useCallback } from 'react'
import { DropResult } from 'react-beautiful-dnd'
import { DataRecord, DataTypes } from '../../../utils/processDataRecords'
import { sortFiles } from './fileSystem'

export function useDropSwap(
	loadingRecords: DataRecord[],
	availableRecords: DataRecord[],
	setloadingRecords: (data: DataRecord[]) => void,
	setAvailableRecords: (data: DataRecord[]) => void,
	setErrorMessage: (d: string | undefined) => void,
): (result: DropResult) => void {
	const reorder = (
		list: DataRecord[],
		startIndex: number,
		endIndex: number,
	): DataRecord[] => {
		const result = Array.from(list)
		const [removed] = result.splice(startIndex, 1)
		result.splice(endIndex, 0, removed)
		return result
	}

	const handleDataSaving = useCallback(
		(modFilesToLoad: DataRecord[], filesAvCopy: DataRecord[]) => {
			setErrorMessage(undefined)
			setloadingRecords(modFilesToLoad)
			const sortedFiles = sortFiles(filesAvCopy, modFilesToLoad)
			setAvailableRecords(sortedFiles)
		},
		[setAvailableRecords, setErrorMessage, setloadingRecords],
	)

	return useCallback(
		(result: DropResult) => {
			if (!result.destination) {
				return
			}
			const destinationIndex = result.destination.index
			const sourceIndex = result.source.index
			const name = result.draggableId
			const thresholdIndex = loadingRecords.length - 1
			const recordToAdd = availableRecords.find(f => f.name === name)
			if (recordToAdd) {
				const filesAvCopy = reorder(availableRecords, sourceIndex, destinationIndex)
				if (destinationIndex < thresholdIndex + 1) {
					// is it above the loaded threshold?
					const recordToRemove = loadingRecords.find(
						f => f.dataType === recordToAdd.dataType,
					)
					let modFilesToLoad
					if (recordToRemove) {
						// do we need to replace it
						modFilesToLoad = loadingRecords.map((record: DataRecord) => {
							if (record.name === recordToRemove.name) {
								return recordToAdd
							}
							return record
						})
					} else {
						modFilesToLoad = [...loadingRecords, recordToAdd] // just add it
					}
					handleDataSaving(modFilesToLoad, filesAvCopy)
				} else {
					// check if source is a selected document
					const recordToRemove = loadingRecords.find(
						f => f.name === recordToAdd.name,
					)
					if (recordToRemove) {
						// remove record from list
						let requiredDocsFound = false
						const modFilesToLoad = loadingRecords.reduce(
							(acc: DataRecord[], record: DataRecord) => {
								if (record.name !== recordToRemove.name) {
									if (
										record.dataType === DataTypes.model ||
										record.dataType === DataTypes.edges ||
										record.dataType === DataTypes.graph
									) {
										requiredDocsFound = true
									}
									acc.push(record)
								}
								return acc
							},
							[],
						)
						if (requiredDocsFound) {
							// make sure it contains at least one of requirements
							handleDataSaving(modFilesToLoad, filesAvCopy)
						} else {
							setErrorMessage(
								'File set must container either: edges, models, or a graph json.',
							)
						}
					}
				}
			}
		},
		[loadingRecords, availableRecords, handleDataSaving, setErrorMessage],
	)
}
