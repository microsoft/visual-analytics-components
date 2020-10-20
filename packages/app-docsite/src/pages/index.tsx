/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/no-var-requires */
import debug from 'debug'
import React, { memo } from 'react'
import { Helmet } from 'react-helmet'
import styled from 'styled-components'
import { Splash } from '../components/splash'
import GlobalStyles from '../util/GlobalStyles'
const log = debug('site:index')
const packageJson = require('../../package.json')
log('MS Visual Analytic Components, version', packageJson.version)

export interface IndexPageState {
	scrollPercent: number
}

const IndexPage: React.FC = memo(function IndexPage() {
	return (
		<Container>
			<GlobalStyles />
			<Helmet title="Microsoft Visual Analytic Components">
				<html lang="en" />
				<link
					href="https://fonts.googleapis.com/css?family=Josefin+Sans|Roboto+Mono&display=swap"
					rel="stylesheet"
				></link>
			</Helmet>
			<Splash />
		</Container>
	)
})
export default IndexPage

const Container = styled.div`
	height: 100%;
	width: 100%;
	display: flex;
	flex-direction: column;
`
