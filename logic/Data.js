///////////////////////MONGO !!! :D
var mongojs = require('mongojs');
var db = mongojs('articles', ['articles']); // lol
var u_ = require('underscore');
var z = require('../util/util.js');

exports.CheckIfArticleExists = function(data)
{
	//console.log("[Data] CheckIfArticleExists");
	db.articles.find({
		"__attr.articleKey": data.article.__attr.articleKey
		}, function(error, value) {
			var func = "no"
			if(value.length > 0)
			{
				func = "yes";
			}
			 z.callonce({
			 	funcName: func, 
			 	toRemove: ["yes", "no"], 
			 	obj: u_.extend({
			 		article: func == "yes" ? value[0] : data.article
			 	}, data)
			 });
			}
	);
}

exports.CheckForUnProcessedArticle = function(data)
{

    console.log("[Data] CheckForUnProcessedArticle");
	db.articles.find({
		"__attr.processed": false
		}).limit(1, function(error, value) {
			var func = "no"
			if(value.length > 0)
			{
				func = "yes";
			}
			var objs =  u_.extend({
			 		article: func == "yes" ? value[0] : data.article
			 	}, data);
			 z.callonce({
			 	funcName: func, 
			 	toRemove: ["yes", "no"], 
			 	obj: objs
			 });
		}
	);
}

exports.UpdateArticle = function(data)
{
	console.log("[Data] UpdateArticle");
	db.articles.update( 
		data.query, 
		data.change,
		{}, 
		function(err) {
			 z.callonce({
			 	funcName: "success", 
			 	toRemove: ["success", "error"], 
			 	obj: data
			 });
		}
    // doc.tag === 'maintainer'
	);

}
	


exports.SaveNewArticle = function(data)
{
	console.log("[Data] SaveNewArticle");
	var art = data.article;
	if(!(art.__attr))
	{
		art.__attr = { isvalid: false, processed: false };
	}

	db.articles.save(data.article, 
		function(err, doc) {
			z.callonce({
				funcName: "success", 
				toRemove: ["success", "error"], 
				obj: u_.extend({
					article: doc
				})
			});	
		}
	);
}


