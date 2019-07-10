var bgPage = chrome.extension.getBackgroundPage();

$(document).ready(function() {
    $('#close').click(function() {
        window.close();
    });
    if (bgPage.options.feedsource == 1) {
        chrome.bookmarks.get(bgPage.options.feedfolderid, ExportBookmarks);
    } else {
        ExportFeeds();
    }
});
