var fs = require('fs');
var feedparser = require('feedparser')
var opmlparser = require('opmlparser');
var request = require('request');
var u_ = require('underscore');

exports.ProcessFile = function(data) {

    fs.ReadStream(data.file)
      .pipe(new opmlparser())
      .on('error', function(error) {
          //always handle errors
          console.log("Error Parsing "+file);
       })
      .on('feed', function (feed) {
        //console.log("Calling ParseFeed");
        exports.ParseFeed(feed, data);
      })
      .on('end', function () {
           // do the next thing
      });
};
exports.ParseFeed = function(feed, data)
{
  console.log('Processing Feed.. ' + feed.title + ' @ ' + feed.xmlurl);
  request(feed.xmlurl)
    .pipe(new feedparser())
      .on('error', function(error) {
        console.log("Error Processing Feed");
      })
      .on('data', function (article) {
        var key = article.title + " " + article.link;
        article.__attr = { isvalid: false, processed: false, articleKey: key };

        data.onArticleRetrieved({ 
            feed: feed, 
            article: article
        });
      })
      .on('readable', function () {
        // do something else, then do the next thing
      });
};
