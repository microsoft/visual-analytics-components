/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ThematicFluentProvider } from '@thematic/fluent'
import { ApplicationStyles } from '@thematic/react'
import React, { memo } from 'react'
import { Helmet } from 'react-helmet'
import styled from 'styled-components'
import { defaultTheme } from '../../utils/theme'
import { AppHeader } from '../AppHeader'
import { ViewSelector } from './ViewSelector'

export const App: React.FC = memo(function App() {
	const theme = defaultTheme
	return (
		<>
			<Helmet title="Embeddings Viewer">
				<html lang="en" />
			</Helmet>
			<ThematicFluentProvider theme={theme}>
				<ApplicationStyles />
				<Container>
					<AppHeader />
					<ViewSelector />
				</Container>
			</ThematicFluentProvider>
		</>
	)
})

const Container = styled.div`
	text-align: center;
	flex: 1;
	display: flex;
	flex-direction: column;
	position: relative;
`
