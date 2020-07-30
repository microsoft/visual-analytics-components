/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { DataMapping } from './data'

/**
 * Common component configuration interafce
 */
export interface ComponentConfiguration {
	/**
	 * A unique instance-id for this component
	 */
	instanceId?: string

	/**
	 * Dataset transformaion to apply
	 */
	dataMapping?: DataMapping
}
