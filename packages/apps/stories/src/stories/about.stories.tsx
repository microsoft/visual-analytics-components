/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/no-var-requires */
import { storiesOf } from '@storybook/react'
import React from 'react'
import ReactMarkdown from 'react-markdown'
const readmeText = require('../../../../../README.md').default
const pkg = require('../../../../../package.json')

console.log('readmeText', readmeText)
storiesOf('About Library', module).add('about', () => (
	<div style={{ padding: 20 }}>
		<h1>
			{pkg.name} - {pkg.version}
		</h1>
		<h2>{pkg.description}</h2>
		<h3>{pkg.repository.url}</h3>

		<div style={{ border: '1px solid grey', padding: 20 }}>
			<ReactMarkdown source={readmeText} />
		</div>
	</div>
))
