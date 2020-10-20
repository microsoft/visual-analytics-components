/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import React, { memo } from 'react'

export interface MaybeProps {
	if: boolean
}
export const Maybe: React.FC<MaybeProps> = memo(function Maybe({
	if: ifClause,
	children,
}) {
	return ifClause ? <>{children}</> : null
})
