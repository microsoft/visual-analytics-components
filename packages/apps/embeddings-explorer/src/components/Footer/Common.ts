/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styled from 'styled-components'

const textColor = '#FEFEFE'
const highlight = '#89C4F8'
const fontFamily = 'sans-serif'

export const Text = styled.div`
	color: ${textColor};
	font-family: ${fontFamily};
	font-size: 12px;
`

export const Link = styled.a`
	color: ${highlight};
	font-family: ${fontFamily};
	font-size: 12px;
`
