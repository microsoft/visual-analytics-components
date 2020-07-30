/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable import/no-webpack-loader-syntax, import/no-unresolved */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import agGridCss from '!!raw-loader!ag-grid-community/dist/styles/ag-grid.min.css'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import agGridThemeCss from '!!raw-loader!ag-grid-community/dist/styles/ag-theme-dark.css'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import agGridWebFont from '!!raw-loader!ag-grid-community/dist/styles/agGridClassicFont.css'

/**
 * Gets CSS styles for the vac component
 * @param theme The current theme
 */
export function getStyles(): string {
	return `
			${agGridCss}
			${agGridThemeCss}
			${agGridWebFont}
		`
}
