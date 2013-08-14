
/**
 * Module dependencies.
 */
var u_ = require('underscore');
var fs = require('fs');
var express = require('express');
var routes = require('./routes');
var cronJob = require('cron').CronJob;
var logic = require('./logic');

console.log(logic.feed);

logic.feed.ProcessFile(
{ 
  file: "subscriptions.opml", 
  onArticleRetrieved: function(data) { 
    logic.data.articles_stack.push(data.article);
  }
});

var job = new cronJob({
  cronTime: '*/2 * * * * *', // every minute?
  onTick: function() {
    var article = logic.data.articles_stack.pop();
   // console.log(article);
    if(article)
    {
      
      logic.web.RetrieveArticle(
        { article: article,
          success: function(data) {
            console.log("PHANTOM !!!! Article Retrieved!!", data);
          } 
        });

    }
  },
  start: true,
  //timeZone: "America/Los_Angeles"
});




return;

/*
//var user = require('./routes/user');
var http = require('http');
var path = require('path');

var request = require('request');

var _u = require('underscore')

var cronJob = require('cron').CronJob;

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('!@#$ASD$#QG$#^hg45h5rt7y35$%#@%55sedfdcgfxcfERWTE%&^dgaer634215sdtFGRT(KJE$Yg3fsdrt'));
app.use(express.session());
app.use(app.router);
app.use(require('less-middleware')({ src: __dirname + '/public' }));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
//app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
*/
//scraping cron
//var job = new cronJob({
//  cronTime: '*/5 * * * * *', // every minute?
//  onTick: function() {
//   
//  },
//  start: true,
//  timeZone: "America/Los_Angeles"
//});


//job.start();