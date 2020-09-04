/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import React from 'react'
import styled from 'styled-components'
import { Copyright } from './Copyright'
import { NoCookies } from './NoCookies'
import { PrivacyStatement } from './Privacy'
import { TermsOfUse } from './TermsOfUse'
import { TrademarksStatement } from './Trademarks'

export interface FooterProps {
	style?: React.CSSProperties
}

export const FOOTER_HEIGHT = 50

export const Footer: React.FC<FooterProps> = style => (
	<Container style={style as any}>
		<FooterColumn></FooterColumn>
		<FooterColumn>
			<Copyright />
			<NoCookies />
			<CorpLinks>
				<TermsOfUse />
				<PrivacyStatement style={{ marginLeft: 30, marginRight: 30 }} />
				<TrademarksStatement />
			</CorpLinks>
		</FooterColumn>
	</Container>
)

const Container = styled.div`
	display: flex;
	margin-top: 10px;
	background-color: #333333;
`
const CorpLinks = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-around;
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
