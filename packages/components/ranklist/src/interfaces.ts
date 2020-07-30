/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Observable } from 'rxjs'
import {
	Unsubscribe,
	Manager,
	ComponentConfiguration,
} from 'visual-analytics-components'

export interface MetricRange {
	min: number
	max: number
}

export interface MetricAnnotations {
	values: Record<string, number>
	min: number
	max: number
}

export type VisibleMap = Record<string, boolean> | undefined

export interface Configuration extends ComponentConfiguration {
	searchScope?: string
	rankings?: Ranking[]
	colorizer?: (input: RankedRow) => string
}

/**
 * WIP - Injectable Rankings
 */

export interface RankedRow {
	id: string
	label: string
	metric?: number
	submetric?: number
	category?: number | string
}

export type RowDataGroup = RankedRow[]

export interface Ranking {
	/**
	 * A unique identifier for this ranking
	 */
	id: string

	/**
	 * The display name of this ranking
	 */
	label: string

	/**
	 * A colorizer function for determining row colors
	 */
	colorizer?: (row: RankedRow) => string

	/**
	 * A flag indicating whether this ranking is visible in the selection view
	 */
	isVisible: boolean

	/**
	 * A flag indicating whether this ranking is enabled in the selection view
	 */
	isEnabled: boolean

	/**
	 * Groups of RowData
	 */
	groups: RowDataGroup[]

	handleClick?: (row: RankedRow) => void
	handleHover?: (row: RankedRow) => void

	/**
	 * The scale function for the metric range.
	 * Domain={metric span}
	 * Range=[0,1]
	 */
	metricScale?: (input: number) => number

	/**
	 * The scale function for the submetric range.
	 * Domain={metric span}
	 * Range=[0,1]
	 */
	submetricScale?: (input: number) => number

	/**
	 *
	 * @param handler The handler to subscribe on change events with
	 */
	onChange: Observable<void>

	/**
	 * Connect the ranking, rebuild the rank list
	 */
	connect?: () => Unsubscribe

	/**
	 * Initialize the ranking. Enabled state may change due to DV state changes
	 */
	initialize: (manager: Manager) => Unsubscribe
}
