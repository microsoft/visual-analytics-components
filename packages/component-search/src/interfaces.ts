/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ComponentConfiguration } from 'visual-analytics-components'

export interface Configuration extends ComponentConfiguration {
	scope?: string
	wait?: number
	placeholder?: string
	title?: string
}
