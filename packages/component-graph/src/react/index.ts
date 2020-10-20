/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Configuration } from '../interfaces'
import { Graph } from './Graph'
import {
	createComponent,
	ManagerContext,
} from '@visual-analytics-components/react'
console.log('InGraphComponent', ManagerContext)

export const GraphComponent = createComponent<Configuration>(Graph)
