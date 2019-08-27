$(document).ready(function() {
    $('#optionsSave').click(function() {
        Save();
    });
    $('#feedSource').change(function() {
        FeedSourceChanged();
    });
    $('#dateDone').click(function() {
        ShowDateSample(true);
    });
    $('#dateFormat').focus(function() {
        EditDateFormat();
    });
});

var bgPage = chrome.extension.getBackgroundPage();

window.onload = SetupScreen;
