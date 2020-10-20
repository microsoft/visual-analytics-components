/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { createContext } from 'react'
import { Manager } from 'visual-analytics-components'

export const ManagerContext = createContext<Manager | undefined>(undefined)
