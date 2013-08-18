var portchecker = require('portchecker');
var fs = require('fs');
var phantom = require('phantom');
var u_ = require('underscore');
var z = require('../util/util.js');
var image = require('./Image');
var chokidar = require('chokidar');
var running = new Array();
exports.DoesArticleHaveKeywords = function(data) {
    //console.log("[Web] DoesArticleHaveKeywords");
    var res = u_.find(running, function(run) {

        return run == data.article.link;


    });
    if (res !== undefined && res.length > 0) {
        console.log("process is already running.. terminating without response");
        return;
    }
    //running.push(data.article.link);

    portchecker.getFirstAvailable(16001, 50000, process.env.HOST, function(p, host) {
        //	freeport(function(er, port) {
        phantom.create({
            hostname: process.env.IP,
            port: p,
            binary: require('phantomjs').path
        },

        function(phantism) {
            phantism.createPage(function(page) {
                console.log("[Web] DoesArticleHaveKeywords createPage");
                page.set('Referer', 'http://google.com');
                page.set('settings.userAgent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.1 (KHTML, like Gecko) Chrome/21.0.1180.89 Safari/537.1');
                page.open(data.article.link, function(status) {
                    console.log("[Web] DoesArticleHaveKeywords Open");
                    page.injectJs(__dirname + "/../public/js/lib/jquery/jquery.js") ? "SUCCESS inject" : "FAIL";

                    //page.includeJs("http://ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js", function() {
                    console.log("evaluate");
                    page.evaluate(function(keywords) {
                        console.log("evaluate start");
                        var cnt = 0;
                        var arr = new Array;
                        for (var i = 0; i < keywords.length; i++) {

                            var current = $("body").find('*:contains("' + keywords[i] + '")').length
                            cnt = cnt + current;
                            arr.push({
                                keyword: keywords[i],
                                count: current
                            });
                        }
                        return {
                            totalFound: cnt,
                            found: arr

                        };

                    },

                    function(result) {
                        var func = "no";
                        if (result.totalFound > 0) {
                            func = "yes";
                        }
                        console.log("result says", func);
                        data = u_.extend(data, {
                            page: page,
                            keywords: result
                        });
                        z.callonce({
                            funcName: func,
                            toRemove: ["yes", "no"],
                            obj: data
                        });
                        running = u_.reject(running, function(run) {
                            return run == data.article.link;
                        });
                        phantism.exit();
                        //console.log("we", result);
                    },
                    data.keywords);
                    //});
                });
            });
        });
    });
}

exports.RenderArticle = function(data) {
    var filecheck;
    console.log("Init Render!!", data.article.link);
    // var path = __dirname + '\\data\\' + data.article._id + '.jpg';
    data.page.set('viewportSize', {
        width: 1024,
        height: 768
    });

    var watcher = chokidar.watch(data.path, {});

    var splitFunc = function() {
        console.log("SPLICATA");
        image.splitImageIntoHorizontalSegs({
            path: data.path,
            targetpath: data.targetpath,
            segmentsize: 200,
            success: function(obj) {
                clearTimeout(filecheck); // dont need the check any more
                z.callonce({
                    funcName: "success",
                    toRemove: ["success", "error"],
                    obj: u_.extend({
                        segments: obj.count
                    }, data)

                });
            }
        });
        watcher.close();
    };

    watcher.on("add", splitFunc);
    watcher.on("change", splitFunc);
    setTimeout(function() {
        console.log("Calling Phantome Render..", data.path)
        data.page.render(data.path);
    }, 100);
    filecheck = setTimeout(function() {
        console.log("Checking for Render..", data.path);
        fs.exists(data.path, function(exists) {
            if (!exists) {
                watcher.close();
                z.callonce({
                    funcName: "error",
                    toRemove: ["success", "error"],
                    obj: u_.extend({
                        errorMessage: "PhantomJs did not render the file"
                    }, data)
                });
            }
            else {
                watcher.close();

            }

        });
    }, 30000);

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