var bgPage = chrome.extension.getBackgroundPage();

$(document).ready(function() {
    $('#import').click(function() {
        Import();
    });
    $('#cancel').click(function() {
        window.close();
    });
});
