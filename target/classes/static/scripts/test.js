

angular.module('myapp')
.factory("product",["$resource","$http",function($resource,$http)
    {	
	return {
		query:function(callback)		{$http.get("/data/index/items").success(callback);},
		get:function(id,callback)		{$http.get("/data/index/item").success(callback);}
		};
    }])
.factory("groups",["$resource","$http",function($resource,$http)
    {	
	return {
		query:function(callback)		{$http.get("/data/index/category").success(callback);},		
		};
    }])
.factory("pricing",["$resource","$http",function($resource,$http)
    {	
	return {
		query:function(callback)		{$http.get("/data/index/pricelist").success(callback);},
		get:function(id,callback)			{$http.get("/data/index/price").success(callback);},
		};
    }])
.factory("orders",["$resource","$http",function($resource,$http)
    {	
	return {
		findByUser:function(callback)	{$http.get("/data/shop/userOrders.json").success(callback);},
		query:function(callback)		{$http.get("/data/shop/userOrders.json").success(callback);},
		get:function(id,callback)		{$http.get("/data/shop/order.json").success(callback);},
		};
    }])
.factory("users",["$http",function($http)		
    {
	return {
		query:function(callback)		{$http.get("/data/community/users.json").success(callback);},
		get:function(id,callback)		{$http.get("/data/community/user.json").success(callback);},
		};	
	}])