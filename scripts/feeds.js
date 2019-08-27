/**
 * Update the HTML page title with the number of unread messages
 */
function UpdatePageTitle() {
    var title = "Slick RSS";

    if ((options.unreadtotaldisplay == 2 || options.unreadtotaldisplay == 3) &&  bgPage.unreadTotal > 0) {
        title += " (" +  bgPage.unreadTotal + ")";
    }

    document.title = title;
    document.getElementById("markAllRead").style.display = (bgPage.unreadTotal > 0) ? "" : "none";
}

// TODO - write comment
function ShowFeeds() {
    var selectKey = null;
    var lastSelectedID = localStorage["lastSelectedFeedID"];

    UpdatePageTitle();

    for (key in feeds) {
        if (key == 0 && !options.readlaterenabled) {
            continue;
        }

        AddFeedButton(key);

        if (selectKey == null) {
            selectKey = key;
        }

        if (feeds[key].id == lastSelectedID) {
            selectKey = key;
        }
    }

    if (feeds.length == 0 || (feeds.length == 1 && bgPage.feedInfo[bgPage.readLaterFeedID].items.length == 0)) {
        if (options.feedsource == "0") {
            document.getElementById("noFeedsManaged").style.display = "";
        } else {
            document.getElementById("noFeedsBookmarks").style.display = "";
        }

        SetDisplayFeedTitleAndDescription("Feed Me", "");
        document.getElementById("feedHeader").style.display = "none";
        document.getElementById("feedArea").style.display = "none";
        document.getElementById("refreshButton").style.display = "none";
        document.getElementById("markFeedReadButton").style.display = "none";
    } else {
        SelectFeed(selectKey);
    }

    // in the middle of refresh all, show progress but wait a little so feed content pushes the feed list to the right size
    // this is only here to show progress on load when current loading feed is slow, otherwise the next feed will update the progress
    if (bgPage.checkingForUnread && !bgPage.refreshFeed) {
        setTimeout(UpdateLoadingBar, 500);
    }
}

/**
 * Create button for feed in #feedList with onclick behavior to call SelectFeed().
 * 
 * @param {int} key - Key for the current feed, the same shown in the manage screen.
 */
function AddFeedButton(key) {
    let liStr = 
        `<button id='feedTitle${feeds[key].id}' class='button'>
            ${feeds[key].title} <span id='feedUnread${feeds[key].id}' class='feedUnreadTag tag is-rounded is-danger'></span>
        </button>`;

    $("#feedList").append(liStr);
    $("#feedTitle" + feeds[key].id).click(function() {
        SelectFeed(key);
        return false;
    });

    UpdateFeedUnread(feeds[key].id);
}

// updates a feed item's unread count
// TODO - write comment
function UpdateFeedUnread(id) {
    if (bgPage.unreadInfo[id] == null || !options.unreaditemtotaldisplay) {
        return;
    }

    console.log(bgPage.unreadInfo[id]);
    var count = bgPage.unreadInfo[id].unreadtotal;
    LogVariable(84, document.getElementById("feedTitle" + id).innerText, count);

    if (count > 0) {
        document.getElementById("feedTitle" + id).style.fontWeight = "bold";
        document.getElementById("feedUnread" + id).style.display = "flex";
        document.getElementById("feedUnread" + id).innerText = count;
    } else {
        document.getElementById("feedTitle" + id).style.fontWeight = "normal";
        document.getElementById("feedUnread" + id).style.display = "none";
        document.getElementById("feedUnread" + id).innerText = "";
    }
}

/**
 * Change the visibility of the "Mark Current Feed Read" button. Shows the button if there are unread items.
 */
function UpdateReadAllIcon() {
    let count = 0;

    // if ureadInfo isn't null AND unreadInfo for the current feed isn't null
    if (bgPage.unreadInfo != null && bgPage.unreadInfo[feeds[selectedFeedKey].id] != null) {
        count = bgPage.unreadInfo[feeds[selectedFeedKey].id].unreadtotal;
    }

    document.getElementById("markFeedReadButton").style.display = (count > 0) ? "" : "none";
}

