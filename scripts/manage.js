// TODO - write comment
function Add() {
    var title = document.getElementById("newTitle").value;
    var url = document.getElementById("newUrl").value;
    var maxItems = document.getElementById("newMaxItems").value;
    var order = document.getElementById("newOrder").value;
    var maxOrder = 0;
    var itemOrder = 0;
    
    //  TODO - add better validation
    if (!IsValid(title, url, maxItems, order)) {
        return;
    }
    
    AddRow(feeds.push(bgPage.CreateNewFeed(title, url, maxItems, order)) - 1);    
    
    for (feedKey in feeds) {
        itemOrder = parseInt(feeds[feedKey].order);
        if (itemOrder > maxOrder) {
            maxOrder = itemOrder;
        }
    }   
    
    document.getElementById("newOrder").value = maxOrder + 1;
    document.getElementById("newTitle").value = "";
    document.getElementById("newUrl").value = "";
}

// TODO - write comment
function IsValid(title, url, maxItems, order) {
    if (title == "") {
        alert("A title is required.  Name it something useful like 'My Awesome Gaming News Feed'.");
        return false;
    }
    if (url == "") {
        alert("A URL is required.  It's the full HTTP path to your feed.");
        return false;
    }
    if (maxItems == "") {
        alert("Max items is required.  It's the max number of items you want me to show you for this feed.");
        return false;
    }
    if (maxItems == "0") {
        alert("Ha ha funny person.  You need at least 1 max item in order to show you a feed.");
        return false;
    }
    if (!/^\d+$/.test(maxItems)) {
        alert("Very funny, you and I both know '" + maxItems + "' isn't a value max item number.");
        return false;
    }
    if (order == "") {
        alert("Order is required.  It's the order I'll display your feeds.");
        return false;
    }
    if (!/^\d+$/.test(order)) {
        alert("Very funny, you and I both know '" + order + "' isn't a value order.");
        return false;
    }
    return true;
}

/**
 * Adds a new filled-out entry row to the list of fields.
 * 
 * @param {number} feedKey - Feed key to lookup in the feeds map.
 */
function AddRow(feedKey) {
    var inputStr = "<tr id='AddRow" + feedKey + "'>";
    inputStr += "<td><input class='input' type='text' value='" + feeds[feedKey].title + "'></td>";
    inputStr += "<td><input class='input' type='text' value='" + feeds[feedKey].url + "'></td>";    
    inputStr += "<td><input class='input' type='text' value='" + feeds[feedKey].maxitems + "'></td>";
    inputStr += "<td><input class='input' type='text' value='" + feeds[feedKey].order + "'></td>";
    inputStr += "<td><button class='button is-danger' type='button' id='button" + feedKey + "'>Delete</button></td>";

    /*
    FIXME - this template only works if all of the elements are on 1 line without spaces
    let inputStr2 = `<tr id='AddRow${feedKey}'>
        <td><input class='input' type='text' value='${feeds[feedKey].title}'></td>\
        <td><input class='input' type='text' value='${feeds[feedKey].url}'></td>\
        <td><input class='input' type='text' value='${feeds[feedKey].maxitems}'></td>\
        <td><input class='input' type='text' value='${feeds[feedKey].order}'></td>\
        <td><button class='button is-danger' type='button' id='button${feedKey}'>Delete</button></td>`;
    */

    $("#feedGrid tr:last").after(inputStr);
    $("#button" + feedKey).click(function() {
        MarkDelete($('#AddRow' + feedKey).get(0));
    });
}

/**
 * Appends markDelete class to row that will be removed on Save().
 * 
 * @param {string} row - "AddRow" + feedKey, the row ID.
 */
function MarkDelete(row) {
    LogFunction("MarkDelete", ["row"], [row]);
    var marked = (row.className == "markDelete");
    
    if (!marked) {
        row.setAttribute("class", "markDelete");
    } else {
        if (row != lastBadRow) {
            row.setAttribute("class", "");
        } else {
            row.setAttribute("class", "badRow");
        }
    }
    row.childNodes[0].childNodes[0].disabled = !marked; // title
    row.childNodes[1].childNodes[0].disabled = !marked; // url
    row.childNodes[2].childNodes[0].disabled = !marked; // max items
    row.childNodes[3].childNodes[0].disabled = !marked; // order
}

/**
 * Deletes any rows tagged with the markDelete class and sends the user to feeds.html.
 */
function Save() {
    var row = null;
    var title;
    var url;
    var maxItems;
    var order;
    
    if (lastBadRow != null && lastBadRow.className != "markDelete") {
        lastBadRow.className = "";
    }
    
    for (feedKey in feeds) {
        // skip read later feed
        if (feedKey == 0) {
            continue;
        }
        
        row = document.getElementById("AddRow" + feedKey);
        title = row.childNodes[0].childNodes[0].value;
        url = row.childNodes[1].childNodes[0].value;
        maxItems = row.childNodes[2].childNodes[0].value;
        order = row.childNodes[3].childNodes[0].value;
        
        if (row.className != "markDelete" && !IsValid(title, url, maxItems, order)) {
            row.className = "badRow";
            lastBadRow = row;
            return;
        }
        
        feeds[feedKey].title = title;
        feeds[feedKey].url = url;
        feeds[feedKey].maxitems = maxItems;
        feeds[feedKey].order = order;    
    }
    
    // delete feeds that are marked, start from end so indexes don't get screwed up
    for (i = feeds.length - 1; i > 0; i--) {
        row = document.getElementById("AddRow" + i);
        
        if (row.className == "markDelete") {
            feeds.splice(i, 1);
        }
    }

    // remove read later feed
    feeds.splice(0,1);
    localStorage["feeds"] = JSON.stringify(feeds);

    bgPage.UpdateSniffer();
    bgPage.CleanUpUnreadOrphans();
    
    // get feeds to re-order the feeds
    bgPage.GetFeeds(function() {
        bgPage.CheckForUnreadStart();
        window.location = 'feeds.html';
    });
}

/**
 * Populate the manage.html page with the currently stored feeds.
 */
function ShowFeeds() {
    var maxOrder = 0;
    var itemOrder = 0;
    
    for (feedKey in feeds) {
        // skip read later feed
        if (feedKey == 0) {
            continue;
        }
        
        AddRow(feedKey);
        itemOrder = parseInt(feeds[feedKey].order);
        
        if (itemOrder > maxOrder) {
            maxOrder = itemOrder;
        }
    }
    
    document.getElementById("newOrder").value = maxOrder + 1;
    document.getElementById("newMaxItems").value = options.maxitems;
}
