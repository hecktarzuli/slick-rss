
// wire stuff to prevent XSS :(
$(document).ready(function() {
	$('#save').click(function() {
        Save();
    });
	$('#cancel').click(function() {
        window.close();
    });
	$('#feedSource').change(function() {
        FeedSourceChanged();
    });
	$('#importFeeds').click(function() {
        window.open('import.html', 'height=250,width=550');
    });
	$('#exportFeeds').click(function() {
        window.open('export.html', 'height=250,width=550');
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
