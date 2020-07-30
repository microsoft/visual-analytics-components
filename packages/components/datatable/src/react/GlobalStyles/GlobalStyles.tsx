/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import * as React from 'react'
import { memo, useMemo } from 'react'
import { getStyles } from './getStyles'

export const GlobalStyles: React.FC = memo(function GlobalStyles() {
	const css = useMemo(() => getStyles(), [])
	return <style>{css}</style>
})
