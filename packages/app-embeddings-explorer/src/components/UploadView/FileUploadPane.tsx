/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { PrimaryButton } from '@fluentui/react'
import { useThematic } from '@thematic/react'
import React, { memo, useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import styled from 'styled-components'
import { Graph } from '../../interfaces'
import { FileList } from './FilesList'
import { UsageInstructions } from './UsageInstructions'
import {
	useIngestDataFilesCallback,
	useFilesystemFiles,
} from './hooks/fileSystem'
import { useDropSwap } from './hooks/useDropSwap'
import { useErrorOrInfoMessage } from './hooks/useErrorOrInfoMessage'
import { useTypeChangeHandler } from './hooks/useTypeChangeHandler'

export interface FileUploadPaneProps {
	onGraphLoaded: (data: Graph) => void
}

export const FileUploadPane: React.FC<FileUploadPaneProps> = memo(
	function FileUploadPane({ onGraphLoaded }) {
		const theme = useThematic()
		const accepted = theme.application().accent().hex()
		const rejected = theme.application().error().hex()
		const dropStyle = {
			border: `2px dashed ${theme.application().highContrast()}`,
		}
		const [errorMessage, setErrorMessage] = useState<string | undefined>()
		const [infoMessage, setInfoMessage] = useState<string | undefined>(
			'drop files here',
		)
		const [info, msgClass] = useErrorOrInfoMessage(errorMessage, infoMessage)
		const statusStyle: React.CSSProperties = {
			color: msgClass === 'error' ? rejected : accepted,
		}
		const [
			availableRecords,
			setAvailableRecords,
			loadingRecords,
			setLoadingRecords,
			onDrop,
		] = useFilesystemFiles(setErrorMessage)
		const { getRootProps, getInputProps } = useDropzone({
			onDrop,
		})
		const ingestGraphData = useIngestDataFilesCallback(
			loadingRecords,
			setInfoMessage,
			setErrorMessage,
			onGraphLoaded,
		)

		const handleSwapFiles = useDropSwap(
			loadingRecords,
			availableRecords,
			setLoadingRecords,
			setAvailableRecords,
			setErrorMessage,
		)

		const handleTypeChange = useTypeChangeHandler(
			loadingRecords,
			availableRecords,
			setLoadingRecords,
			setAvailableRecords,
		)

		const loadWithTestData = useCallback(() => {
			Promise.all([
				getFileObject('data/test-data/vertices.csv', 'vertices.csv'),
				getFileObject('data/test-data/edges.csv', 'edges.csv'),
				getFileObject('data/test-data/n2v.model', 'n2v.model'),
			]).then(files => onDrop(files))
		}, [onDrop])

		return (
			<div style={{ margin: 40, flex: 1 }}>
				<LoadContainer>
					<UsageInstructionsStyled />
					<DropAreaContainer>
						<DropArea style={dropStyle} {...getRootProps()}>
							<input {...getInputProps()} aria-label="Select data files" />
							<FileDropMessage style={statusStyle}>{info}</FileDropMessage>
						</DropArea>
						<TestDataOption>
							<span>
								or{' '}
								<PrimaryButton onClick={() => loadWithTestData()}>
									Use test data
								</PrimaryButton>
							</span>
							<div>
								<a href="data/test-data/vertices.csv">vertices.csv</a>
								<br />
								<a href="data/test-data/edges.csv">edges.csv</a>
								<br />
								<a href="data/test-data/n2v.model">n2v.model</a>
							</div>
						</TestDataOption>
						{availableRecords.length === 0 ? null : (
							<div>
								<FileList
									availableFiles={availableRecords}
									filesToLoad={loadingRecords}
									onClickHandler={handleSwapFiles}
									onTypeChange={handleTypeChange}
								/>
								<PrimaryButton onClick={ingestGraphData} text="Open Graph" />
							</div>
						)}
					</DropAreaContainer>
				</LoadContainer>
			</div>
		)
	},
)

const UsageInstructionsStyled = styled(UsageInstructions)`
	max-width: 60%;
`

const LoadContainer = styled.div`
	display: flex;
	flex-direction: row;
	width: 100%;
`

const DropArea = styled.div`
	height: 250px;
	width: 250px;
	justify-self: center;
	margin-left: 20px;
`

const FileDropMessage = styled.p`
	margin: 100px 20px 0 20px;
`

const DropAreaContainer = styled.div`
	display: flex;
	flex-direction: column;
`

const TestDataOption = styled.div`
	margin-top: 10px;
`

function getFileBlob(url: string, cb: (data: Blob) => void): void {
	const xhr = new XMLHttpRequest()
	xhr.open('GET', url)
	xhr.responseType = 'blob'
	xhr.addEventListener('load', () => cb(xhr.response))
	xhr.send()
}

function blobToFile(blob: Blob, name: string): File {
	const result: any = blob
	result.lastModifiedDate = new Date()
	result.name = name
	return result as File
}

function getFileObject(filePath: string, fileName: string): Promise<File> {
	return new Promise(resolve => {
		getFileBlob(filePath, blob => resolve(blobToFile(blob, fileName)))
	})
}
