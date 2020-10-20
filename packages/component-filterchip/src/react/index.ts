/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import * as React from 'react'
import { FilterChipComponentInner } from './FilterChipComponentInner'
import { Configuration } from './interfaces'
import {
	createComponent,
	ComponentProps,
} from '@visual-analytics-components/react'

export const FilterChipComponent: React.FC<ComponentProps<
	Configuration
>> = createComponent<Configuration>(FilterChipComponentInner)
