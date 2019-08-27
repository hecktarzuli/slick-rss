var bgPage = chrome.extension.getBackgroundPage();

$(document).ready(function() {
    if (bgPage.options.feedsource == 1) {
        chrome.bookmarks.get(bgPage.options.feedfolderid, ExportBookmarks);
    } else {
        ExportFeeds();
    }
});
