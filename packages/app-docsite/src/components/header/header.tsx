/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Link, graphql, StaticQuery } from 'gatsby'
import React, { memo, useMemo } from 'react'
import styled from 'styled-components'
import theme from '../../util/theme'
import { Logo } from '../logo'
/* eslint-disable @typescript-eslint/no-var-requires */
const { version: libraryVersion } = require('../../../../../package.json')

export interface HeaderProps {
	logoTo?: string
	opacity?: number
	showLinks?: boolean
}

export const HEIGHT = 60

export const Header: React.FC<HeaderProps> = memo(function Header({
	opacity = 1.0,
	showLinks = true,
}) {
	const containerStyle = useMemo<React.CSSProperties>(() => ({ opacity }), [
		opacity,
	])
	return (
		<StaticQuery
			query={graphql`
				query {
					site {
						siteMetadata {
							title
							githubUrl
						}
					}
				}
			`}
			render={({
				site: {
					siteMetadata: { githubUrl },
				},
			}: any): JSX.Element => {
				const links = showLinks ? (
					<>
						<Links>
							<InnerLink to="/">Home</InnerLink>
							<OuterLink href={githubUrl}>Github</OuterLink>
						</Links>
					</>
				) : (
					<> </>
				)
				return (
					<Container style={containerStyle}>
						<InnerContainer>
							<LogoContainer role="banner">
								<Logo fontSize={20} gap={0.5} />
								<VersionIdentifier>v{libraryVersion}</VersionIdentifier>
							</LogoContainer>
							{links}
						</InnerContainer>
					</Container>
				)
			}}
		/>
	)
})

const Container = styled.header`
	background: ${theme.backgrounds.header};
	height: ${HEIGHT}px;
	display: flex;
	top: 0px;
	width: 100%;
`
const LogoContainer = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	color: ${theme.text.fontColor};
`

const InnerContainer = styled.div`
	flex: 1;
	margin: 0 auto;
	padding: 1.45rem 1.0875rem;
	display: flex;
	justify-content: space-between;
	align-self: stretch;
	align-items: center;
`
const VersionIdentifier = styled.div`
	color: white;
	text-decoration: none;
	font-family: ${theme.text.fontFamily};
	font-weight: 100;
	margin-left: 5px;
	font-size: 10px;
	color: ${theme.palette.highlight};
	text-align: bottom;
`

const Links = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	text-align: center;
`

const InnerLink = styled(Link)`
	color: ${theme.palette.whitish};
	margin-left: 8px;
	margin-right: 8px;
	font-family: ${theme.text.fontFamily};
	font-weight: ${theme.header.linkFontSize};
	font-weight: ${theme.header.linkFontWeight};
`

const OuterLink = styled.a`
	color: ${theme.palette.whitish};
	margin-left: 8px;
	margin-right: 8px;
	font-family: ${theme.text.fontFamily};
	font-weight: ${theme.header.linkFontSize};
	font-weight: ${theme.header.linkFontWeight};
`
