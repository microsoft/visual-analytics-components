/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import * as React from 'react'
import { memo, useMemo } from 'react'
import { useManager } from './hooks/useManager'
import { Manager, DataMapping } from 'visual-analytics-components'
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
}) {
	const manager = useManager(datamap)
	const rendered = useMemo(() => manager && renderComponent(manager), [manager])
	return manager == null ? null : (
		<ShadowDiv className={className} style={style}>
			{rendered}
		</ShadowDiv>
	)
})
