# Microsoft Visual Analytics Component (VAC)

An experiment in component-based, disaggregated, visual analytics from Microsoft Research.

This packages contains the VAC runtime, which allows VAC components to render and communicate with each other.

# Using Visual Analytics Components

Key Concepts:

- **Shared Data-Model** the Manager exposes a central data model that uses a familiar table/row paradigm. Each data table exposes various "slices" that contain subsets of rows. These are used to model data filtering operations and also for more ephemeral selection and highlight states.
- **Event-Based** visualizations coordinate data filtering & selection events, and UX interaction events via event objects. These events flow through a single, central hub that all VAC components listen to and may react to.
- **Configurability** each component defines its own configuration object format which can be used by clients to customize their behavior.
- **Independent Styles** Each component is rendered into a shadow DOM node, which allows to isolate their styles and prevent their CSS classes from interfering with each other.
- **Kickoff Event** when using VAC components, components do not render until a Manager instance is available. This is done by initiating a "kickoff" by invoking `ManagerImpl.createInstance(<dataset>)`

```jsx
function App(dataset: InputData) {
	const manager = useMemo(() => ManagerImpl.createInstance(dataset), [dataset])
	return (
		<div>
			<ManagerContext.Provider value={manager}>
				{/* Use HTML/CSS to lay-out visuals*/}
				<GraphComponent config={/*...*/} />
				<TitleComponent config={/*...*/} />
			</ManagerContext.Provider>
		</div>
	)
}
```

# Key Components

## Manager

- **Manager** - a singleton instance per application, the Manager is the heart of the VAC system. Components are instantiated with component-specific configuration and an instance of the current Manager. The manager acts as a facade to the data model, eventing hub, state persistence layer, theme provider, etc..

- **MessageHub** - This is a centralized event-based hub that allows visualizations to communicate with each other using message objects. Similar to redux-standard-actions, these messages have a `type` and a `payload`.

- **AuditLog** - a provenance tracking utility that logs what actions have been taken in a session.

- **StateManager** - VAC components may track their local state here. The idea here is to be able to persist state to a remote storage environment and allow for time-traveling to visual analytic states.

## Data Model

The VAC data model is a set of tables, which contains a set of row objects representing the data. These tables contain a set of _TableSlices_ which represent filtering levels of the data. These slices include:

- **All**
- **FilteredIn**
- **FilteredOut**
- **Selected**
- **Highlighted**

The base @essex/vac package comes with three flavors of data set implementations:

- **Abstract** - base implementation for dataset providers
- **PlainObject** - a dataset backed by plain JavaScript objects.
- **Mapped** - a dataset that allows for the Manager to apply a `data-mapping`, which can rename tables and fields.

## Message Factory

- **MessageTypes** - Common message types

- **MessageCreators** - Factory functions for message instance of common message types.
