/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { TweenLite, CSSPlugin, gsap } from 'gsap'
import { RefObject, useCallback } from 'react'

gsap.registerPlugin(CSSPlugin)

export function usePaneMousehandlers(
	ref: RefObject<any>,
	resourceLocation: string,
): [() => void, () => void, () => void] {
	// highlight div on mouseover
	const mouseEnter = useCallback(() => {
		if (ref && ref.current) {
			TweenLite.to(ref.current, 0.5, {
				ease: 'sine.out',
				opacity: 1.0,
			})
		}
	}, [ref])

	// return div to prev opacity
	const mouseLeave = useCallback(() => {
		if (ref && ref.current) {
			TweenLite.to(ref.current, 0.8, {
				ease: 'sine.out',
				opacity: 0.5,
			})
		}
	}, [ref])

	const onClick = useCallback(() => (window.location.href = resourceLocation), [
		resourceLocation,
	])

	return [mouseEnter, mouseLeave, onClick]
}
