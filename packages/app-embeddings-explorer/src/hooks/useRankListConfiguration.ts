/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useMemo } from 'react'
import {
	VerticesRanking,
	CommunityRanking,
	NeighborsRanking,
	InCommunityRanking,
	EmbeddingNeighborsCosine,
	EmbeddingNeighborsEuclidean,
} from '../rankings'
import { Configuration } from '@visual-analytics-components/ranklist-component'

export function useRankListConfiguration(
	hasEmbeddings: boolean,
): Configuration {
	const configuration: Configuration = useMemo(() => {
		const result: Configuration = {
			searchScope: 'ranklist',
			rankings: [
				new VerticesRanking(),
				new CommunityRanking(),
				new NeighborsRanking(),
				new InCommunityRanking(),
			],
		}
		if (hasEmbeddings) {
			result.rankings!.push(
				new EmbeddingNeighborsCosine(),
				new EmbeddingNeighborsEuclidean(),
			)
		}
		return result
	}, [hasEmbeddings])
	return configuration
}
