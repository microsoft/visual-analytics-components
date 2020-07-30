/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useContext, useMemo } from 'react'
import { Manager, DataMapping } from 'visual-analytics-components'
import { ManagerContext } from '../context'

/**
 * Use a VAC Manager instance from context, and apply a given data mapping (if present)
 * @param datamap The optional datamapping to apply
 */
export function useManager(datamap?: DataMapping): Manager | undefined {
	const manager = useContext(ManagerContext)
	return useMemo(() => {
		if (manager != null && datamap != null) {
			return manager.applyMapping(datamap)
		} else {
			return manager
		}
	}, [manager, datamap])
}
