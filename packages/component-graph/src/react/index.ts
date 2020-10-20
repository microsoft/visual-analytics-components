/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Configuration } from '../interfaces'
import { Graph } from './Graph'
import { createComponent } from '@visual-analytics-components/react'

export const GraphComponent = createComponent<Configuration>(Graph)
