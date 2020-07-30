/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Dropdown, IDropdownOption } from '@fluentui/react'
import { useThematic } from '@thematic/react'
import React, { FormEvent } from 'react'
import { DraggableStateSnapshot, DraggableProvided } from 'react-beautiful-dnd'
import styled from 'styled-components'
import { formatBytes } from '../../utils/formatBytes'
import { DataRecord, DataTypes } from '../../utils/processDataRecords'
import { getStatus, FileStatus } from './hooks/fileSystem'

const UNICODES = {
	accepted: '\u2714',
	rejected: '\u2718',
}
interface TableRowProps {
	file: DataRecord
	filesToLoad: DataRecord[]
	provided: DraggableProvided
	snapshot: DraggableStateSnapshot
	index: number
	lastIndex: number
	handleEdit: () => void
	handleDropDown: (
		file: DataRecord,
		event: FormEvent,
		option?: IDropdownOption,
	) => void
}

export const TableRow: React.FC<TableRowProps> = ({
	file,
	provided,
	filesToLoad,
	handleDropDown,
}) => {
	const theme = useThematic()
	const accepted = theme.application().accent().hex()
	const rejected = theme.application().error().hex()

	// would like to use snapshot.isDragging to color when dragging ?
	const options = [...Object.keys(DataTypes)].map((dataType: string) => {
		return { key: dataType, text: dataType }
	})
	const status = getStatus(file, filesToLoad)
	const statusStyle: React.CSSProperties = {
		color: status === FileStatus.Accepted ? accepted : rejected,
	}
	return (
		<Row
			ref={provided.innerRef}
			{...provided.draggableProps}
			{...provided.dragHandleProps}
		>
			<td>{file.name}</td>
			<td>{formatBytes(file.size || 0)}</td>
			<td>
				<Dropdown
					defaultSelectedKey={file.dataType}
					options={options}
					onChange={(ev, option): void => handleDropDown(file, ev, option)}
				/>
			</td>
			<FileList style={statusStyle}>{UNICODES[status]}</FileList>
		</Row>
	)
}

const Row = styled.tr`
	padding-bottom: 5px;
	td,
	th {
		text-align: left;
		padding: 5px;
	}
`

const FileList = styled.td`
	display: inline;
`
