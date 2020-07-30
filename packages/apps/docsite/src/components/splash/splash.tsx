/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import React, { CSSProperties, useRef, useMemo, RefObject, memo } from 'react'
import useDimensions from 'react-use-dimensions'
import styled from 'styled-components'
import { SplashContent } from './splashcontent'
/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
// @ts-ignore

const DEFAULT_HEIGHT = 768

export const Splash: React.FC = memo(function Splash() {
	const titleRef = useRef<RefObject<any> | null | undefined>(null)
	const [containerRef, { height }] = useDimensions()
	const titleContainerStyle = useMemo<CSSProperties>(
		() => ({ height: height || DEFAULT_HEIGHT }),
		[height],
	)

	return (
		<Container ref={(node): void => containerRef(node)}>
			<TitleContainer
				style={titleContainerStyle}
				ref={titleRef as any}
				role="navigation"
			></TitleContainer>
			<SplashContent />
		</Container>
	)
})

const Container = styled.div`
	display: flex;
	flex: 1;
`
const TitleContainer = styled.div`
	position: absolute;
	top: 0;
	left: 0;
`
