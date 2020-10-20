/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useMemo } from 'react'
import { Manager } from 'visual-analytics-components'
import { Configuration, RankedRow } from '../../interfaces'

export function useCategoricalScale(
	manager: Manager,
	config: Configuration,
): (input: RankedRow) => string {
	return useMemo(() => {
		if (config.colorizer) {
			return config.colorizer
		} else {
			const colorScale = manager.theme.scales().nominal(50)
			return (input: RankedRow): string =>
				colorScale(input.category as number).hex()
		}
	}, [manager, config])
}
