/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import React, { memo, useState, useEffect } from 'react'
import styled from 'styled-components'
import styles from './ErrorToast.module.scss'

export interface ErrorToastProps {
	error?: string
}
const HIDE_TIMEOUT = 4000
const SHOW_TIMEOUT = 1000

export const ErrorToast: React.FC<ErrorToastProps> = memo(function ErrorToast({
	error,
}) {
	const [viewStatus, setView] = useState<string>(styles.hide)
	useEffect(() => {
		if (error) {
			setTimeout(() => setView(styles.show), SHOW_TIMEOUT)
			setTimeout(() => setView(styles.hide), HIDE_TIMEOUT)
		}
	}, [error])

	return <Container className={viewStatus}>{error}</Container>
})

const Container = styled.div`
	min-width: 250px;
	margin-left: -125px;
	background-color: #333;
	color: #fff;
	text-align: center;
	border-radius: 2px;
	padding: 16px;
	position: fixed;
	z-index: 1;
	left: 50%;
	bottom: 30px;
	font-size: 17px;
`
