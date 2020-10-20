/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import * as React from 'react'
import { memo, useMemo } from 'react'
import styled from 'styled-components'

export interface CategoryStripeProps {
	color: string
}
export const CategoryStripe: React.FC<CategoryStripeProps> = memo(
	function CategoryStripe({ color }) {
		const style = useMemo(
			() => ({
				borderRightColor: color,
			}),
			[color],
		)
		return <ItemCategory style={style} />
	},
)

const ItemCategory = styled.div`
	margin-right: 4px;
	border-right-width: 2px;
	border-right-style: solid;
`
