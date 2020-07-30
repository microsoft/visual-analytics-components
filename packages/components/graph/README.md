# graph-vac

A network visualization component for disaggregated visualization.

## Configuration Options

- **id** _(string)_: The instance identifier for this component.
- **isLayoutSupported** _(boolean, optional)_: Whether this component should present layout controls.
- **attemptInitialLayout** _(boolean, optional)_: If the data is unpositioned, should this component attempt an initial 2D layout of the graph data.
- **is3DSupported** _(boolean, optional)_: A flag indicating whether this visual should expose a control allowing the user to select either 2D or 3D views.
- **emitsViewportHighlights** _(boolean, optional)_: A flag indicating whether this visual should emit events for when vertices are highlighted via hover actions.
- **receivesViewportHighlights** _(boolean, optional)_: A flag indicating whether this visual should accept events for when vertices are highlighted to synchronize highlights.
- **renderSettings**: _(TensorGraphRenderSettings, optional)_: A settings object specific to rendering.

#### TensorGraphRenderSettings

- **constantEdgeWidth** _(boolean, optional)_: a flag indicating whether edges should have a consistent width vs a width variable on edge weight (default=true).
- **cornerAxes** _(boolean, optional)_: a flag indicating whether the axes guides should be rendered in the corner (e.g. minimap-style).
- **drawAxes** _(boolean, optional)_: a flag indicating whether the axes should be drawn at all (default=true).
- **drawEdges** _(boolean, optional)_: A flag indicating whether to draw the edges of the graph data (default=false).
- **drawNodes** _(boolean, optional)_: A flag indicating whether to draw the vertices of the graph data (default=true).
- **edgeAlpha** _(number, optional)_: A number between [0-1] indicating the edge opacity.
- **edgeAntialias** _(boolean, optional)_: A flag indicating whether to use antialiasing when rendering edges (default=false).
- **edgeDepthWrite** _(boolean, optional)_: A flag indicating whether to use depth-writing when rendering edges (default=false).
- **edgeMaxWidth** _(number, optional)_: The maximum width of edges to render.
- **edgeMinWidth** _(number, optional)_: The minimum width of edges to render.
- **hideDeselected** _(boolean, optional)_: Whether to hide/occlude deselected vertices (default=false).
- **hideEdgesOnMove** _(boolean, optional)_: A flag indicating whether to hide edges when moving the graph (default=false).
- **hideNodesOnMove** _(boolean, optional)_: A flag indicating whether to hide nodes when moving the graph (default=false).
- **interpolationTime** _(boolean, optional)_: Interpolation time to use when animating between positions.
- **is3D** _(boolean, optional)_: Whether to render in 3D mode (default=false).
- **nodeMaxRadius** _(number, optional)_: The minimum rendering radius of the nodes.
- **nodeMinRadius** _(number, optional)_: The maximum rendering radius of the nodes.
- **nodeOutline** _(boolean, optional)_: A flag indicating whether to render node outlines.
