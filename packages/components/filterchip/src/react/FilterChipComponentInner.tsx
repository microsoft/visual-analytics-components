/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import * as React from 'react'
import { memo, useMemo, useCallback } from 'react'
import styled from 'styled-components'
import {
	Manager,
	FilterLocation,
	MessageCreators,
} from 'visual-analytics-components'
import { FilterChip } from './FilterChip'
import { useFilterChips } from './useFilterChips'

export interface FilterChipComponentInnerProps {
	manager: Manager
}

export const FilterChipComponentInner: React.FC<FilterChipComponentInnerProps> = memo(
	function FilterChipComponentInner({ manager }) {
		const chips = useFilterChips(manager)

		const dismiss = useCallback(
			(location: FilterLocation) => {
				manager.publish(MessageCreators.Filter.clear(location, 'Dismiss Filter'))
			},
			[manager],
		)

		const chipElements = useMemo(
			() =>
				chips.map(cd => (
					<FilterChip
						key={`${cd.location.key}:${cd.location.table}`}
						data={cd}
						onClick={(): void => dismiss(cd.location)}
					/>
				)),
			[chips, dismiss],
		)

		return (
			<Container>
				<FilterContainer>{chipElements}</FilterContainer>
			</Container>
		)
	},
)

const Container = styled.div`
	width: 100%;
	height: 100%;
	max-width: 100%;
	max-height: 100%;
	display: flex;
	flex-direction: row;
`

const FilterContainer = styled.div`
	flex: 1;
	overflow-x: auto;
	overflow-y: hidden;
	display: flex;
	flex-direction: row;
`
