function save_options() {
    var checkboxcap = document.getElementById('like').checked;
    chrome.storage.sync.set({
        ariacapture: checkboxcap
    }, function () {
        // Update status to let user know options were saved.
        var status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(function () {
            status.textContent = '';
        }, 750);
    });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
    // Use default value color = 'red' and likesColor = true.
    chrome.storage.sync.get({
        ariacapture: false
    }, function (items) {
        document.getElementById('like').checked = items.ariacapture;
    });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);