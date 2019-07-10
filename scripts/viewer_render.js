
// to prevent XSS :(
$(document).ready(function() {
	$('#refreshAll').click(function() {
			bgPage.CheckForUnreadStart();
	});
	$('#markAllRead').click(function() {
	    MarkAllFeedsRead();
	});
	$('#refreshButton').click(function() {
		bgPage.CheckForUnreadStart(selectedFeedKey);
	});
	$('#markFeedReadButton').click(function() {
		MarkFeedRead(feeds[selectedFeedKey].id);
	});
	$('#showOptions').click(function() {
		chrome.tabs.create({url:'options.html'});
	});
	$('#addFeeds').click(function() {
		window.location = 'manage.html';
	});
});

var bgPage = chrome.extension.getBackgroundPage();
var options = bgPage.options;
var feeds = bgPage.feeds;
var selectedFeedKey = null;
var feedReadToID = null;

var port = chrome.extension.connect({name: "viewerPort"});

port.onMessage.addListener(function(msg) {
    if (msg.type == "feedschanged") {
        location = 'viewer.html';
    }

    if (msg.type == "refreshallstarted") {
        document.getElementById("feedsLoadingProgress").style.width = "0%";
    }

    if (msg.type == "refreshallcomplete") {
        document.getElementById("feedsOptions").style.display = "";
        document.getElementById("feedsLoading").style.display = "none";
    }

    if (msg.type == "feedupdatestarted") {
        if (!bgPage.refreshFeed) {
            UpdateRefreshAllProgress();
        }

        if (msg.id == feeds[selectedFeedKey].id) {
            document.getElementById("header").className = "loading";
        }
    }

    if (msg.type == "feedupdatecomplete") {
        UpdateFeedUnread(msg.id);

        // refresh page if you are on the one that changed
        if (msg.id == feeds[selectedFeedKey].id) {
            SelectFeed(selectedFeedKey);
            document.getElementById("header").className = "";
        }
    }

    if (msg.type == "unreadtotalchanged") {
        UpdateTitle();
    }
});

window.onload = ShowFeeds;
window.onresize = FixFeedList;
