/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styled from 'styled-components'
import theme from '../../util/theme'

export const Text = styled.div`
	color: ${theme.palette.whitish};
	font-family: ${theme.text.fontFamily};
	font-size: 12px;
`

export const Link = styled.a`
	color: ${theme.palette.highlight};
	font-family: ${theme.text.fontFamily};
	font-size: 12px;
`
