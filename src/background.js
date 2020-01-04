function webui(callback) {
    var target = chrome.runtime.getURL('webui-aria2/index.html')
    chrome.tabs.query({}, function(tabs) {
        for(var i = 0; i < tabs.length; ++i) {
            var tab = tabs[i];
            if (tab.url && tab.url.startsWith(target)) {
                chrome.windows.update(tab.windowId, { focused: true })
                chrome.tabs.update(tab.id, { active: true })
                callback(tab);
                return;
            }
        }
        chrome.tabs.create({ url: target }, function(tab) {
            // ugly hack to wait for webui fully loaded
            chrome.tabs.onUpdated.addListener(function webuiListener (tabId, changeInfo) {
                if (tabId == tab.id && /[0-9].+ — Aria2 WebUI/.test(changeInfo.title)) {
                    chrome.tabs.onUpdated.removeListener(webuiListener);
                    callback(tab);
                }
            });
        });
    });
}

function aria2Download(downloadItem) {
    webui(function(tab) {
        chrome.cookies.getAll({ url: downloadItem.finalUrl }, function(cookies) {
            cmd = [ downloadItem.finalUrl ]

            // TODO: user-agent
            if (cookies.length > 0)
                cmd.push('--header="Cookie: ' + cookies.map(cookie => cookie.name + '=' + cookie.value).join('; ') + '"');
            if (downloadItem.filename)
                cmd.push('--out="' + downloadItem.filename + '"');

            doc = chrome.extension.getViews({ windowId: tab.windowId, tabId: tab.id })[0].document;
            doc.querySelector('a[ng-click="addUris()"]').click();
            ta = doc.querySelector('textarea[ng-model="getUris.uris"]')
            ta.value = cmd.join(' ');
            ta.dispatchEvent(new Event('change'));
        });
    });
}

if (chrome.downloads.onDeterminingFilename) {
    chrome.downloads.onDeterminingFilename.addListener(function(downloadItem, suggest) {
        if (downloadItem.totalBytes < 10 * 1024 * 1024)
            return;
        chrome.downloads.cancel(downloadItem.id, function() {
            chrome.downloads.erase({ id: downloadItem.id })
        });
        aria2Download(downloadItem);
    });
}

chrome.browserAction.onClicked.addListener(function(tab) {
    webui(function(tab) {});
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type === 'magnet') {
        aria2Download({ finalUrl: request.data })
    }
});
