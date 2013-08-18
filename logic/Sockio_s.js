var data = require('./Data');

exports.init = function(app) {

    var io = require('socket.io').listen(app);

    io.sockets.on('connection', function(socket) {
        socket.on('article:create', function(data, callback) {
            console.log('article create');
            
            //data.fetch
            
            
        });

        socket.on('article:read', function(data, callback) {
            console.log('article read');
            
            
            
        });

        socket.on('article:update', function(data, callback) {
            console.log('article update');
        });

        socket.on('article:delete', function(data, callback) {
            console.log('article delete');
        });

    });

}