var s = document.createElement('script');
s.src = chrome.runtime.getURL('magnet/magnet.js');
(document.head || document.documentElement).appendChild(s);
s.onload = function() {
    s.parentNode.removeChild(s);
};

window.addEventListener('message', function (event) {
    if (event.data.type === 'magnet') {
        chrome.runtime.sendMessage(event.data);
    }
})
