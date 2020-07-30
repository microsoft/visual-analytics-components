# @visual-analytics-components/react

Utilities for creating VAC components using React.

# Getting Started

```tsx
import {
	createComponent,
	ComponentProps,
} from '@visual-analytics-components/react'

/**
 * 1) Define a custom configuration for your component that consumers will utilize.
 */
import { ComponentConfiguration } from 'visual-analytics-components'

export interface Configuration extends ComponentConfiguration {
	message: string
}

/**
 * 2) Define a React component for your visualization.
 */
function MyVisualReactComponent({ manager, configuration }) {
	return <div>hello! {configuration.message}</div>
}

/**
 * 3) Define CSS styles based on a Thematic theme
 */
function getStyles(theme: Theme) {
	return `
    .item {
      font-size: 20px;
    }
  `
}

/**
 * 4) Use the wrapper function to wire your React component into the VAC system.
 */
export const MyComponent: React.FC<ComponentProps<
	Configuration
>> = createComponent<Configuration>(MyVisualReactComponent, getStyles)
```
