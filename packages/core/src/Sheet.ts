import getResolvedTheme from './utils/getResolvedTheme';
import isStitchesRule from './utils/isStitchesRule';
import StitchesRule from './Rule';

let iterator = 0;

class StitchesSheet {
	constructor() {
		this.rules = new Set();

		this.css = this.css.bind(this);
		this.global = this.global.bind(this);
		this.toString = this.toString.bind(this);
	}

	/** Returns a new CSS rule bound to the current sheet. */
	css(...args: any[]) {
		const hash = ++iterator;

		const rule = new StitchesRule();
		rule.selectors = ['.rule-' + hash];

		for (const arg of args) {
			if (isStitchesRule(arg)) rule.rules.add(arg);
			else rule.style = arg;
		}

		this.rules.add(rule);

		return rule;
	}

	/** Creates new global CSS rules bound to the current sheet. */
	global(style: any) {
		const rule = new StitchesRule();
		rule.shouldRender = true;
		rule.style = style;
		this.rules.add(rule);
	}

	/** Returns the renderable CSS text of the current sheet. */
	getCssText() {
		let cssText = '';

		for (const rule of this.rules) cssText += rule.toCss();

		cssText += getResolvedTheme(this.theme);

		return cssText;
	}

	/** Returns the renderable CSS text of the current sheet. */
	toString() {
		return this.getCssText();
	}

	rules!: Set<StitchesRule>;
	theme!: any;
}

export default StitchesSheet;
