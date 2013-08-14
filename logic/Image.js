//var canvas = require('canvas');
var u_ = require('underscore');
var im = require('imagemagick');
var z = require('../util/util.js');
exports.splitImageIntoHorizontalSegs = function(data)
{
	im.readMetadata(data.path, function(err, metadata){
  		if (err) throw err;
  		var count = Math.floor(metadata.height / data.segmentsize);
  		for(var i = 0; i < count; i++)
  		{
  			var top = i * data.segmentsize;
  			var height = data.segmentsize;
  			var width = metadata.width;
			im.crop({
  				srcPath: data.path,
  				dstPath: data.targetpath + i.toString() + ".jpg",
  				width: width,
  				top: top,
  				height: height
			}, 
			function(err, stdout, stderr){
				// foo
			});
  		}
		z.callonce({funcName: "success", toRemove: ["success", "error"], obj: u_.extend({
			segmentCount: count
		}, data)});
  	});
}
