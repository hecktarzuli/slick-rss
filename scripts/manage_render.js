var bgPage = chrome.extension.getBackgroundPage();
var options = bgPage.options;
var feeds = bgPage.feeds;
var lastBadRow = null;

$(document).ready(function() {
    $('#manageSave').click(function() {
        Save();
    });
    $('#add').click(function() {
        Add();
    });
});

window.onload = ShowFeeds;
