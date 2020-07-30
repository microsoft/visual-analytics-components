/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { createComponent } from '@visual-analytics-components/react'
import { Configuration } from '../interfaces'
import { Graph } from './Graph'

export const GraphComponent = createComponent<Configuration>(Graph)
