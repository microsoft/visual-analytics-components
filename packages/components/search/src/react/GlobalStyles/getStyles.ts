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
	return `
  .search-box {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;				
    font: inherit;
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
    border-radius: 3px;
    padding: 2px 4px;
    border: 1px solid ${theme.application().border()};
    color: ${theme.application().foreground()};
    background-color: ${theme.application().background()};
    overflow: hidden;
  }
  `
}
