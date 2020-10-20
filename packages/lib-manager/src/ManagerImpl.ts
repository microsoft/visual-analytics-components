/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Theme } from '@thematic/core'
import { Observable } from 'rxjs'
import { StringAuditLog } from './AuditLog'
import { MessageHubImpl } from './MessageHub'
import { StateManagerImpl } from './StateManager'
import { generateUniqueId } from './generateUniqueId'
import { MappedDataSet } from '@visual-analytics-components/mapped-dataset'
import {
	Message,
	Callback,
	Unsubscribe,
	DataSet,
	Manager,
	MessageHub,
	DataMapping,
	StateManager,
} from '@visual-analytics-components/types'

/**
 * A facade class for the VAC component management runtime
 */
export class ManagerImpl implements Manager {
	public readonly id = generateUniqueId()

	private constructor(
		private readonly dataset: DataSet,
		private readonly messageHub: MessageHub,
		private readonly stateManager: StateManager,
		public readonly theme: Theme,
		private readonly auditLog: StringAuditLog,
		public readonly mapping: DataMapping | undefined,
	) {}

	public static createInstance(dataset: DataSet, theme: Theme): Manager {
		const messageHub = new MessageHubImpl()
		const stateManager = new StateManagerImpl()
		const auditLog = new StringAuditLog()
		const instance = new ManagerImpl(
			dataset,
			messageHub,
			stateManager,
			theme,
			auditLog,
			undefined,
		)
		if (dataset.receiveMessageHub) {
			dataset.receiveMessageHub(messageHub)
		}
		return instance
	}

	public applyMapping(mapping: DataMapping): Manager {
		return new ManagerImpl(
			new MappedDataSet(this.dataset, mapping),
			this.messageHub,
			this.stateManager,
			this.theme,
			this.auditLog,
			mapping,
		)
	}

	public getState(componentId: string, instanceId: string): any {
		return this.stateManager.getState(componentId, instanceId)
	}

	public setState(componentId: string, instanceId: string, state: any): void {
		return this.stateManager.setState(componentId, instanceId, state)
	}

	public onStateChange(callback: Callback): Unsubscribe {
		return this.stateManager.onStateChange(callback)
	}

	public get data(): DataSet {
		return this.dataset
	}

	public publish(message: Message<any>): void {
		message.description && this.auditLog.log(message.description)
		return this.messageHub.publish(message)
	}

	public get messages(): Observable<Message<unknown>> {
		return this.messageHub.messages
	}

	public getInteractionLog(): StringAuditLog {
		return this.auditLog
	}
}
