/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useContext, useMemo } from 'react'
import { ManagerContext } from '../context'
import { Manager, DataMapping } from 'visual-analytics-components'

/**
 * Use a VAC Manager instance from context, and apply a given data mapping (if present)
	* @param manager The optional manager from props
 * @param datamap The optional datamapping to apply
 */
export function useManager(manager?: Manager, datamap?: DataMapping): Manager | undefined {
	const managerFromContext = useContext(ManagerContext)	
	const managerToUse = manager || managerFromContext
	return useMemo(() => {
		return managerToUse != null && datamap != null
			? managerToUse.applyMapping(datamap)
			: managerToUse
	}, [managerToUse, datamap])
}
