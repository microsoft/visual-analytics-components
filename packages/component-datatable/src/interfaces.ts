/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ComponentConfiguration } from 'visual-analytics-components'

export interface Configuration extends ComponentConfiguration {
	/**
	 * The tables to show the user
	 */
	tables?: string[]
}
