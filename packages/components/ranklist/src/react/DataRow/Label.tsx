/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import classnames from 'classnames'
import * as React from 'react'
import { memo, useMemo } from 'react'

export interface LabelProps {
	className: string
	text: string
	hovered?: boolean
}
export const Label: React.FC<LabelProps> = memo(function Label({
	className,
	hovered,
	text,
}) {
	const labelClassName = useMemo(() => classnames(className, { hovered }), [
		className,
		hovered,
	])
	return <span className={labelClassName}>{text}</span>
})
