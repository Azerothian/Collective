
/**
 * Module dependencies.
 */
var u_ = require('underscore');
var http = require('http');
var path = require('path');



var express = require('express');
var routes = require('./routes');
var logic = require('./logic');
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('ip', process.env.IP || "0.0.0.0")
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('private key here'));
app.use(express.session());
app.use(app.router);
app.use(require('less-middleware')({ src: __dirname + '/public' }));
app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.static('/js/lib/backbone.iobind/', __dirname + '/node_modules/backbone.iobind/dist/'));
// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
}

app.configure('production', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
//app.get('/users', user.list);




if (!module.parent) {
    var server = http.createServer(app);
    
    logic.sockio.init(server);
    
    server.listen(app.get('port'), app.get('ip'), function(){
        console.log('Express server listening on ip: '+ app.get('ip') +' port: ' + app.get('port'));
    });
}
