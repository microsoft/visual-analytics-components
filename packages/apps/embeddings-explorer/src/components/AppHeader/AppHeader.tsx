/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Theme } from '@thematic/core'
import { useThematic } from '@thematic/react'
import React, { memo } from 'react'
import styled from 'styled-components'
export const AppHeader: React.FC = memo(function AppHeader() {
	const theme = useThematic()

	return (
		<Container theme={theme}>
			<Title>Microsoft Embeddings Explorer</Title>
			<SettingsContainer>{/* <SettingsMenu /> */}</SettingsContainer>
		</Container>
	)
})

interface ContainerProps {
	theme: Theme
}
const Container = styled.div`
	background: ${({ theme }: ContainerProps) =>
		theme.application().faint().hex()};
	border-bottom: 1px solid
		${({ theme }: ContainerProps) => theme.application().lowContrast().hex()};
	display: flex;
	justify-content: space-between;
	height: 50px;
	width: 100%;
`

const Title = styled.h1`
	font-size: 14pt;
	font-weight: 300;
	margin-left: 20px;
`
const SettingsContainer = styled.div`
	margin-top: 20px;
`
