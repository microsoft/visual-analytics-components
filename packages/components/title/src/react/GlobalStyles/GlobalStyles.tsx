/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useThematic } from '@thematic/react'
import * as React from 'react'
import { memo, useMemo } from 'react'
import { Configuration } from '../../interfaces'
import { getStyles } from './getStyles'

export interface GlobalStylesProps {
	config: Configuration
}
export const GlobalStyles: React.FC<GlobalStylesProps> = memo(
	function GlobalStyles({ config }) {
		const theme = useThematic()
		const css = useMemo(() => getStyles(theme, config), [theme, config])
		return <style>{css}</style>
	},
)
