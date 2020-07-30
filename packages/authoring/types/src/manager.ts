/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Theme } from '@thematic/core'
import { Observable } from 'rxjs'
import { AuditLog } from './auditlog'
import { DataSet } from './data'
import { DataMapping } from './data/mapping'
import { Message } from './messaging/messages'
import { Callback, Unsubscribe } from './messaging/pubsub'

export enum DataContextMessageTypes {
	OnReceiveData = 'OnReceiveData',
}

/**
 * Interface for a Disaggregeted Visualization manager
 */
export interface Manager extends StateManager, MessageHub {
	/**
	 * The manager's unique identifier
	 */
	readonly id: string

	/**
	 * The operating data set
	 */
	readonly data: DataSet

	/**
	 * The visual theming parameters
	 */
	readonly theme: Theme

	/**
	 * Applies a data mapping to the data
	 * @param shape The data shape
	 * @param mapping The data mapping to apply
	 */
	applyMapping(mapping: DataMapping): Manager

	/**
	 * Returns a list of interaction descriptions
	 */
	getInteractionLog(): AuditLog<any>
}

/**
 * State management interface for Manager
 */
export interface StateManager {
	/**
	 * Gets the current state of a component
	 * @param componentId The component id
	 * @param instanceId The component instance
	 */
	getState(componentId: string, instanceId: string): any

	/**
	 * Sets the state of a component
	 * @param componentId The component ID
	 * @param instanceId The component instance
	 * @param state The component state
	 */
	setState(componentId: string, instanceId: string, state: any): void

	/**
	 * Subscribe to state change events
	 */
	onStateChange(callback: Callback): Unsubscribe
}

/**
 * Message hub interface
 */
export interface MessageHub {
	/**
	 * On observable stream of events for listening to messages
	 */
	messages: Observable<Message<any>>

	/**
	 * Publishes a message to the hub
	 * @param message The message to publish
	 */
	publish(message: Message<any>): void
}
