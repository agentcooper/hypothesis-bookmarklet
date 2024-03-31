import { createBookmarklet } from './helper';

document.querySelector<HTMLInputElement>('#username')!.value = localStorage.getItem('username') ?? '';
document.querySelector<HTMLInputElement>('#token')!.value = localStorage.getItem('token') ?? '';

function init(code: string) {
	function render() {
		const username = document.querySelector<HTMLInputElement>('#username')!.value;
		const token = document.querySelector<HTMLInputElement>('#token')!.value;
		localStorage.setItem('username', username);
		localStorage.setItem('token', token);

		const finalScript = code.replaceAll('__USERNAME__', username).replaceAll('__TOKEN__', token);
		const javascriptURL = createBookmarklet(finalScript);

		document.querySelector<HTMLInputElement>('#output')!.value = javascriptURL;
		document.querySelector('#bookmarklet')!.setAttribute('href', javascriptURL);
	}

	render();

	for (const input of document.querySelectorAll('input')) {
		input.addEventListener('input', () => {
			render();
		});
	}
}

fetch('./lib/annotator.umd.cjs')
	.then((res) => res.text())
	.then((text) => {
		init(text);
	});
