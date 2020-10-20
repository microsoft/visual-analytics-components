/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import React, { memo } from 'react'
import { WithEmbeddings as With } from './WithEmbeddings'
import { WithoutEmbeddings as Without } from './WithoutEmbeddings'

export interface BottomPaneProps {
	hasEmbeddings?: boolean
}
export const BottomPane: React.FC<BottomPaneProps> = memo(function BottomPane({
	hasEmbeddings: has,
}) {
	return has ? <With /> : <Without />
})
