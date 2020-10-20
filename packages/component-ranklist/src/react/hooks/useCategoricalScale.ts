/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useMemo } from 'react'
import { Configuration, RankedRow } from '../../interfaces'
import { Manager } from 'visual-analytics-components'

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
