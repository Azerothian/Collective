var portchecker = require('portchecker');
var phantom = require('phantom');
var u_ = require('underscore');
var z = require('../util/util.js');
var image = require('./Image');
var chokidar = require('chokidar');

exports.DoesArticleHaveKeywords = function(data)
{
  //console.log("[Web] DoesArticleHaveKeywords");
portchecker.getFirstAvailable(16001, 50000, process.env.HOST, function(p, host) {
//	freeport(function(er, port) {
		phantom.create({
            hostname: process.env.IP,
			port: p, 
			binary: require('phantomjs').path
		},
   function(phantism) {
     phantism.createPage(function (page) {
    //  console.log("[Web] DoesArticleHaveKeywords createPage");
      page.open(data.article.link, function(status) {
    //      console.log("[Web] DoesArticleHaveKeywords Open");
        page.includeJs("http://code.jquery.com/jquery-2.0.3.min.js", function() {

          page.evaluate(function(keywords){ 
            var cnt = 0;
            var arr = new Array;
            for(var i =0; i < keywords.length; i++)
            {
              var current = $("body").find('*:contains("'+keywords[i]+'")').length
              cnt = cnt + current;
              arr.push({ keyword: keywords[i], count: current });
            }
            return {
              totalFound: cnt,
              found: arr

            };

          }, 
          function(result) 
          {
            var func = "no";
            if(result.totalFound > 0)
            {
              func = "yes";
            } 
            data = u_.extend(data, { page: page, keywords: result } );
            z.callonce({funcName: func, toRemove: ["yes", "no"], obj: data});

            phantism.exit();
                    //console.log("we", result);
          },
          data.keywords);
        });
});
});
});
}); 
}

exports.RenderArticle = function(data)
{
    console.log("Init Render!!", data.article.link);
    // var path = __dirname + '\\data\\' + data.article._id + '.jpg';
    data.page.set('viewportSize', { width:1024, height:768 });
    
    var watcher = chokidar.watch(data.path, {});
    
    var splitFunc = function() { 
        console.log("SPLICATA");
        image.splitImageIntoHorizontalSegs(
        {
            path: data.path,
            targetpath: data.targetpath,
            segmentsize: 200,
            success: function(obj)
            {
                z.callonce(
                {
                    funcName: "success", 
                    toRemove: ["success", "error"], 
                    obj: u_.extend(
                    {
                        segments: obj.count
                    },data)
                    
                });
            }
        });
        watcher.close();
    };
    
    watcher.on("add", splitFunc);
    watcher.on("change", splitFunc);
    
    data.page.render(data.path);
 
}



// var feedKey = feed.xmlurl;
 // var articleKey = article.guid + " " + article.date;

 // console.log( {"FeedKey": feedKey, "ArticleKey": articleKey })

//  var title = article.title;
//  var description = article.description;
////  var link = article.link;
/*
page.set('viewportSize', {width:1024,height:768})
              var path = __dirname + '\\..\\data\\' + data.article.system_guid + '.jpg';
              page.render(path, function() { });
                phantism.exit();

                if(data.success)
                {
                  data.success(
                    u_.extend(
                      { 
                        image_path: path 
                      }, 
                      data.article)
                  );
                }
                */