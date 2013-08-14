
/**
 * Module dependencies.
 */
 var u_ = require('underscore');
 var cronJob = require('cron').CronJob;
 var logic = require('./logic');

 var job1 = new cronJob('0 */1 * * * *', function() {
  //OnJob
  console.log("Processing the feed...")
  logic.feed.ProcessFile(
    { 
      file: "subscriptions.opml", 
      onArticleRetrieved: function(data) { 
       // console.log("CHECKING!!! ", data.article.link);
        logic.data.CheckIfArticleExists({
          article: data.article,
          no: function(data)
          {
            console.log("NOT FOUND!!! ", data.article.link);
            logic.data.SaveNewArticle({
              article: data.article,
              success: function(data)
              {
               // console.log("EVERYONE HAPPY!!! ");
                //More stuff
              }
            })
          },
          yes: function(data){
            // Already Exists do nothing

          }

        })
      }
    });
 },
 function() {
  //OnComplete

 }
 );
 job1.start();

 var job2 = new cronJob('30 * * * * *', function() {
  //OnJob
  console.log("Checking for articles to process...")
  logic.data.CheckForUnProcessedArticle({
          yes: function(data)
          {
            console.log("FOUND UNPROCESSED!!");
            logic.web.DoesArticleHaveKeywords(
              u_.extend({ 
                keywords: ["GPL", "GNU", "C#", ".NET", "public void", "module.exports", "node", "nodejs", "require", "cpp", ".cs", "erlang", "ruby", "using ", "csharp", " git ", "svn", "java", "php", "html5", "js"],
                yes: function(data){
                  var path = __dirname + '\\data\\' + data.article._id + '.jpg';
                  var targetpath = __dirname + '\\data\\' + data.article._id + '\\';
                  logic.web.RenderArticle( u_.extend({ 
                    path: path,
                    targetpath: targetpath,
                    success: function(data) {
                   //   var __attr = { isvalid:true, processed: true, segments: data.segments, fullrender: path, keywords: data.keywords };
                      logic.data.UpdateArticle({
                        query: { _id: data.article._id }, 
                        change: { $set: { 
                          "__attr.isvalid":true, 
                          "__attr.processed": true, 
                          "__attr.segments": data.segments, 
                          "__attr.fullrender": path, 
                          "__attr.keywords": data.keywords 
                        } },
                        success: function() {
                          console.log("GOOD ARTICLE SAVED!!", data.article.link)
                        }
                      });
                    }
                  }, data));
                  
                },
                no: function(data)
                {
                  //var __attr = { isvalid:false, processed: true };

                  logic.data.UpdateArticle({
                    query: { _id: data.article._id }, 
                    change: { $set: { 
                      "__attr.isvalid":false, 
                      "__attr.processed": true
                    } },
                    success: function() {
                      console.log("BAD ARTICLE SAVED!!", data.article.link)
                    }
                  });
                }
              }, data)
            );
          },
          no: function(data)
          {
            //do nothing?

          }
        })
 },
 function() {
  //OnComplete

 }
 );
 job2.start();