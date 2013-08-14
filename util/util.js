 var isArray = Array.isArray || function(obj) {
    return !!(obj && obj.concat && obj.unshift && !obj.callee);};

exports.callonce = function (data)
{
  //data.funcName
  //data.obj
	var func = data.obj[data.funcName];
	var o = data.obj;
	var toRemove = data.toRemove;
 	if(!isArray(toRemove))
 	{
 		toRemove = [data.toRemove];
 	}
    for(var i = 0; i < toRemove.length; i++)
    {
    	if(o[toRemove[i]])
    	{
			delete o[toRemove[i]];
		}
    }
  	if(func)
  	{
    	func(o);
  	} else {
      console.log("[WARN] func not defined: " + data.funcName);

    }
}

exports.validateData =function (data)
{



}
