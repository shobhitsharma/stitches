import getResolvedStyles from './utils/getResolvedStyles';

class StitchesRule<
	CSSVALUE extends number | string = number | string,
	CSSPROPS extends { [k in any]: CSSVALUE | CSSPROPS } = { [k in any]: CSSVALUE | {} },
	INIT extends CSSPROPS = CSSPROPS,
	UTILITY extends (value: CSSVALUE) => { [k in any]: CSSVALUE } = (value: CSSVALUE) => { [k in any]: CSSVALUE },
	UTILITIES extends { [k in any]: UTILITY } = { [k in any]: UTILITY }
> {
	constructor() {
		this.conditions = [];
		this.rules = new Set();
		this.selectors = [];
		this.shouldRender = false;
		this.style = {} as INIT;
		this.utilities = {} as UTILITIES;
	}

	renderClassNames() {
		this.shouldRender = true;

		const classNames: string[] = [];

		for (const rule of this.rules) classNames.push(...rule.renderClassNames());

		classNames.push(
			...this.selectors.reduce((selectors, selector) => {
				if (/^\./.test(selector)) selectors.push(selector.slice(1));
				return selectors;
			}, [] as string[]),
		);

		return classNames;
	}

	toCss() {
		let cssText = '';
		if (this.shouldRender) {
			cssText += getResolvedStyles(this.style, this.selectors, this.conditions, this.utilities);
		}
		return cssText;
	}

	toString() {
		return this.renderClassNames().join(' ');
	}

	conditions!: string[];
	rules!: Set<StitchesRule>;
	shouldRender!: boolean;
	selectors!: string[];
	style!: INIT;
	utilities!: UTILITIES;
}

export default StitchesRule;
