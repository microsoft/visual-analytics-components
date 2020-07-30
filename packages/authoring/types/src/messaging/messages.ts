/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { MessageHub } from '../manager'

export type MessageCreator<T> = (
	payload?: T,
	description?: string,
) => Message<T>

export function createAction<T>(type: string): MessageCreator<T> {
	return (payload?: T, description?: string): Message<T> => ({
		type,
		description,
		payload,
	})
}

/**
 * Interface for component messaging, used to coordinate cross-visual interactions or data filtering operations
 */
export interface Message<Payload> {
	type: string
	description?: string
	payload?: Payload
}

/**
 * Callback type for message listeners
 */
export type MessageCallback<T> = (message: Message<T>) => void

/**
 * Interface for a message-handling class
 */
export interface MessageHandler {
	/**
	 * Handles a Message
	 * @param message The message object
	 */
	onMessage(message: Message<any>): void
}

export interface MessageHubReceiver {
	receiveMessageHub(hub: MessageHub): void
}
