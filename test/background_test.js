const assert  = require('assert');
var background = require('../scripts/background');

describe('background', function() {
    xit('InternalConnection', function() {
        assert.strictEqual(true, true);
    });
    xit('ReloadViewer', function() {
        assert.strictEqual(true, true);
    });
    xit('ChromeExtensionIconClicked', function() {
        // not sure how to test this, since it just opens feeds.html in a new tab
        assert.strictEqual(true, true);
    });
    xit('ExternalRequest', function() {
        assert.strictEqual(true, true);
    });
    xit('GetOptions', function() {
        assert.strictEqual(true, true);
    });
    xit('GetDefaultOptions', function() {
        assert.strictEqual(true, true);
    });
    xit('GetFeeds', function() {
        assert.strictEqual(true, true);
    });
    xit('GetReadLaterFeed', function() {
        assert.strictEqual(true, true);
    });
    xit('GetFeedFolderChildren', function() {
        assert.strictEqual(true, true);
    });
    xit('GetReadLaterItems', function() {
        assert.strictEqual(true, true);
    });
    xit('UpdateSniffer', function() {
        assert.strictEqual(true, true);
    });
    xit('BookmarkChanged', function() {
        assert.strictEqual(true, true);
    });
    xit('CheckFeedChange', function() {
        assert.strictEqual(true, true);
    });
    xit('CreateNewFeed', function() {
        assert.strictEqual(true, true);
    });
    xit('GetFormattedDate', function() {
        assert.strictEqual(true, true);
    });
    it('GetRandomID', function() {
        assert.strictEqual(background.GetRandomID().length, 10);
    });
    it('GetRandomInt', function() {
        /*
        TODO - need to install sinon
        sinon.restore();
        sinon.stub(Math, 'random').returns(0);
        assert.strictEqual(deal.getRandomInt(0, 77), 0);
        assert.strictEqual(deal.getRandomInt(0, 1), 0);
        sinon.restore();
        sinon.stub(Math, 'random').returns(1);
        assert.strictEqual(deal.getRandomInt(0, 77), 77);
        assert.strictEqual(deal.getRandomInt(0, 1), 1);
        */
        assert.strictEqual(true, true);
    });
    xit('DoUpgrades', function() {
        assert.strictEqual(true, true);
    });
    xit('UpdateUnreadBadge', function() {
        assert.strictEqual(true, true);
    });
    it('GetUnreadCounts', function() {
        assert.strictEqual(background.GetUnreadCounts(), "hello");
        //assert.strictEqual(true, true);
    });
    xit('CheckForUnreadStart', function() {
        assert.strictEqual(true, true);
    });
    xit('CheckForUnread', function() {
        assert.strictEqual(true, true);
    });
    xit('CheckForUnreadComplete', function() {
        assert.strictEqual(true, true);
    });
    xit('CleanUpUnreadOrphans', function() {
        assert.strictEqual(true, true);
    });
    xit('GetNodeTextValue', function() {
        assert.strictEqual(true, true);
    });
    xit('GetFeedLink', function() {
        assert.strictEqual(true, true);
    });
    xit('GetElementByTagName', function() {
        assert.strictEqual(true, true);
    });
    xit('GetElementsByTagName', function() {
        assert.strictEqual(true, true);
    });
});