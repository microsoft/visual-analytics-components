/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ColorVector, Colorizer } from '@graspologic/renderer'
import { useMemo } from 'react'
import { Configuration } from '../../interfaces'
import { Manager } from 'visual-analytics-components'

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