/**
 * Calls MarkFeedRead() on all RSS feeds (except the "Read Later" feed).
 */
function MarkAllFeedsRead() {
    var id;

    for (var i = 0; i < feeds.length; i++) {
        id = feeds[i].id;

        if (id !=  bgPage.readLaterFeedID) {
            MarkFeedRead(id);
        }
    }
}

// marks a feed read.
// TODO - write comment
function MarkFeedRead(feedID) {
    var container = null;
    var itemID = null;
    var className = "feedPreviewContainer" + options.readitemdisplay;
    var expireMs = new Date().getTime() + 5184000000; // 2 months;

    if (bgPage.unreadInfo[feedID].unreadtotal == 0) {
        return;
    }

    bgPage.unreadInfo[feedID].unreadtotal = 0;

    // for read later feeds, nuke the items instead of mark read
    if (feedID == bgPage.readLaterFeedID) {
        bgPage.feedInfo[bgPage.readLaterFeedID].items = [];
        localStorage["readlater"] = JSON.stringify(bgPage.feedInfo[bgPage.readLaterFeedID]);
        SelectFeed(0);
    } else {
        for (var i = 0; i < bgPage.feedInfo[feedID].items.length;i++) {
            itemID = MD5(bgPage.feedInfo[feedID].items[i].title + bgPage.feedInfo[feedID].items[i].date);
            bgPage.unreadInfo[feedID].readitems[itemID] = expireMs;
            container = document.getElementById("item_" + feedID + "_" + itemID);

            if (container != null) {
                container.className = container.className + className;
            }
        }
    }

    localStorage["unreadinfo"] = JSON.stringify(bgPage.unreadInfo);

    UpdateFeedUnread(feedID);
    UpdateReadAllIcon();
    bgPage.UpdateUnreadBadge();
}

// TODO - write comment
function MarkItemRead(itemID) {
    LogFunction("MarkItemRead", ["itemID"], [itemID]);
    var feedID = feeds[selectedFeedKey].id;
    LogVariable(258, "feedID", feedID);
    var className = " feedPreviewContainer" + options.readitemdisplay;
    LogVariable(260, "className", className);
    var expireMs = new Date().getTime() + 5184000000; // 2 months

    LogVariable(164, "this long conditional", bgPage.unreadInfo[feedID].readitems[itemID]);
    console.log(bgPage.unreadInfo[feedID].readitems);
    if (bgPage.unreadInfo[feedID].readitems[itemID] == null) {
        LogVariable(165, "feedID_itemID", "item_" + feedID + "_" + itemID);
        document.getElementById("item_" + feedID + "_" + itemID).className += className;

        bgPage.unreadInfo[feedID].unreadtotal--;
        bgPage.unreadInfo[feedID].readitems[itemID] = expireMs;

        localStorage["unreadinfo"] = JSON.stringify(bgPage.unreadInfo);

        UpdateFeedUnread(feedID);
        UpdateReadAllIcon();
        bgPage.UpdateUnreadBadge();
    }
}

/**
 * Add feed item to the "Read Later" feed.
 * 
 * @param {string} feedID - ID of our current feed, stored as a string of ints.
 * @param {int} itemIndex - Index of item in current feed's items array to copy to "Read Later" feed.
 */
function MarkItemReadLater(feedID, itemIndex) {
    LogFunction("MarkItemReadLater", ["feedID", "itemIndex"], [feedID, itemIndex]);
    var itemID = MD5(bgPage.feedInfo[feedID].items[itemIndex].title + bgPage.feedInfo[feedID].items[itemIndex].date);

    bgPage.feedInfo[bgPage.readLaterFeedID].items.push(bgPage.feedInfo[feedID].items[itemIndex]);
    bgPage.unreadInfo[bgPage.readLaterFeedID].unreadtotal ++;

    MarkItemRead(itemID);
    UpdateFeedUnread(bgPage.readLaterFeedID);

    localStorage["readlater"] = JSON.stringify(bgPage.feedInfo[bgPage.readLaterFeedID]);
}

