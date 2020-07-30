/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
// eslint-disable-next-line
/// <reference path="./react-app-env.d.ts" />
import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'
import 'dat.gui/build/dat.gui.css'
import './index.css'

const root = document.createElement('div')
root.id = 'root'
document.body.appendChild(root)
ReactDOM.render(<App />, root)
