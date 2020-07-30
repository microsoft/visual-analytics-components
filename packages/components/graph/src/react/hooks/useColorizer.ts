/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ColorVector, Colorizer } from '@topologic/renderer'
import { useMemo } from 'react'
import { Manager } from 'visual-analytics-components'
import { Configuration } from '../../interfaces'

export function useColorizer(
	manager: Manager,
	config: Configuration,
): Colorizer {
	return useMemo(() => {
		if (config.colorizer) {
			return config.colorizer
		} else if (manager.theme) {
			const f = manager.theme.scales().nominal(50)
			return (key: any): ColorVector => f(key).rgbav() as ColorVector
		} else {
			return (): ColorVector => [1, 0, 0, 1]
		}
	}, [manager, config])
}
