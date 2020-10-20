/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { load } from '@thematic/core'
import { Manager, ManagerImpl, DataSet } from 'visual-analytics-components'

const theme = load()

/**
 * Create a l
 */
export function createManager(ds: DataSet): Manager {
	return ManagerImpl.createInstance(ds, theme)
}
