/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable import/no-webpack-loader-syntax, @typescript-eslint/no-var-requires */
const guiCssText = require('!!raw-loader!dat.gui/build/dat.gui.css').default

/**
 * Gets CSS styles for the component
 */
export function getStyles(): string {
	return `
    ${guiCssText}
    .dg.main .close-button.close-bottom {
      position: relative;
    }
  `
}
