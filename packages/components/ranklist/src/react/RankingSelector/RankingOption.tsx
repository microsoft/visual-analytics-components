/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import classnames from 'classnames'
import * as React from 'react'
import { memo, useState, useEffect } from 'react'
import { Ranking } from '../../interfaces'

export interface RankingOptionProps {
	ranking: Ranking
}
export const RankingOption: React.FC<RankingOptionProps> = memo(
	function RankingOption({ ranking }) {
		const [disabled, setDisabled] = useState(!ranking.isEnabled)
		const [hidden, setHidden] = useState(!ranking.isVisible)
		const [label, setLabel] = useState(ranking.label)

		useEffect(() => {
			const subscription = ranking.onChange.subscribe(() => {
				setDisabled(!ranking.isEnabled)
				setHidden(!ranking.isVisible)
				setLabel(ranking.label)
			})
			return (): void => subscription.unsubscribe()
		}, [ranking])
		return (
			<option
				value={ranking.id}
				disabled={disabled}
				className={classnames({ hidden })}
			>
				{label}
			</option>
		)
	},
)
