/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Theme } from '@thematic/core'
import { Configuration } from '../../interfaces'

/**
 * Gets CSS styles for the component
 * @param theme The current theme
 * @param config The component configuration
 */
export function getStyles(theme: Theme, config: Configuration): string {
	const fontSize = config.fontSize || '16pt'
	const fontWeight = config.fontWeight || '300'
	const margin = config.margin || '0 15px 0 15px;'
	const titleColor = theme.text().fill().hex()

	return `
    .title {
			height: 100%;
			width: 100%;
			display: flex;
			align-items: center;
      margin: ${margin};
      font-weight: ${fontWeight};
      font-size: ${fontSize};			
			color: ${titleColor};
    }
  `
}
