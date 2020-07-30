/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Message, MessageHub } from '@visual-analytics-components/types'
import { Subject, asyncScheduler, Observable } from 'rxjs'
import { observeOn } from 'rxjs/operators'

export class MessageHubImpl implements MessageHub {
	public readonly _messages = new Subject<Message<any>>()

	public constructor(private readonly asyncMessages = true) {}

	public publish(message: Message<any>): void {
		this._messages.next(message)
	}

	public get messages(): Observable<Message<unknown>> {
		if (this.asyncMessages) {
			return this._messages.pipe(observeOn(asyncScheduler))
		} else {
			return this._messages
		}
	}
}
