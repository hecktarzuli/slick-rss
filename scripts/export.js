// exports opml -> bookmarks
// TODO - write comment
function ExportBookmarks(startNode) {
  chrome.bookmarks.getChildren(startNode[0].id, function(nodes) {
    var opml = "<?xml version=\"1.0\" encoding=\"ISO-8859-1\"?><opml version=\"2.0\">\n<head><title>Slick RSS OPML Export</title></head>\n<body>";
    let opmlcontent = "";
    for (var i = 0; i < nodes.length; i++) {
      let opmlText = nodes[i].title.replace("&", "&amp;");
      let opmlXmlUrl= nodes[i].url.replace("&", "&amp;");
      opmlcontent += `<outline type="rss" text="${opmlText}" xmlUrl="${opmlXmlUrl}">`;
    }
    let opml = `<?xml version="1.0" encoding="ISO-8859-1"?><opml version="2.0">
      <head><title>Slick RSS OPML Export</title></head>
      <body>${opmlcontent}</body>
    </opml>`;
    document.getElementById("opml").value = opml;
  });
}

// TODO - refactor so both ExportBookmarks and ExportFeeds are calling the same function to generate the opml
//   right now the code is repeated but nodes.length is different from bgPage.feeds.length
// imports opml -> feed list
// TODO - write comment
function ExportFeeds() {
  let opmlcontent = "";
  for (var i = 0; i < bgPage.feeds.length; i++) {
    if (bgPage.feeds[i].title != "Read Later") {
      let opmlText = bgPage.feeds[i].title.replace("&", "&amp;");
      let opmlXmlUrl= bgPage.feeds[i].url.replace("&", "&amp;");
      opmlcontent += `<outline type="rss" text="${opmlText}" xmlUrl="${opmlXmlUrl}">`;
    }
  }
  let opml = `<?xml version="1.0" encoding="ISO-8859-1"?><opml version="2.0">
      <head><title>Slick RSS OPML Export</title></head>
      <body>${opmlcontent}</body>
    </opml>`;
  document.getElementById("opml").innerText = opml;
}
