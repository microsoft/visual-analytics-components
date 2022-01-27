/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import * as React from 'react'
import { memo, useMemo } from 'react'
import { Manager, DataMapping } from 'visual-analytics-components'
import { useManager } from './hooks/useManager'
/* eslint-disable-next-line @typescript-eslint/no-var-requires */
const root = require('react-shadow/styled-components').default

const ShadowDiv = root['div'] as React.ComponentType<any>

/**
 * Interface for a Visual Analytics Component
 */
export interface ContainerProps {
	className?: string
	style?: React.CSSProperties
	configuration: any
	manager?: Manager
	datamap?: DataMapping

	/**
	 * The component to render
	 */
	renderComponent: (manager: Manager) => JSX.Element
}

export const Container: React.FC<ContainerProps> = memo(function Container({
	renderComponent,
	datamap,
	className,
	style,
	manager: propManager,
}) {
	const manager = useManager(propManager, datamap)
	const rendered = useMemo(
		() => manager && renderComponent(manager),
		[manager, renderComponent],
	)
	return manager == null ? null : (
		<ShadowDiv className={className} style={style}>
			{rendered}
		</ShadowDiv>
	)
})