/**
 * Remove item from "Read Later" feed.
 * 
 * @param {int} itemIndex  - Index of item in "Read Later" items array to remove.
 */
function UnMarkItemReadLater(itemIndex) {
    LogFunction("UnMarkItemReadLater", ["itemIndex"], [itemIndex]);
    // decrement "Read Later" feed unread total
    bgPage.unreadInfo[bgPage.readLaterFeedID].unreadtotal --;
    // remove the item at itemindex by splicing it out
    bgPage.feedInfo[bgPage.readLaterFeedID].items.splice(itemIndex, 1);
    bgPage.UpdateUnreadBadge();

    // re-save the localstorage for the "Read Later" feed
    localStorage["readlater"] = JSON.stringify(bgPage.feedInfo[bgPage.readLaterFeedID]);

    UpdateFeedUnread(bgPage.readLaterFeedID);
    SelectFeed(0);
}

/**
 * Click behavior when a user selects a new feed to view. Resets the layout, starts "loading..." dialogues, and calls RenderFeed()
 * 
 * @param {int} key - Key for the current feed, the same shown in the manage screen.
 * 
 * @return {void|null} - Prematurely returns if the feed is still refreshing or if the feed returned an error.
 */
function SelectFeed(key) {
    localStorage["lastSelectedFeedID"] = bgPage.feeds[key].id;

    document.getElementById("feedPreviewScroller").scrollTop = 0;

    clearTimeout(feedReadToID);

    if (selectedFeedKey != null) {
        $("#feedTitle" + feeds[selectedFeedKey].id).removeClass("is-selected").removeClass("is-primary");
    }

    $("#feedTitle" + feeds[key].id).addClass("is-selected").addClass("is-primary");

    selectedFeedKey = key;

    // clear the slate
    $("#feedPreview").empty();
    document.getElementById("markFeedReadButton").style.display = "none";
    document.getElementById("feedError").style.display = "none";
    document.getElementById("refreshButton").style.display = (feeds[selectedFeedKey].id != bgPage.readLaterFeedID) ? "" : "none";
    document.getElementById("noItems").style.display = "none";

    // feed isn't ready yet
    if (bgPage.feedInfo[feeds[key].id] == null || bgPage.feedInfo[feeds[key].id].loading) {
        SetDisplayFeedTitleAndDescription("Loading Feed...", "");
        document.getElementById("refreshButton").style.display = "none";

        // must be a new feed with no content yet
        if (bgPage.feedInfo[feeds[key].id] == null && !bgPage.checkingForUnread) {
            bgPage.CheckForUnreadStart(key);
        }

        return;
    }

    // feed loaded, but had an error
    if (bgPage.feedInfo[feeds[key].id].error != "") {
        ShowFeedError(bgPage.feedInfo[feeds[key].id].error);
        return;
    }

    document.getElementById("noItems").style.display = (bgPage.feedInfo[feeds[key].id].items.length == 0) ? "" : "none";

    RenderFeed(bgPage.feeds[key].title);
    UpdateReadAllIcon();

    if (options.markreadafter > 0 && key != 0) {
        feedReadToID = setTimeout(function(){MarkFeedRead(feeds[key].id)}, options.markreadafter * 1000);
    }

}

/**
 * Modify the display Title and Description.
 * 
 * @param {string} feedTitle -  Desired text to set as the title.
 * @param {*} feedDescription - Desired text to set as the description.
 */
function SetDisplayFeedTitleAndDescription(feedTitle, feedDescription) {
    document.getElementById("headerFeedTitle").innerText = feedTitle;

    if (options.showdescriptions && ((feedDescription != "") || (feedDescription != "undefined"))) {
        document.getElementById("headerFeedDescription").style.display = "block";
        document.getElementById("headerFeedDescription").innerHTML = feedDescription;
    } else {
        document.getElementById("headerFeedDescription").style.display = "none";
        document.getElementById("headerFeedDescription").innerHTML = "";
    }
}

