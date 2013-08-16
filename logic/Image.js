var canvas = require('canvas');
var u_ = require('underscore');
var z = require('../util/util.js');
var fs = require('fs');
var mkdirp = require('mkdirp');
var Canvas = require('canvas');
var Image = Canvas.Image;

exports.splitImageIntoHorizontalSegs = function(data) {
    mkdirp(data.targetpath, function(err) {
        if (err) throw err;
        
        console.log("READS");
        fs.readFile(data.path, function(err, file) {
            if (err) throw err;
            var img = new Image();
            img.src = file;
            var count = Math.floor(img.height / data.segmentsize);
            
        console.log("SEP");
            for (var i = 0; i < count; i++) {
                var top = i * data.segmentsize;
                var height = data.segmentsize;
                var width = img.width;
                var cv = new Canvas(width, height);
                var ctx = cv.getContext('2d');
                ctx.drawImage(img, 0, top, img.width, height, 0, 0, width, height);
                // path was created unless there was error

                var out = fs.createWriteStream(data.targetpath + i.toString() + ".jpg");
                var stream = cv.createJPEGStream({
                    bufsize: 4096 // output buffer size in bytes, default: 4096 
                    ,
                    quality: 100 // JPEG quality (0-100) default: 75
                    ,
                    progressive: false // true for progressive compression, default: false
                });
                stream.on('data',u_.bind(function(chunk) {
                    this.write(chunk);
                }, out));

            }
            z.callonce({funcName: "success", toRemove: ["success", "error"], obj: u_.extend({
                segmentCount: count
            }, data)});
        });
    });
}

