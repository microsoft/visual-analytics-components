/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import React, { memo } from 'react'
import styled from 'styled-components'
export interface UsageInstructionsProps {
	className?: string
	style?: React.CSSProperties
}
export const UsageInstructions: React.FC<UsageInstructionsProps> = memo(
	function UsageInstructions({ className, style }) {
		return (
			<Container className={className} style={style}>
				<h3>
					Using the <i>Microsoft Embeddings Explorer</i>
				</h3>
				<TextPane>
					The <em>Microsoft Embeddings Explorer</em> is a client-only visual
					analytics tool for exploring embedded graph data along with primary graph
					data. The UI consists of a graph view, a 3D embeddings view, and an entity
					list.
					<h5>Expected Inputs:</h5>
					<ul>
						<li>
							<div>
								<b>[filename].model</b>: a word2vec text model file containing
								n-dimensional embeddings. Labels should map to vertex ids.
							</div>
							<br />
						</li>
						<li>
							<div>
								<b>vertices.[csv|tsv]</b>: a vertex list.
							</div>
							<div>
								<b>Fields:</b>
							</div>
							<ul>
								<li>
									<b>id (string):&nbsp;</b>The ID of the vertex
								</li>
								<li>
									<b>label (string, optional):&nbsp;</b>The vertex label; if not present,
									default to ID
								</li>
								<li>
									<b>x (number):&nbsp;</b>The x position of the vertex in the 2d graph
									layout
								</li>
								<li>
									<b>y (number):&nbsp;</b>The y position of the vertex in the 2d graph
									layout
								</li>
								<li>
									<b>weight (number):&nbsp;</b>The vertex weight
								</li>
								<li>
									<b>community (number, optional):&nbsp;</b>The community label the
									vertex belongs to, which is used for vertex coloration
								</li>
							</ul>
							<br />
						</li>
						<li>
							<div>
								<b>edges.[csv|tsv]</b>: an edge list
							</div>
							<div>
								<b>Fields:</b>
							</div>
							<ul>
								<li>
									<b>source (string):&nbsp;</b>The ID of the source vertex
								</li>
								<li>
									<b>target (string):&nbsp;</b>The ID of the target vertex
								</li>
								<li>
									<b>weight (number):&nbsp;</b>The weight of the connection
								</li>
							</ul>
							<br />
						</li>
						<li>
							<div>
								<b>communities.[csv|tsv]</b>: a community list (optional)
							</div>
							<div>
								<b>Fields:</b>
							</div>
							<ul>
								<li>
									<b>id (number):&nbsp;</b>The community ID
								</li>
								<li>
									<b>label (string):&nbsp;</b>The community label
								</li>
								<li>
									<b>size (number):&nbsp;</b>The community size
								</li>
								<li>
									<b>integrity (number, optional):&nbsp;</b>A metric of the
									community&apos;s cohesiveness
								</li>
							</ul>
							<br />
						</li>
					</ul>
				</TextPane>
			</Container>
		)
	},
)

const Container = styled.div``

const TextPane = styled.div`
	text-align: left;
`
