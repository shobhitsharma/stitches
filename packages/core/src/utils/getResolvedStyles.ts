import { isAnyNonArrayObject } from './core';
import getResolvedProperty from './getResolvedProperty';
import getResolvedSelectors from './getResolvedSelectors';
import getResolvedValue from './getResolvedValue';
import isAtRulePrelude from './isAtRulePrelude';

/** Returns CSS text resolved from mixed properties. */
const getResolvedStyles = (
	/** Properties like `{ color: 'tomato' }` */
	props: any,
	/** Selectors like `body` or `&:hover` */
	selectorials: string[],
	/** Conditionals like `@media` or `@font-face` */
	conditionals: string[],
	/** Utility property functions like `(value) => ({ marginLeft: value, marginRight: value })` */
	utilities: any,
) => {
	let cssText = '';

	let hasDeclarationBlock: boolean = false;

	const hasConditionals = Boolean(conditionals.length);
	const hasSelectorials = Boolean(selectorials.length);

	/** Adds the opening portion of a declaration block */
	const addDeclarationBlockOpening = () => {
		cssText += hasConditionals ? conditionals.join('{') + '{' : '';
		cssText += hasSelectorials ? selectorials.join(',') : '';
		cssText += hasSelectorials ? '{' : '';
	};

	/** Adds the closing portion of a declaration block */
	const addDeclarationBlockClosing = () => {
		cssText += '}'.repeat(conditionals.length + (hasSelectorials ? 1 : 0));
	};

	const processRules = (props: any) => {
		for (const name in props) {
			const data = props[name];

			if (isAnyNonArrayObject(data)) {
				// the rule is either a nested condition or a nested selector

				// close an existing declaration block
				if (hasDeclarationBlock) {
					addDeclarationBlockClosing();
					hasDeclarationBlock = false;
				}

				if (isAtRulePrelude(name)) {
					// add the CSS of a nested condition block (like `@media all`)
					cssText += getResolvedStyles(data, selectorials, [...conditionals, name], utilities);
				} else {
					// add the CSS of a nested selector block (like `&:focus`)
					cssText += getResolvedStyles(
						data,
						hasSelectorials ? getResolvedSelectors(selectorials, name.split(/\s*,\s*/)) : name.split(/\s*,\s*/),
						conditionals,
						utilities,
					);
				}
			} else if (name in utilities) {
				// the rule is forwarded to a utility

				processRules(utilities[name](data));
			} else {
				// the rule is a declaration block

				// open an new declaration block
				if (!hasDeclarationBlock) {
					addDeclarationBlockOpening();
					hasDeclarationBlock = true;
				}

				const divider = isAtRulePrelude(name) ? ' ' : ':';

				cssText += getResolvedProperty(name) + divider + getResolvedValue(data, name) + ';';
			}
		}
	};

	processRules(props);

	if (hasDeclarationBlock) addDeclarationBlockClosing();
	if (hasConditionals) {
		for (const conditional of conditionals) {
			if (conditional.slice(0, 7) === '@import') {
				cssText += conditional.replace(/;?$/, ';');
			}
		}
	}

	return cssText;
};

export default getResolvedStyles;
