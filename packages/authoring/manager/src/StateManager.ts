/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	Callback,
	Unsubscribe,
	StateManager,
} from '@visual-analytics-components/types'

interface GlobalState {
	[componentId: string]: {
		[instanceId: string]: any
	}
}

/**
 * The component state manager
 */
export class StateManagerImpl implements StateManager {
	private state: GlobalState = {}
	private onStateChangeHandlers: (() => void)[] = []

	/**
	 * Gets the current state of a component
	 * @param componentId The component id
	 * @param instanceId The component instance
	 */
	public getState(componentId: string, instanceId: string): any {
		return this.state[componentId] && this.state[componentId][instanceId]
	}

	/**
	 * Sets the state of a component
	 * @param componentId The component ID
	 * @param instanceId The component instance
	 * @param state The component state
	 */
	public setState(componentId: string, instanceId: string, state: any): void {
		if (!this.state[componentId]) {
			this.state[componentId] = {}
		}
		this.state[componentId][instanceId] = state
	}

	/**
	 * Subscribe to state change events
	 */
	public onStateChange(callback: Callback): Unsubscribe {
		this.onStateChangeHandlers.push(callback)
		return (): void => {
			this.onStateChangeHandlers = this.onStateChangeHandlers.filter(
				h => h !== callback,
			)
		}
	}
}
