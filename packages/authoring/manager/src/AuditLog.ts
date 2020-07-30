/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { AuditLog } from '@visual-analytics-components/types'

/**
 * The interaction event description log
 */
export class StringAuditLog implements AuditLog<string> {
	private entries: string[] = []

	public log(entry: string): void {
		this.entries.push(entry)
	}

	public getEntries(): string[] {
		// returning the slice is more secure (can't tamper with actual audit) but less performant
		return this.entries.slice()
	}

	public getLastEntry(): string {
		return this.entries.length ? this.entries[this.entries.length - 1] : ''
	}
}
