/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useCallback } from 'react'
import { DataTypes, DataRecord } from '../../../utils/processDataRecords'
import { sortFiles } from './fileSystem'

export function useTypeChangeHandler(
	loadingRecords: DataRecord[],
	availableRecords: DataRecord[],
	setLoadingRecords: (data: DataRecord[]) => void,
	setAvailableRecords: (data: DataRecord[]) => void,
): (record: DataRecord, type: DataTypes) => void {
	return useCallback(
		(record: DataRecord, type: DataTypes) => {
			// update record in availiableRecords
			const availableRecordsUpdate = availableRecords.map(
				(dataRecord: DataRecord) => {
					if (dataRecord.name === record.name) {
						return Object.assign({}, { ...dataRecord, dataType: type })
					}
					return { ...dataRecord }
				},
			)
			const recordInLoading = loadingRecords.find(
				(dataRecord: DataRecord) => dataRecord.name === record.name,
			)
			if (recordInLoading) {
				// in loading
				let typeCheck = false
				let modLoadingRecords = loadingRecords.reduce(
					(acc: DataRecord[], dataRecord: DataRecord) => {
						if (dataRecord.name !== record.name) {
							if (dataRecord.dataType === type) {
								typeCheck = true
							}
							acc.push(dataRecord)
						}
						return acc
					},
					[],
				)
				if (!typeCheck) {
					modLoadingRecords = [
						...modLoadingRecords,
						Object.assign({}, { ...recordInLoading, dataType: type }),
					]
				}
				setLoadingRecords(modLoadingRecords)
				const sortedFiles = sortFiles(availableRecordsUpdate, modLoadingRecords)
				setAvailableRecords(sortedFiles)
			} else {
				setAvailableRecords(availableRecordsUpdate)
			}
		},
		[loadingRecords, availableRecords, setLoadingRecords, setAvailableRecords],
	)
}
