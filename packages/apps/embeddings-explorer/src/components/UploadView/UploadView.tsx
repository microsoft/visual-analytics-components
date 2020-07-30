/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import React, { memo } from 'react'
import styled from 'styled-components'
import { Graph } from '../../interfaces'
import { FileUploadPane } from './FileUploadPane'

export interface UploadViewProps {
	onGraphLoaded: (data: Graph) => void
}

export const UploadView: React.FC<UploadViewProps> = memo(function UploadView({
	onGraphLoaded,
}) {
	return (
		<Container>
			<FileUploadPane onGraphLoaded={onGraphLoaded} />
		</Container>
	)
})

const Container = styled.div`
	display: flex;
	flex: 1;
	margin: 40px;
	justify-content: center;
`
