/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useState, useCallback } from 'react'

/**
 * Hoverstate logic encapsulation. The return value of this function is:
 * [
 *   0 - A boolean value representing the hoverstate,
 *   1 - A callback to attach to JSX on startHover events
 *   2 - A callback to attach to JSX on endHover events
 * ]
 * @param onStartHover An upstream callback to invoke when hovering starts
 * @param onEndHover An upstream callback to invoke when hovering ends
 */
export function useHoverState(
	onStartHover: () => void,
	//	onEndHover: () => void,
): [boolean, () => void, () => void] {
	const [hovered, setHovered] = useState(false)
	const startHover = useCallback(() => {
		onStartHover()
		setHovered(true)
	}, [onStartHover])
	const endHover = useCallback(() => {
		setHovered(false)
		//onEndHover()
	}, [setHovered])
	return [hovered, startHover, endHover]
}
