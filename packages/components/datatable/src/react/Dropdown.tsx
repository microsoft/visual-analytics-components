/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable jsx-a11y/no-onchange */
import { Theme } from '@thematic/core'
import { useThematic } from '@thematic/react'
import * as React from 'react'
import { memo, useCallback } from 'react'
import styled from 'styled-components'

export interface DropdownProps {
	value: string
	onChange: (value: string) => void
	options: string[]
	labels?: string[]
}

export const Dropdown: React.FC<DropdownProps> = memo(function Dropdown({
	value,
	onChange,
	options,
	labels,
}) {
	const theme = useThematic()
	const handleChange = useCallback(event => onChange(event.target.value), [
		onChange,
	])
	return (
		<SelectorDropdown value={value} onChange={handleChange} theme={theme}>
			{options.map((t, index) => (
				<option key={t} value={t}>
					{(labels && index < labels.length && labels[index]) || t}
				</option>
			))}
		</SelectorDropdown>
	)
})

export interface SelectorDropdownProps {
	theme: Theme
}
const SelectorDropdown = styled.select`
	margin-top: 1px;
	margin-bottom: 2px;
	margin-right: 2px;
	color: ${({ theme }: SelectorDropdownProps) => theme.text().fill().hex()};
	background-color: ${({ theme }: SelectorDropdownProps) =>
		theme.plotArea().fill().hex()};
`
