/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	FilterExpression,
	BooleanOperation,
	BooleanClause,
	FilterClause,
} from 'visual-analytics-components'
/* eslint-disable @typescript-eslint/no-var-requires */
const cnf = require('boolean-json-cnf')
const prune = require('boolean-json-prune')

// NOTE:
// This all works fine with cnf-based applications, but with other logical forms we'll need to handle clause negation.
// It should be straightforward, it's just not implemented yet.
//

function convertCnfStanza(andItem: any, clauseMap: ClauseMap): FilterClause[] {
	if (typeof andItem === 'string') {
		const clauseItem = clauseMap.getClause(andItem)
		return [clauseItem]
	} else if (andItem.and) {
		return andItem.and.map((clauseId: any) => clauseMap.getClause(clauseId))
	} else if (andItem.or) {
		// TODO: handle clause negation
		const orMap = andItem.or.map((clauseId: any) => clauseMap.getClause(clauseId))
		return [orMap]
	} else {
		throw new Error(`unhandled CNF clause: ${JSON.stringify(andItem, null, 4)}`)
	}
}

export function flatten(expr: FilterExpression): FilterClause[][] {
	const { expressions, operation } = expr
	const clauses: (BooleanClause | FilterClause)[] = Object.values(expressions)
	const root: BooleanClause = { operation, clauses }

	if (clauses.length === 0) {
		return []
	}

	const clauseMap = new ClauseMap()
	const clauseExpression = convertBooleanClause(root, clauseMap)
	const cnfClause = prune(cnf(clauseExpression))

	if (cnfClause == null) {
		return []
	} else if (typeof cnfClause === 'string') {
		return [[clauseMap.getClause(cnfClause)]]
	} else if (cnfClause.or) {
		return [convertCnfStanza(cnfClause, clauseMap)]
	} else if (cnfClause.and) {
		return cnfClause.and.map((andItem: any) =>
			convertCnfStanza(andItem, clauseMap),
		)
	} else {
		throw new Error(
			`unhandled logical form: ${JSON.stringify(cnfClause, null, 4)}`,
		)
	}
}

function convertClause(
	clause: BooleanClause | FilterClause,
	clauseMap: ClauseMap,
): any {
	if ((clause as any).clauses) {
		return convertBooleanClause(clause as BooleanClause, clauseMap)
	} else {
		return convertFilterClause(clause as FilterClause, clauseMap)
	}
}

function convertBooleanClause(
	{ operation, clauses }: BooleanClause,
	clauseMap: ClauseMap,
): any {
	const opKey = operation === BooleanOperation.AND ? 'and' : 'or'
	return {
		[opKey]: clauses.map((c: BooleanClause | FilterClause) =>
			convertClause(c, clauseMap),
		),
	}
}

function convertFilterClause(
	clause: FilterClause,
	clauseMap: ClauseMap,
): string {
	return clauseMap.addClause(clause)
}

class ClauseMap {
	private clauseMap: Record<string, FilterClause> = {}
	private clauseId = 0

	public addClause(clause: FilterClause): string {
		const id = `${this.clauseId++}`
		this.clauseMap[id] = clause
		return id
	}

	public getClause(id: string): FilterClause {
		return this.clauseMap[id]
	}
}