/**
 * Dynamically create and append the RSS feed content's HTML.
 * 
 * @param {string} feedTitle - Feed title that is set in the Manage screen.
 */
function RenderFeed(feedTitle) {
    var itemID = null;
    var message_header = null;
    var message_body = null;
    var feedLink = null;
    var feedReadLater = null;
    var feedContainer = null;
    var feedPublished = null;
    var feedMarkRead = null;
    var feedSummary = null;
    var feedAuthor = null;
    var summaryLinks = null;
    var summaryImages = null;
    var summaryObjects = null;
    var item = null;
    var feedID = feeds[selectedFeedKey].id;
    var columnCount = 0;
    var href = "";

    // if the feed does not have a title, set it to the custom title
    if ((bgPage.feedInfo[feedID].title == "undefined") || (bgPage.feedInfo[feedID].title == "")) {
        SetDisplayFeedTitleAndDescription(feedTitle, bgPage.feedInfo[feedID].description);
    } else {
        SetDisplayFeedTitleAndDescription(bgPage.feedInfo[feedID].title, bgPage.feedInfo[feedID].description);
    }

    // TODO - this whole switch statement can be removed once column customization is added back in
    switch(options.columns) {
        case "1": colWidth = "100%";break;
        case "2": colWidth = "50%";break;
        case "3": colWidth = "33%";break;
        case "4": colWidth = "25%";break;
    }

    for (var i=0;i < bgPage.feedInfo[feedID].items.length && i< feeds[selectedFeedKey].maxitems;i++) {
        item = bgPage.feedInfo[feedID].items[i];
        itemID = MD5(item.title + item.date);

        // "<button class='delete' aria-label='delete'></button>";
        feedMarkRead = null;
        feedMarkRead = document.createElement("button"); // used to be "img"
        feedMarkRead.setAttribute("class", "delete feedPreviewMarkRead");
        feedMarkRead.setAttribute("aria-label", "delete");
        feedMarkRead.title = "Mark read";
        //feedMarkRead.setAttribute("src", "images/x_blue.gif");
        //feedMarkRead.setAttribute("id", 'markItemRead' + itemID);

        if (feedID == bgPage.readLaterFeedID) {
            $(feedMarkRead).click({i: i}, function(event) {
                UnMarkItemReadLater(event.data.i);
                return false;
            });
        } else {
            $(feedMarkRead).click({itemID: itemID}, function(event) {
                MarkItemRead(event.data.itemID);
                return false;
            });
        }

        feedLink = document.createElement("a");
        feedLink.setAttribute("href", item.url);
        feedLink.innerHTML = (i + 1) + ".&nbsp;&nbsp;" + item.title;

        $(feedLink).click({url: item.url}, function(event) {
            LinkProxy(event.data.url);
            return false;
        });

        if (feedID == bgPage.readLaterFeedID) {
            if (options.readlaterremovewhenviewed) {
                $(feedLink).click({i: i}, function(event) {
                    UnMarkItemReadLater(event.data.i);
                    return false;
                });
            }
        } else {
            $(feedLink).click({feedID: feedID, itemID: itemID}, function(event) {
                MarkItemRead(event.data.itemID);
                if (options.markreadonclick) {
                    MarkFeedRead(event.data.feedID);
                }
                return false;
            });
        }

        message_header = document.createElement("div");
        message_header.setAttribute("class", "message-header");

        message_header.appendChild(feedLink); // add message title

        if (options.readlaterenabled && feedID != bgPage.readLaterFeedID) {
            feedReadLater = document.createElement("button");
            feedReadLater.setAttribute("class", "tag is-rounded feedPreviewReadLater");
            feedReadLater.setAttribute("title", "Read later");
            var starIconWrapper = document.createElement("span");
            starIconWrapper.setAttribute("class", "icon");
            var starIcon = document.createElement("i");
            starIcon.setAttribute("class", "fas fa-star");
            starIconWrapper.appendChild(starIcon);
            feedReadLater.appendChild(starIconWrapper);

            // TODO - this star icon isn't appearing for "Read Later"
            // TODO - when "read later" is selected, change the Bulma message from is-dark to whichever one is gold

            /*
            feedReadLater = document.createElement("img");
            feedReadLater.setAttribute("src", "images/star.gif");
            feedReadLater.setAttribute("class", "feedPreviewReadLater");
            feedReadLater.setAttribute("title", "Read later");
            */
            $(feedReadLater).click({feedID: feedID, i: i}, function(event) {
                MarkItemReadLater(event.data.feedID, event.data.i);
                return false;
            });
            message_header.appendChild(feedReadLater); // add star
        }

        message_header.appendChild(feedMarkRead); // add x
        
        feedPublished = document.createElement("div");
        feedPublished.setAttribute("class", "feedPreviewDate");
        feedPublished.appendChild(document.createTextNode(bgPage.GetFormattedDate(item.date)));

        feedAuthor = document.createElement("div");
        feedAuthor.setAttribute("class", "feedPreviewAuthor");
        feedAuthor.innerText = item.author;

        feedSummary = document.createElement("div");
        feedSummary.setAttribute("class", "feedPreviewSummary");
        feedSummary.innerHTML = item.content;

        feedContainer = document.createElement("div");
        feedContainer.setAttribute("id", "item_" + feedID + "_" + itemID);

        if (bgPage.unreadInfo[feeds[selectedFeedKey].id] != null && bgPage.unreadInfo[feeds[selectedFeedKey].id].readitems != null && bgPage.unreadInfo[feeds[selectedFeedKey].id].readitems[itemID] != null) {
            feedContainer.setAttribute("class", "box message is-small is-info feedPreviewContainer" + options.readitemdisplay);
        } else {
            feedContainer.setAttribute("class", "box message is-small is-info");
        }

        // make all summary links open a new tab
        summaryLinks = feedSummary.getElementsByTagName("a");
        for (var l = 0; l < summaryLinks.length; l++) {
            href = summaryLinks[l].getAttribute("href");

            $(summaryLinks[l]).click({href: href}, function(event) {
                LinkProxy(event.data.href);
                return false;
            });

            if (feedID == bgPage.readLaterFeedID) {
                if (options.readlaterremovewhenviewed) {
                    $(summaryLinks[l]).click({i: i}, function(event) {
                        UnMarkItemReadLater(event.data.i);
                        return false;
                    });
                }
            } else {
                $(summaryLinks[l]).click({itemID:itemID}, function(event) {
                    MarkItemRead(event.data.itemID);
                    return false;
                });
            }
        }

        // show snug images, or nuke them
        summaryImages = feedSummary.getElementsByTagName("img");
        for (var q = summaryImages.length - 1; q >= 0; q--) {
            if (options.showfeedimages) {
                summaryImages[q].style.maxWidth = "95%";
                summaryImages[q].style.width = "";
                summaryImages[q].style.height = "";
                summaryImages[q].removeAttribute("width");
                summaryImages[q].removeAttribute("height");
            } else {
                summaryImages[q].parentNode.removeChild(summaryImages[q]);
            }
        }

        // show snug objects, or nuke them
        summaryObjects = feedSummary.getElementsByTagName("object");
        for (var o = summaryObjects.length - 1; o >= 0; o--) {
            if (!options.showfeedobjects) {
                summaryObjects[o].parentNode.removeChild(summaryObjects[o]);
            } else {
                summaryObjects[o].style.maxWidth = "95%";
                summaryObjects[o].style.width = "";
                summaryObjects[o].style.height = "";
                summaryObjects[o].removeAttribute("width");
                summaryObjects[o].removeAttribute("height");
            }
        }

        // show snug objects, or nuke them
        summaryObjects = feedSummary.getElementsByTagName("embed");
        for (var o = summaryObjects.length - 1; o >= 0; o--) {
            if (!options.showfeedobjects) {
                summaryObjects[o].parentNode.removeChild(summaryObjects[o]);
            } else {
                summaryObjects[o].style.maxWidth = "95%";
                summaryObjects[o].style.width = "";
                summaryObjects[o].style.height = "";
                summaryObjects[o].removeAttribute("width");
                summaryObjects[o].removeAttribute("height");
            }
        }


        // show snug iframes, or nuke them
        summaryObjects = feedSummary.getElementsByTagName("iframe");
        for (var o = summaryObjects.length - 1; o >= 0; o--) {
            if (!options.showfeediframes) {
                summaryObjects[o].parentNode.removeChild(summaryObjects[o]);
            } else {
                summaryObjects[o].style.maxWidth = "95%";
                summaryObjects[o].style.width = "";
                summaryObjects[o].style.height = "";
                summaryObjects[o].removeAttribute("width");
                summaryObjects[o].removeAttribute("height");
            }
        }

        if (columnCount == options.columns) {
            columnCount = 0;
        }

        // add message-title to message
        feedContainer.appendChild(message_header);

        // create empty message-body
        message_body = document.createElement("div");
        message_body.setAttribute("class", "message-body");

        // add parts to message-body
        message_body.appendChild(feedSummary);
        message_body.appendChild(feedPublished);
        message_body.appendChild(feedAuthor);
        // add message-body to message

        feedContainer.appendChild(message_body);

        document.getElementById("feedPreview").appendChild(feedContainer);
        columnCount++;
    }
}

