/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { LitElement, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { Subscription } from 'rxjs'
import { Manager  } from 'visual-analytics-components'

const DEFAULT_TITLE = ''
const DEFAULT_FONT_SIZE = '16pt'
const DEFAULT_FONT_WEIGHT = '300'
const DEFAULT_MARGIN = '0 15px 0 15px'

@customElement('vac-title')
export class LitTitle extends LitElement {
	@property() defaultTitle: string = DEFAULT_TITLE
	@property() fontSize: string = DEFAULT_FONT_SIZE
	@property() fontWeight: string = DEFAULT_FONT_WEIGHT
	@property() margin: string = DEFAULT_MARGIN
	@property() manager: Manager | undefined
	
 @state() private latestTitle = ''
	private subscription: Subscription | undefined

	private get titleValue() {
		return this.latestTitle || this.defaultTitle || DEFAULT_TITLE
	}

	private get titleColor() {
		return this.manager?.theme.text().fill().hex() || 'black';
	}

	private unsubscribeFromTitleUpdates() {
		this.subscription?.unsubscribe()
		this.subscription	= undefined
	}

	private subscribeToTitleUpdates() {
		if (this.manager) {
			if (this.subscription) {
				this.unsubscribeFromTitleUpdates()
			}
			this.subscription = this.manager.messages.subscribe(() => this.latestTitle = this.manager?.getInteractionLog().getLastEntry() || '')
		}
	}

	public willUpdate(changedProperties: Map<string,any>): void {
		if (changedProperties.has("manager")){
				this.subscribeToTitleUpdates()
			}
	}

	public connectedCallback(): void {
				super.connectedCallback() 
				this.subscribeToTitleUpdates()
	}

	public disconnectedCallback(): void {
				this.unsubscribeFromTitleUpdates()
	}

	render() {
		const styles = html`<style>
    .title {
						height: 100%;
						width: 100%;
						display: flex;
						align-items: center;
						margin: ${this.margin};
						font-weight: ${this.fontWeight};
						font-size: ${this.fontSize};			
						color: ${this.titleColor};
    }
		</style>`
		return html`
	  ${styles}
			<div className="title">${this.titleValue}</div>
		`
	}
}

