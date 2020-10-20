/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import React, { memo } from 'react'
import { Component } from '../common'
import { DatatableComponent } from '@visual-analytics-components/datatable-component'

export const WithoutEmbeddings: React.FC = memo(function WithoutEmbeddings() {
	return (
		<Component>
			<DatatableComponent />
		</Component>
	)
})
