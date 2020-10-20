/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useCallback } from 'react'

interface Cookies {
	[key: string]: string | undefined
}
export function useCookies(
	keysToPersist: Cookies,
): [
	(key: string, value?: string) => void,
	(key: string) => string | undefined,
	() => Cookies | undefined,
	() => void,
] {
	const setCookie = (key: string, value?: string): void => {
		if (value) {
			document.cookie = `${key}=${value}`
		}
	}

	const getCookie = (key: string): string => {
		const regexp = new RegExp(`.*${key}=([^;]*)`)
		const result = regexp.exec(document.cookie)
		if (result) {
			return result[1]
		}
	}

	const setAllCookies = useCallback(() => {
		Object.keys(keysToPersist).forEach((key: string) => {
			setCookie(key, keysToPersist[key])
		})
	}, [keysToPersist])

	const getAllCookies = useCallback(() => {
		return Object.keys(keysToPersist).reduce((acc: Cookies, key: string) => {
			const value = getCookie(key)
			acc[key] = value
			return acc
		}, {})
	}, [keysToPersist])

	return [setCookie, getCookie, getAllCookies, setAllCookies]
}
