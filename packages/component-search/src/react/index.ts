/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	createComponent,
	ComponentProps,
} from '@visual-analytics-components/react'
import * as React from 'react'
import { Configuration } from '../interfaces'
import { Search } from './Search'

export const SearchComponent: React.FC<ComponentProps<Configuration>> =
	createComponent<Configuration>(Search)
