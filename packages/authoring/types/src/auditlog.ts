/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export interface AuditLog<T> {
	log(entry: T): void
	getEntries(): T[]
	getLastEntry(): T
}
