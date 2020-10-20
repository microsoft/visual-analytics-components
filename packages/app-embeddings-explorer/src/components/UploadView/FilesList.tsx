/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IDropdownOption } from '@fluentui/react'
import React, { useCallback, Fragment, FormEvent } from 'react'
import {
	DragDropContext,
	Droppable,
	Draggable,
	DropResult,
	DroppableProvided,
	DraggableStateSnapshot,
	DraggableProvided,
} from 'react-beautiful-dnd'
import styled from 'styled-components'
import { DataRecord, DataTypes } from '../../utils/processDataRecords'
import { TableRow } from './TableRow'

interface FileListProps {
	availableFiles?: DataRecord[]
	filesToLoad?: DataRecord[]
	onClickHandler?: (result: any) => void
	onTypeChange?: (record: DataRecord, typeChange: DataTypes) => void
}

export const FileList: React.FC<FileListProps> = ({
	availableFiles,
	filesToLoad,
	onClickHandler,
	onTypeChange,
}): any => {
	const handleItemSelection = useCallback(
		(result: DropResult) => {
			if (onClickHandler) {
				onClickHandler(result)
			}
		},
		[onClickHandler],
	)

	const handleDropDown = (
		file: DataRecord,
		ev: FormEvent,
		option?: IDropdownOption,
	): void => {
		if (option && onTypeChange) {
			const newDataType = option.key as DataTypes
			onTypeChange(file, newDataType)
		}
	}

	if (filesToLoad && availableFiles) {
		return (
			<DragDropContext onDragEnd={handleItemSelection}>
				<Fragment>
					<FileListTable>
						<thead>
							<FileListRow>
								<th>Name</th>
								<th>Size</th>
								<th>Type</th>
								<th>Load Status</th>
							</FileListRow>
						</thead>
						<Droppable droppableId="table">
							{(droppableProvided: DroppableProvided): JSX.Element => (
								<tbody
									ref={(ref?: any): void => {
										droppableProvided.innerRef(ref)
									}}
									{...droppableProvided.droppableProps}
								>
									{availableFiles.map((file: DataRecord, index: number) => (
										<Draggable key={file.name} draggableId={file.name} index={index}>
											{(
												provided: DraggableProvided,
												snapshot: DraggableStateSnapshot,
											): JSX.Element => (
												<TableRow
													provided={provided}
													snapshot={snapshot}
													filesToLoad={filesToLoad}
													file={file}
													index={index}
													handleEdit={(): void => console.log('Edit ', index)}
													lastIndex={availableFiles.length - 1}
													handleDropDown={handleDropDown}
												/>
											)}
										</Draggable>
									))}
									{droppableProvided.placeholder}
								</tbody>
							)}
						</Droppable>
					</FileListTable>
				</Fragment>
			</DragDropContext>
		)
	}

	return null
}

const FileListTable = styled.table`
	margin: auto;
	margin-top: 30px;
	margin-bottom: 20px;
	justify-content: start;
	border-collapse: collapse;
`
const FileListRow = styled.tr`
	padding-bottom: 5px;
	td,
	th {
		text-align: left;
		padding: 5px;
	}
`
