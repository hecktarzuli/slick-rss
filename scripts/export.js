// exports opml -> bookmarks
// TODO - write comment
function ExportBookmarks(startNode) {
    chrome.bookmarks.getChildren(startNode[0].id, function(nodes) {
        var opml = "<?xml version=\"1.0\" encoding=\"ISO-8859-1\"?><opml version=\"2.0\">\n<head><title>Slick RSS OPML Export</title></head>\n<body>";
        for (var i = 0; i < nodes.length;i++) {
            opml += "<outline type=\"rss\" text=\"" + nodes[i].title.replace("&", "&amp;") + "\" xmlUrl=\"" + nodes[i].url.replace("&", "&amp;") + "\"/>\n";
        }
        opml += "</body>\n</opml>";
        document.getElementById("opml").value = opml;
    });
}

// imports opml -> feed list
// TODO - write comment
function ExportFeeds() {
    var opml = "<?xml version=\"1.0\" encoding=\"ISO-8859-1\"?><opml version=\"2.0\">\n<head><title>Slick RSS OPML Export</title></head>\n<body>";
    for (var i = 0; i < bgPage.feeds.length;i++) {
        if (bgPage.feeds[i].title != "Read Later") {
            opml += "<outline type=\"rss\" text=\"" + bgPage.feeds[i].title.replace("&", "&amp;") + "\" xmlUrl=\"" + bgPage.feeds[i].url.replace("&", "&amp;") + "\"/>\n";
        }
    }
    opml += "</body>\n</opml>";

    document.getElementById("opml").innerText = opml;
}
