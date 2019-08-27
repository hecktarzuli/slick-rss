$(document).ready(function() {
    // Refresh Current Feed
    $('#refreshButton').click(function() {
        bgPage.CheckForUnreadStart(selectedFeedKey);
    });
    // Refresh All Feeds
    $('#refreshAll').click(function() {
        bgPage.CheckForUnreadStart();
    });
    // Mark Current Feed Read
    $('#markFeedReadButton').click(function() {
        MarkFeedRead(feeds[selectedFeedKey].id);
    });
    // Mark All Feeds Read
    $('#markAllRead').click(function() {
        MarkAllFeedsRead();
    });
    $('#addFeeds').click(function() {
        // leave this for now. The ID for this only shows when the user has 0 feeds. Ideally, this will be refactored
        //   anyway when this becomes a 1-page application (where adding feeds is just a +, not going to manage.html)
        window.location = 'manage.html';
    });

    $(".modal-trigger").click(function() {
        let modalID = $(this).attr('id').replace("_trigger", "").replace("_close", "");
        $("#" + modalID + "_modal").toggleClass("is-active");
    });
});

var bgPage = chrome.extension.getBackgroundPage();
var options = bgPage.options;
var feeds = bgPage.feeds;
var selectedFeedKey = null;
var feedReadToID = null;

var port = chrome.extension.connect({
    name: "viewerPort"
});

port.onMessage.addListener(function(msg) {
    switch (msg.type) {
        case "feedschanged":
            location = 'feeds.html';
        case "refreshallstarted":
            StartLoadingBar();
        case "refreshallcomplete":
            CloseLoadingBar();
        case "feedupdatestarted":
            if (!bgPage.refreshFeed) {
                UpdateLoadingBar();
            }
        case "feedupdatecomplete":

    }

    if (msg.type == "feedupdatecomplete") {
        UpdateFeedUnread(msg.id);

        // refresh page if you are on the one that changed
        if (msg.id == feeds[selectedFeedKey].id) {
            SelectFeed(selectedFeedKey);
        }
    }

    if (msg.type == "unreadtotalchanged") {
        UpdatePageTitle();
    }
});

window.onload = ShowFeeds;


/**
 * Resets and shows the #feedsLoadingProgress progress bar.
 */
function StartLoadingBar() {
    console.log("StartLoadingBar");
    $("#feedsLoadingProgress").val(0);
    $("#feedsLoadingProgress").show();
}

/**
 * Displays the #feedsLoadingProgress progress bar and changes the width to percentage of number of feeds checked / total number of feeds.
 */
function UpdateLoadingBar() {
    // FIXME - checkForUnreadCounter doesn't seem to reset to 0 properly, so successive loads show an already filled progress bar.
    console.log("UpdateLoadingBar - " + (bgPage.checkForUnreadCounter + 1) + "/" + (feeds.length));
    $("#feedsLoadingProgress").val(Math.round(((bgPage.checkForUnreadCounter + 1) / feeds.length) * 100));
}

/**
 * Hides and resets the #feedsLoadingProgress progress bar.
 */
function CloseLoadingBar() {
    console.log("CloseLoadingBar");
    $("#feedsLoadingProgress").hide();
    $("#feedsLoadingProgress").val(0);
}