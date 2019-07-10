var manifest = chrome.runtime.getManifest();
var options = GetOptions();
var unreadInfo = GetUnreadCounts();
var unreadTotal = 0;
var feedInfo = [];
var feeds = [];
var snifferName = null;
var snifferVersion = null;
var snifferID = null;
var viewerPort = null;
var checkingForUnread = false;
var checkForUnreadTimerID = null;
var checkForUnreadCounter = 0;
var getFeedsCallBack = null;
var refreshFeed = false;
var readLaterFeedID = 9999999999;
var viewPortTabID = null;

chrome.browserAction.onClicked.addListener(ButtonClicked);
chrome.extension.onRequestExternal.addListener(ExternalRequest);
chrome.extension.onConnect.addListener(InternalConnection);
chrome.bookmarks.onChanged.addListener(BookmarkChanged);
chrome.bookmarks.onCreated.addListener(CheckFeedChange);
chrome.bookmarks.onMoved.addListener(CheckFeedChange);
chrome.bookmarks.onRemoved.addListener(CheckFeedChange);

DoUpgrades();
GetFeeds(function() {
    CleanUpUnreadOrphans();
    CheckForUnreadStart();
});
