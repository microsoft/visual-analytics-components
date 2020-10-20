/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Theme } from '@thematic/core'

/**
 * Gets CSS styles for the component
 * @param theme The current theme
 */
export function getStyles(theme: Theme): string {
	const textColor = theme ? theme.text().fill().hex() : '#333'
	const metricColor = theme ? theme.rect().fill().hex() : '#bbb'
	return `
			.hidden {
				display: none;
			}

			.item-name {
				font-size: 7pt;	
				color: ${textColor};
			}

			.item-metric {
				font-weight: 300;
				color: ${textColor}
			}

			.hovered {
				font-weight: bold;
			}

			.item-metric-bar {
				position: absolute;
				left: 0;
				top: 0;
				height: 100%;
				opacity: 0.3;
			}

			.item-submetric-bar {
				position: absolute;
				left: 0;
				bottom: 0;
				height: 1px;
				opacity: 0.7;
				background-color: ${metricColor};
			}
		`
}
