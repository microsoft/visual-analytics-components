/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	Axes,
	GraphView,
	HighlightHoveredNode,
	LabelHoveredNode,
	HandleNodeClicks,
	Nodes,
	Edges,
	NodeSetHighlight,
	NodeSetLabel,
	Camera,
} from '@topologic/react'
import {
	SettingsPane,
	DisplaySettings,
	EdgeSettings,
	NodeSettings,
} from '@topologic/render-controls-react'
import { GraphRenderer, RenderConfiguration } from '@topologic/renderer'
import * as React from 'react'
import {
	memo,
	useMemo,
	useState,
	useEffect,
	useCallback,
	RefObject,
} from 'react'
import useResizeObserver from 'use-resize-observer'
import { Manager } from 'visual-analytics-components'
// import { LayoutSettings } from '@topologic/layout-react'
import { Configuration, DEFAULT_INSTANCE_ID, COMPONENT_ID } from '../interfaces'
import { GlobalStyles } from './GlobalStyles'
import { useColorizer } from './hooks/useColorizer'
import { useGraphData } from './hooks/useGraphData'
import { useHoverHandler } from './hooks/useHoverHandler'
import { usePositionChanges } from './hooks/usePositionChanges'
import { useVertexClickHandler } from './hooks/useVertexClickHandler'
import { useHighlightedVertices, useSelectedVertices } from './hooks/vac'
// eslint-disable-next-line  @typescript-eslint/ban-ts-comment
// @ts-ignore

export interface GraphProps {
	manager: Manager
	configuration: Configuration
}

const styles: Record<string, React.CSSProperties> = {
	brickWall: {
		height: '100%',
		width: '100%',
	},
}

export const Graph: React.FC<GraphProps> = memo(function GraphComponentInner({
	manager,
	configuration,
}) {
	const showControls =
		configuration.showControls != null ? configuration.showControls : true
	const renderSettings = useMemo(() => configuration.rendering || {}, [
		configuration,
	])
	const controlsSettings = useMemo(() => configuration.controls || {}, [
		configuration,
	])
	const [api, setApi] = useState<GraphRenderer>()
	const is3D = Boolean(renderSettings.is3D)
	const colorizer = useColorizer(manager, configuration)
	const graphData = useGraphData(manager, is3D)
	const handleVertexClick = useVertexClickHandler(manager)
	const highlighted: string[] = useHighlightedVertices(manager)
	const selected: string[] = useSelectedVertices(manager)
	const onHover = useHoverHandler(manager)
	const { ref } = useResizeObserver()
	usePositionChanges(api, configuration, manager)
	const instanceId = configuration.instanceId || DEFAULT_INSTANCE_ID

	const renderConfig: RenderConfiguration | undefined = api?.config
	useEffect(() => {
		if (renderConfig) {
			// Load any existing config at startup
			const existingState = manager.getState(COMPONENT_ID, instanceId)
			if (existingState) {
				renderConfig.load(existingState)
			}

			// Set up a subscription
			const subscription = (renderConfig as any).onChange.subscribe(() => {
				manager.setState(COMPONENT_ID, instanceId, renderConfig.copy())
			})
			return (): void => subscription.unsubscribe()
		}
	}, [renderConfig, instanceId, manager])

	return (
		<>
			<GlobalStyles />
			<div style={styles.brickWall} ref={ref as RefObject<HTMLDivElement>}>
				<GraphView
					colorizer={colorizer}
					data={graphData}
					backgroundColor={[0, 0, 0, 0]}
					is3D={is3D}
					ref={useCallback(
						ref => {
							if (ref !== api) {
								setApi(ref)
							}
						},
						[api],
					)}
					style={styles.brickWall}
				>
					<Axes
						inCorner={renderSettings.cornerAxes}
						shown={renderSettings.drawAxes}
					/>
					<Camera interactive />
					<HandleNodeClicks onClick={handleVertexClick} />
					<HighlightHoveredNode onHover={onHover} />
					<LabelHoveredNode />
					<NodeSetHighlight vertexIds={highlighted} />
					<NodeSetLabel vertexIds={highlighted} />
					<NodeSetHighlight vertexIds={selected} />
					<NodeSetLabel vertexIds={selected} />
					<Nodes
						shown={renderSettings.drawNodes}
						minRadius={renderSettings.nodeMinRadius}
						maxRadius={renderSettings.nodeMaxRadius}
						outline={renderSettings.nodeOutline}
						hideOnMove={renderSettings.hideNodesOnMove}
					/>
					<Edges
						shown={renderSettings.drawEdges}
						alpha={renderSettings.edgeAlpha}
						minWidth={renderSettings.edgeMinWidth}
						maxWidth={renderSettings.edgeMaxWidth}
						hideOnMove={renderSettings.hideNodesOnMove}
						depthWrite={renderSettings.edgeDepthWrite}
						antialias={renderSettings.edgeAntialias}
						constantWidth={renderSettings.constantEdgeWidth}
					/>
					{showControls ? (
						<SettingsPane>
							<DisplaySettings
								interpolationTimeRange={controlsSettings.displayInterpolationTimeRange}
							/>
							<NodeSettings
								minRadiusRange={controlsSettings.nodeMinRadiusRange}
								maxRadiusRange={controlsSettings.nodeMaxRadiusRange}
							/>
							<EdgeSettings
								alphaRange={controlsSettings.edgeAlphaRange}
								minWidthRange={controlsSettings.edgeMinWidthRange}
								maxWidthRange={controlsSettings.edgeMaxWidthRange}
							/>
						</SettingsPane>
					) : null}
				</GraphView>
			</div>
		</>
	)
})
