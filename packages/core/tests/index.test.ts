import createCss from '../src/index';

test('basic functionality', () => {
	const { css, global, toString } = createCss({
		theme: {
			color: {
				lite: 'gainsboro',
			},
			radii: {
				full: '9999px',
			},
			space: {
				full: '1em',
				tenSixteenth: 'calc(10em / 16)',
			},
		},
	});

	global({
		'@import': 'url("https://unpkg.com/sanitize.css")',
		'body': {
			'backgroundColor': 'red',
			'color': 'red',
			'&:hover': {
				backgroundColor: 'red',
				color: 'red',
			},
		},
		'pre': {
			'backgroundColor': 'red',
			'color': 'red',
			'&:hover': {
				backgroundColor: 'red',
				color: 'girl',
			},
		},
	});

	const buttonClass = css({
		'backgroundColor': '$lite',
		'borderRadius': '$full',
		'fontWeight': 500,
		'padding': '$tenSixteenth $full',
		'border': 0,
		'transition': 'all 200ms ease',

		'&:hover': {
			transform: 'translateY(-2px)',
			boxShadow: '0 10px 25px rgba(0, 0, 0, .3)',
		},
	});

	const darkButtonClass = css(buttonClass, {
		backgroundColor: 'black',
		color: 'white',
	});

	// create button, write css
	const expectHML = `<button class="rule-1 rule-2">Styled Button</button>`;
	const resultHML = `<button class="${darkButtonClass}">Styled Button</button>`;

	expect(resultHML).toBe(expectHML);

	const expectCSS = `@import url("https://unpkg.com/sanitize.css");body{background-color:red;color:red;}body:hover{background-color:red;color:red;}pre{background-color:red;color:red;}pre:hover{background-color:red;color:girl;}.rule-1{background-color:var(--colors-lite);border-radius:var(--radii-full);font-weight:500;padding:var(--space-tenSixteenth) var(--space-full);border:0;transition:all 200ms ease;}.rule-1:hover{transform:translateY(-2px);box-shadow:0 10px 25px rgba(0, 0, 0, .3);}.rule-2{background-color:black;color:white;}:root{--color-lite:gainsboro;--radii-full:9999px;--space-full:1em;--space-tenSixteenth:calc(10em / 16);}`;
	const resultCSS = toString();

	expect(resultCSS).toBe(expectCSS);
});
