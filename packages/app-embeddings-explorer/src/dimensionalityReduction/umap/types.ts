/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export enum UmapMessageType {
	// Manager to Worker
	Execute = 'EXECUTE',
	Cancel = 'CANCEL',
	Configure = 'CONFIGURE',

	// Worker to Manager
	Progress = 'PROGRESS',
	Complete = 'COMPLETE',
	Error = 'ERROR',
}
