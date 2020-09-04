/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import React from 'react'
import { Text, Link } from './Common'

export const PrivacyStatement: React.FC<{
	style?: React.CSSProperties
}> = ({ style }) => (
	<Text style={style}>
		<Link
			target="_blank"
			href="https://privacy.microsoft.com/en-us/privacystatement/"
		>
			Privacy and Cookies
		</Link>
	</Text>
)
