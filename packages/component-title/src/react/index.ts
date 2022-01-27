/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	createComponent,
	ComponentProps,
} from '@visual-analytics-components/react'
import { Configuration } from '../interfaces'
import { Title } from './Title'

export interface TitleComponentProps {
	configuration?: Configuration
}

export const TitleComponent: React.FC<ComponentProps<Configuration>> =
	createComponent(Title)
