/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ThematicProvider } from '@thematic/react'
import * as React from 'react'
import { memo, useCallback } from 'react'
import { Container } from './Container'
import { Manager, ComponentConfiguration } from 'visual-analytics-components'

export interface InnerComponentProps<
	Configuration extends ComponentConfiguration
> {
	manager: Manager
	configuration: Configuration
}

export interface ComponentProps<Configuration extends ComponentConfiguration> {
	className?: string
	style?: React.CSSProperties
	configuration?: Configuration
}

export function createComponent<Configuration extends ComponentConfiguration>(
	InnerComponent:
		| React.FC<InnerComponentProps<Configuration>>
		| React.ComponentClass<InnerComponentProps<Configuration>>,
): React.FC<ComponentProps<Configuration>> {
	const VacWrapper: React.FC<ComponentProps<Configuration>> = memo(
		function VacWrapper({
			className,
			style,
			configuration = {} as Configuration,
		}) {
			return (
				<Container
					className={className}
					style={style || styles.brickWall}
					datamap={configuration?.dataMapping}
					configuration={configuration}
					renderComponent={useCallback(
						manager => (
							<ThematicProvider theme={manager.theme}>
								<InnerComponent manager={manager} configuration={configuration} />
							</ThematicProvider>
						),
						[configuration],
					)}
				/>
			)
		},
	)

	return VacWrapper
}

const styles: Record<string, React.CSSProperties> = {
	brickWall: {
		width: '100%',
		height: '100%',
	},
}
