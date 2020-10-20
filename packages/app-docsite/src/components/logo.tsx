/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { withPrefix } from 'gatsby'
import React, { memo, useMemo } from 'react'
import styled from 'styled-components'
import theme from '../util/theme'

export interface LogoProps {
	style?: React.CSSProperties
	onClick?: () => void
	fontSize: number
	gap?: number
}

const NO_OP = (): void => {
	/* */
}
const DEFAULT_GAP = 4

export const Logo: React.FC<LogoProps> = memo(function Logo({
	onClick = NO_OP,
	style,
	fontSize,
	gap = DEFAULT_GAP,
}) {
	const width = useMemo(() => fontSize * 15, [fontSize])
	return (
		<LogoPane
			onClick={onClick}
			onKeyPress={onClick}
			style={{ ...style, height: fontSize, minWidth: width }}
			tabIndex={0}
			href={withPrefix('/documentation')}
			aria-label="Logo text"
		>
			<HeroPaneText fontSize={fontSize} gap={gap} top={true}>
				Visual Analytics Components
			</HeroPaneText>
			<HeroPaneText fontSize={fontSize} gap={gap}>
				Visual Analytics Components
			</HeroPaneText>
		</LogoPane>
	)
})

const LogoPane = styled.a`
	position: relative;
`

interface HeroPaneTextProps {
	top?: boolean
	fontSize: number
	gap: number
}
const HeroPaneText = styled.div`
	position: absolute;
	margin-left: ${({ top, gap }): number => (top ? -gap : gap)}px;
	margin-top: ${({ top, gap }): number => (top ? -(gap / 2) : gap / 2)}px;
	color: ${({ top }: HeroPaneTextProps): string =>
		top ? theme.logoPalette.pink : theme.logoPalette.green};

	color: 0x222222;
	display: flex;
	align-items: center;
	font-size: ${({ fontSize }: HeroPaneTextProps): number => fontSize}px;
	font-family: sans-serif;
	justify-content: center;
	cursor: pointer;
	height: 100%;
	width: 100%;
	/* The points are: centered top, left bottom, right bottom */
	clip-path: ${({ top }: HeroPaneTextProps): string =>
		top ? 'polygon(0 0, 100% 0, 0 100%)' : 'polygon(0 100%, 100% 0, 100% 100%)'};
`