/**
 * Displays a feed error message.
 * 
 * @param {string} message - Error message to display.
 */
function ShowFeedError(message) {
    /*
    TODO - stick the response of the error message in here, preferably with the Title as the response code and then the message inside
    <article class="message is-danger">
        <div class="message-header">
            <p>Danger</p>
        </div>
        <div class="message-body">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. <strong>Pellentesque risus mi</strong>, tempus quis placerat ut, porta nec nulla. Vestibulum rhoncus ac ex sit amet fringilla. Nullam gravida purus diam, et dictum <a>felis venenatis</a> efficitur. Aenean ac <em>eleifend lacus</em>, in mollis lectus. Donec sodales, arcu et sollicitudin porttitor, tortor urna tempor ligula, id porttitor mi magna a neque. Donec dui urna, vehicula et sem eget, facilisis sodales sem.
        </div>
    </article>
    */
    document.getElementById("feedError").style.display = "";
    document.getElementById("feedErrorMessage").innerText = message;
    // TODO - how do you change the chrome extension icon instead? change the png to show the error instead of changing badge text
    // TODO - have the error just return the errorcode and the status message.
    /* TODO
    code {
        background-color: whitesmoke; aka #f5f5f5
        color: #ff3860;
        font-size: 0.875em;
        font-weight: normal;
        padding: 0.25em 0.5em 0.25em;
    }
    */
    SetDisplayFeedTitleAndDescription("Feed Problems", "");
}

