/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import React from 'react'
import styled from 'styled-components'
import theme from '../../util/theme'
import { Copyright } from './copyright'
import { NoCookies } from './no-cookies'
import { PrivacyStatement } from './privacy-statement'
import { TermsOfUse } from './terms-of-use'
import { TrademarksStatement } from './trademarks-statement'

export interface FooterProps {
	style?: React.CSSProperties
}

export const FOOTER_HEIGHT = 50

export const Footer: React.FC<FooterProps> = style => (
	<Container style={style as any}>
		<FooterColumn>
			<WithLove>with ♥ from Microsoft</WithLove>
		</FooterColumn>
		<FooterColumn>
			<WithLove>
				<Copyright />
				<NoCookies />
				<TermsOfUse />
				<PrivacyStatement />
				<TrademarksStatement />
			</WithLove>
		</FooterColumn>
	</Container>
)

const Container = styled.div`
	display: flex;
	margin-top: 10px;
`

const FooterColumn = styled.div`
	margin-top: 10px;
	display: flex;
	flex: 1;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	height: ${FOOTER_HEIGHT}px;
`

const WithLove = styled.div`
	color: ${theme.palette.whitish};
	font-family: ${theme.text.fontFamily};
	font-size: 12px;
	margin-top: ${FOOTER_HEIGHT / 2}px;
`
