/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/no-empty-interface */
import {
	FilterLocation,
	ComponentConfiguration,
} from 'visual-analytics-components'

export interface FilterChipData {
	location: FilterLocation
	label: string
}

export interface Configuration extends ComponentConfiguration {}
