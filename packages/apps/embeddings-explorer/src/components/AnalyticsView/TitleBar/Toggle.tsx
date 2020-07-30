/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import React, { memo, useCallback } from 'react'
import { FaEye as ShownIcon, FaEyeSlash as HiddenIcon } from 'react-icons/fa'
import styled from 'styled-components'
export interface ToggleProps {
	expanded: boolean
	title: string
	onToggle: (value: boolean) => void
	tabIndex?: number
}

export const Toggle: React.FC<ToggleProps> = memo(function Toggle({
	expanded,
	title,
	onToggle,
	tabIndex = 0,
}) {
	const onCollapse = useCallback(() => onToggle(false), [onToggle])
	const onExpand = useCallback(() => onToggle(true), [onToggle])

	return (
		<>
			<Container
				onClick={expanded ? onCollapse : onExpand}
				onKeyDown={expanded ? onCollapse : onExpand}
				role="button"
				tabIndex={tabIndex}
			>
				<Title>
					{expanded ? <ShownIcon /> : <HiddenIcon />}&nbsp;{title}
				</Title>
			</Container>
		</>
	)
})

const Container = styled.div`
	margin-right: 5px;
	display: flex;
	align-items: center;
	justify-content: flex-start;
	min-height: 15px;
	font-size: 10px;
	border: 1px solid lightgrey;
	border-radius: 5px;
	padding: 3px;
	cursor: pointer;
`

const Title = styled.span`
	font-size: 12;
	align-items: center;
	display: flex;
`
