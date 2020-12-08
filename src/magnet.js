document.querySelectorAll('a[href^="magnet:?xt=urn:btih:"]').forEach(a => 
    a.addEventListener('click', event =>
        chrome.runtime.sendMessage({ type: 'magnet', data: event.currentTarget.href })
    )
)
