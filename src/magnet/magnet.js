var magnets = document.querySelectorAll('a[href^="magnet:?xt=urn:btih:"]');
for (var i = 0; i < magnets.length; ++i) {
	magnets[i].target = '_self';
	magnets[i].addEventListener('click', (event) => {
		window.postMessage({ type: 'magnet', data: event.currentTarget.href }, location.origin);
	})
}