/**
 * Creates a new tab with the feed item's URL, sets the tab as active dependent on the the user's options.
 * 
 * @param {string} link_url - Link associated with the feed item.
 */
function LinkProxy(link_url) {
    LogVariable(597, "link_url", link_url);
    chrome.tabs.create({
        url: link_url,
        active: !bgPage.options.loadlinksinbackground
    });
}

// If we're running under Node, 
if (typeof exports !== 'undefined') {
    exports.UpdatePageTitle = UpdatePageTitle;
    exports.ShowFeeds = ShowFeeds;
    exports.AddFeedButton = AddFeedButton;
    exports.UpdateFeedUnread = UpdateFeedUnread;
    exports.UpdateReadAllIcon = UpdateReadAllIcon;
    exports.MarkAllFeedsRead = MarkAllFeedsRead;
    exports.MarkFeedRead = MarkFeedRead;
    exports.MarkItemRead = MarkItemRead;
    exports.MarkItemReadLater = MarkItemReadLater;
    exports.UnMarkItemReadLater = UnMarkItemReadLater;
    exports.SelectFeed = SelectFeed;
    exports.SetDisplayFeedTitleAndDescription = SetDisplayFeedTitleAndDescription;
    exports.RenderFeed = RenderFeed;
    exports.ShowFeedError = ShowFeedError;
    exports.LinkProxy = LinkProxy;
}
