/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import * as React from 'react'
import { Configuration } from '../interfaces'
import { Datatable } from './Datatable'
import {
	createComponent,
	ComponentProps,
} from '@visual-analytics-components/react'

export const DatatableComponent: React.FC<ComponentProps<
	Configuration
>> = createComponent<Configuration>(Datatable)
