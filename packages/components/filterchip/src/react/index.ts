/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	createComponent,
	ComponentProps,
} from '@visual-analytics-components/react'
import * as React from 'react'
import { FilterChipComponentInner } from './FilterChipComponentInner'
import { Configuration } from './interfaces'

export const FilterChipComponent: React.FC<ComponentProps<
	Configuration
>> = createComponent<Configuration>(FilterChipComponentInner)
