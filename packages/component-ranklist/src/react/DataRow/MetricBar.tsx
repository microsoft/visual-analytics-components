/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import * as React from 'react'
import { memo, useMemo } from 'react'

export interface MetricBarProps {
	className: string
	widthPercent?: number
	color?: string
}
export const MetricBar: React.FC<MetricBarProps> = memo(function MetricBar({
	className,
	widthPercent,
	color,
}) {
	const itemMetricStyle = useMemo(() => {
		const result: React.CSSProperties = {}
		if (widthPercent != null) {
			result.width = `${widthPercent}%`
		}
		if (color != null) {
			result.backgroundColor = color
		}
		return result
	}, [widthPercent, color])
	return <div className={className} style={itemMetricStyle} />
})
