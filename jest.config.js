/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
const { configure } = require('@essex/jest-config')
module.exports = configure([
	"<rootDir>/setup-enzyme.js"
], "tsconfig.jest.json")
