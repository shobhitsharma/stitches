import StitchesSheet from './Sheet';

/** ... */
function createCss(
	/** ... */
	opts?: never | {} | { theme: any },
) {
	const sheet = new StitchesSheet();
	sheet.theme = Object(Object(opts).theme);

	return sheet;
}

export default createCss;
