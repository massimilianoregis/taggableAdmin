/*var model=
{
    store:
          {
              type:"store",
              name:"store",
              machines:
                  [
                      {
                          type:"machine",
                          name: "machine1"
                      }
                  ]
          }
}

var filters =
    {
        store:
            {
                addMachine: function () { }
            },
        model:
            {
                store:
                    {
                        machines:
                            {
                                item: function (obj)
                                    {
                                    obj.remove = function () { }
                                    }
                            }
                    }
            }
        
    }*/

var filter=
{
    _filters:{},
    add:function(filter,name)
    	{
    	this._filters[name]=filter;
    	this[name]=function(obj,path)
    		{
    		return this.filter(name,obj,path)
    		}
    	},
    remove:function(obj){return null;},
    filter:function(name,obj,path)
    {
    	if(obj==null) 	return null;
        if(path==null) 	path = name;        
        var type = obj.type;

        var action = null;
        if (action == null) try { action = this._filters[name][type]; } catch (e) { }
        if (action == null) try { action = this._filters[name][path]; } catch (e) { }
        if (action == null) try { action = eval("this._filters."+ path); } catch (e) { }

        if(action!=null)
            {                	
        	if(typeof(action)=="function")
        		try {obj=action(obj);} catch (e) {}
            if (typeof(action) == "object")// && !(obj instanceof Array))
            	{
            	if(action._filter!=null)
            		try{obj = action.filter(obj);}catch(e){}
                $.extend(obj, $.extend({},action,action["default"], obj));
            	}
            }
        for (var i in obj)
            {
            var lastPath = i;
            if (obj instanceof Array) lastPath = "item";
            if (typeof (obj[i]) == "object")
                obj[i]=this.filter(name,obj[i], path + "." + lastPath);
            }        
                
        try{obj.init();}catch(e){}
        
        return obj;
    }
}
//filter.filter(model);