/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Message, Predicate } from 'visual-analytics-components'

export const isSearchScopeEvent = (
	searchScope: string,
): Predicate<Message<undefined | { searchScope?: string }>> => (
	event: Message<undefined | { searchScope?: string }>,
): boolean => event?.payload?.searchScope === searchScope
