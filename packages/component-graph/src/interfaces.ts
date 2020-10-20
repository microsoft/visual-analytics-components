/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { ColorVector } from '@graspologic/renderer'
import { ComponentConfiguration } from 'visual-analytics-components'

export interface Vertex {
	id: string
	label?: string
	weight?: number
	color?: string
	category?: number
	x: number
	y: number
	z?: number
	[key: string]: any
}

export interface Edge {
	source: string
	target: string
	weight?: number
}

export const COMPONENT_ID = 'graph-component'
export const DEFAULT_INSTANCE_ID = 'graph-component-instance'

/**
 * Interface for the tensor graph high-level settings
 */
export interface Configuration extends ComponentConfiguration {
	isLayoutSupported?: boolean
	attemptInitialLayout?: boolean
	is3DSupported?: boolean
	emitsViewportHighlights?: boolean
	receivesViewportHighlights?: boolean
	colorizer?: (category: number) => ColorVector
	showControls?: boolean

	/**
	 * Renderer Configuration
	 */
	rendering?: RenderConfiguration

	/**
	 * Controls Configuration
	 */
	controls?: ControlsConfiguration
}

export interface ControlsConfiguration {
	// Node Controls
	nodeMinRadiusRange?: [number, number]
	nodeMaxRadiusRange?: [number, number]

	// Edge Controls
	edgeAlphaRange?: [number, number]
	edgeMinWidthRange?: [number, number]
	edgeMaxWidthRange?: [number, number]

	// Display Controls
	displayInterpolationTimeRange?: [10, 10000]
}

/**
 * Interface for the TensorGraph rendering settings
 */
export interface RenderConfiguration {
	constantEdgeWidth?: boolean
	cornerAxes?: boolean
	drawAxes?: boolean
	drawEdges?: boolean
	drawNodes?: boolean
	edgeAlpha?: number
	edgeAntialias?: boolean
	edgeDepthWrite?: boolean
	edgeMaxWidth?: number
	edgeMinWidth?: number
	hideDeselected?: boolean
	hideEdgesOnMove?: boolean
	hideNodesOnMove?: boolean
	interpolationTime?: number
	is3D?: boolean
	nodeMaxRadius?: number
	nodeMinRadius?: number
	nodeOutline?: boolean
}
