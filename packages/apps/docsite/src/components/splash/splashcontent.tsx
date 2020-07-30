/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { withPrefix } from 'gatsby'
import React, { memo, useRef } from 'react'
import styled from 'styled-components'
import theme from '../../util/theme'
import Footer from '../footer'
import * as HeaderComp from '../header/header'
import { Logo } from '../logo'
import { usePaneMousehandlers } from './splash.hooks'

export const SplashContent: React.FC = memo(function SplashContent() {
	const docRef = useRef<HTMLDivElement>(null)
	const sourceRef = useRef<HTMLDivElement>(null)
	const [
		sourceMouseEnter,
		sourceMouseLeave,
		onSourceClick,
	] = usePaneMousehandlers(
		sourceRef,
		'https://github.com/microsoft/visual-analytics-components',
	)
	const [docMouseEnter, docMouseLeave, onDocClick] = usePaneMousehandlers(
		docRef,
		withPrefix('/documentation'),
	)
	return (
		<Container>
			<HeaderComp.Header showLinks={false} />

			<HeroPane onClick={onDocClick}>
				<Logo fontSize={100} onClick={onDocClick} gap={1} />
				<SubHero>
					An experimental system for composable, disaggregated, visual analytics.
				</SubHero>
			</HeroPane>
			<BoxRow id="links" role="main">
				<Box
					style={{ background: theme.logoPalette.green }}
					onMouseEnter={docMouseEnter}
					onMouseLeave={docMouseLeave}
					onClick={onDocClick}
				>
					<DocsLink href="/documentation">Read the docs</DocsLink>
				</Box>
				<Box
					style={{ background: theme.logoPalette.pink }}
					ref={sourceRef as any}
					onMouseEnter={sourceMouseEnter}
					onMouseLeave={sourceMouseLeave}
					onClick={onSourceClick}
				>
					<StyledAnchor href="https://github.com/microsoft/visual-analytics-components">
						Browse the source
					</StyledAnchor>
				</Box>
			</BoxRow>
			<FooterRow>
				<Footer />
			</FooterRow>
		</Container>
	)
})

const HeroPane = styled.div`
	display: flex;
	flex: 3;
	flex-direction: column;
	align-items: center;
	justify-content: center;
`

const SubHero = styled.div`
	color: ${theme.logoPalette.orange};
	font-size: 12pt;
	display: flex;
	justify-content: center;
	padding-left: 15%;
	padding-right: 15%;
	margin-top: 20px;
`

const Container = styled.div`
	display: flex;
	flex-direction: column;
	flex: 1;
`

const FooterRow = styled.div`
	bottom: 10px;
	width: 100%;
`

const Box = styled.div`
	display: flex;
	flex: 1;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	cursor: pointer;
`

const BoxRow = styled.div`
	flex: 1;
	display: flex;
	flex-direction: row;
`

const DocsLink = styled.a`
	color: black;
	font-family: 'Josefin Sans', -apple-system, system-ui, BlinkMacSystemFont,
		'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
	border-bottom: 0px;
`

const StyledAnchor = styled.a`
	font-weight: bold;
	color: black;
	font-family: 'Josefin Sans', -apple-system, system-ui, BlinkMacSystemFont,
		'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
	border-bottom: 0px;
`
