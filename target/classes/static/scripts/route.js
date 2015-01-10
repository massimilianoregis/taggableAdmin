angular.module('myapp',["app","ngRoute","ngResource","ngCommunity","map","cgBusy","ngUpload",'ui.router',"taggableMock"])
.config(['$routeProvider', 
  	function($routeProvider) 
  		{	  
    	$routeProvider    		    		
    		.when('/products/single/:id', 	{controller:"productController",	template: '<div ng-include="type"/>'})    		
    		.when('/products/new/:type', 	{controller:"productController",	template: '<div ng-include="type"/>'})
    		.when('/products/list', 		{controller:"productsController",	templateUrl: 'views/products/list.html'})
    		.when('/products/groups', 		{controller:"groupsController",		templateUrl: 'views/products/groups.html'})
    		.when('/products/pricing', 		{controller: "pricingController", 	templateUrl: 'views/products/pricing.html'})
    		.when('/products/orders', 		{controller: "ordersController",	templateUrl: 'views/products/orders.html'})
    		.when('/products/order/:id', 	{controller: "ordersController",	templateUrl: 'views/products/order.html'})
    		.when('/products/price', 		{controller: "priceController",		templateUrl: 'views/products/price.html'})    	    
    		
    		.when('/community/lock', 		{controller: "communityController",	templateUrl: 'views/community/lock-screen.html'})
    		.when('/community/login', 		{controller: "communityController",	templateUrl: 'views/community/login.html'})
    		.when('/community/register', 	{controller: "communityController",	templateUrl: 'views/community/register.html'})
    		.when('/community/forgot', 		{controller: "communityController",	templateUrl: 'views/community/forgot.html'})
    		.when('/users/list', 			{controller: "communityListController", templateUrl: 'views/community/users.html'})
    		.when('/users/user/:mail', 		{controller: "communityUserController", templateUrl: 'views/community/user.html'})
    		.when('/user/profile', 			{templateUrl: 'views/user/profile.html'})
    		.when('/user/wish',				{controller: "wishController",		templateUrl: 'views/user/wish.html'})
    		
    		.when('/user/orders', 			{controller: "ordersController", 	templateUrl: 'views/user/orders.html'})
    		.when('/user/order/:id', 		{controller: "ordersController",	templateUrl: 'views/user/order.html'})    		
    		
    		.when('/portal/configuration/:portal', {templateUrl: 'views/portal/config.html'})
    		.when('/portal/pages', {templateUrl: 'views/portal/pages.html'})
    		.when('/portal/ring', {templateUrl: 'views/portal/ring.html'})
    		    	
    		.when('/loyalty/list', {templateUrl: 'views/loyalty/list.html'})
    		
    		.when('/taggable/list', 		{controller:"taggableListController", templateUrl: 'views/taggable/list.html'})
    		.when('/taggable/new/:type', 	{controller:"taggableController",	template: '<div ng-include="type"/>'})
    		.when('/taggable/path', 		{controller:"mapCtrl", templateUrl: 'views/taggable/path.html'})    		    		    		

    		.when('/init',{templateUrl: 'views/pages/init.html'})
    		.when('/404',{templateUrl: 'views/pages/404.html'})
    		.otherwise({redirectTo: '/products/list'});
    	}]
  )
 .value('taOptions',  {
	toolbar: [
		//['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'pre', 'quote'],
		['bold', 'italics', 'underline', 'ul', 'ol'],
		['justifyLeft','justifyCenter','justifyRight']
		//['html', 'insertImage', 'insertLink']
	],
	classes: {
		focussed: "focussed",
		toolbar: "btn-toolbar",
		toolbarGroup: "btn-group",
		toolbarButton: "btn btn-default",
		toolbarButtonActive: "active",
		disabled: "disabled",
		textEditor: 'form-control',
		htmlEditor: 'form-control'
	},
	setup: {
		// wysiwyg mode
		textEditorSetup: function($element){ /* Do some processing here */ },
		// raw html
		htmlEditorSetup: function($element){ /* Do some processing here */ }
	},
	defaultFileDropHandler:
		/* istanbul ignore next: untestable image processing */
		function(file, insertAction){
			var reader = new FileReader();
			if(file.type.substring(0, 5) === 'image'){
				reader.onload = function() {
					if(reader.result !== '') insertAction('insertImage', reader.result, true);
				};

				reader.readAsDataURL(file);
				// NOTE: For async procedures return a promise and resolve it when the editor should update the model.
				return true;
			}
			return false;
		}
	})
.run( function($rootScope, $location) 
	{
	if(true)return;
    $rootScope.$on( "$routeChangeStart", function(event, next, current) 
    	{    	
    	if ( $rootScope.user ==null || !$rootScope.user.logged)         
    		if($location.path().indexOf("/community")<0)
    			$location.path( "/community/login" );
        
    	});     
   })
  .directive('customBackground2', [function(){
    return {
    	restrict: "A",    
        controller: function($scope, $element, $location)
        	{
            var path = function()
               	{
                return $location.path()
                }
            var specific=function(value)
            	{
            	$("body").scope().isSpecificPage=function(){return value}
            	}
            var addBg = function(path)
                {                 
                $element.removeClass('body-home body-special body-tasks body-lock');
                specific(false); 
	            switch(path)
	            	{
	                case '/': 					$element.addClass('body-home'); 	 				break;
	                case '/404': 				$element.addClass('body-special');  specific(true); break;
	                case '/pages/500': 			$element.addClass('body-special');  specific(true); break;
	                case '/pages/signin': 		$element.addClass('body-special');  specific(true); break;
	                case '/pages/signup': 		$element.addClass('body-special');  specific(true); break;
	                case '/community/login': 	$element.addClass('body-special');  specific(true); break;
	                case '/community/register': $element.addClass('body-special');  specific(true); break;
	                case '/community/forgot': 	$element.addClass('body-special');  specific(true); break;
	                case '/community/lock': 	$element.addClass('body-special body-lock'); specific(true); break;
	                case '/pages/lock-screen': 	$element.addClass('body-special body-lock'); specific(true); break;
	                case '/tasks': 				$element.addClass('body-tasks'); 	specific(true); break;
	            	}
                }
            addBg( $location.path() );

            $scope.$watch(path, function(newVal, oldVal) 
                	{
                    if(newVal==oldVal)
                        return;
                    addBg($location.path())
                	});
        	}
    	};
	}])
  .directive('ngConfirmClick', [function() {
	    return {
	        restrict: 'A',
	        link: function(scope, element, attrs) 
	        	{	        		            
	        	element.bind('click', function() {	    	            
	                var message = attrs.ngConfirmMessage;
	                if(!message) message="Sicuro?"
	                bootbox.confirm(message,function(result)
	                	{
	                    scope.$apply(attrs.ngConfirmClick);
	                	});	                
	            });
	        }
	    }
	}])


.factory("taglie",["$q","$http",function($q,$http)
	{	
	var list = function()
		{						
		return ["XS","S","M","L","XL","XXL"];
		}
	return {list:list};
	}])


.factory("orders",["$resource",function($resource)		{return $resource("basket/:id",{id:"@id"});	}])
.factory("pricing",["$resource",function($resource)		{return $resource("index/pricing/:id",{id:"@id"});	}])

.factory("wish",["$resource",function($resource)		{return $resource("data/community/wish/:id",{id:"@id"});	}])

.controller('AppCtrl', ['$scope', '$location',function($scope, $location)
       {		
        $scope.main =
        	{
            brand: 'Flatify',
            name: 'Lisa Doe'
        	}
       }
	])
.controller("wishController",["wish","$scope",function (wish,$scope)
	{		
	wish.query(function(data){$scope.list=data;})	
	}])
.controller("productsController",["product","$scope",function (product,$scope)
	{	
	product.query(function(data){$scope.list=data;})	
	}])
	
/** index.product **/
.factory("product",["$resource",function($resource)		{return $resource("index/item/:id",{id:"@id"});	}])
.controller("productController",["pricing","groups","product","$http","$scope","$routeParams","$resource","$q",function (pricing,groups,product, $http,$scope,$routeParams,$resource,$q)
	{				
	
	// /data/product.json			
	var filter = function(data)
		{		
		for(var i in data)
			$scope[i]=data[i];		
		
		if($scope.gallery==null) $scope.gallery=[];
		
		var type = "base";
		if(data["taglie"]!=null)	{type="wear";}		
		$scope.type="/views/products/single/"+type+".html";		
		
		/*
		taglie.list().then(function(data)
			{
			var taglie = $scope.taglie; 
			$scope.taglie=[];
			for(var i in data)
				{
				var name=data[i].name;
				$scope.groups.push({name:name,checked:find(name)})
				}
			})*/
		var groupList = data.categories;		
		groups.query(function(data)
			{			
			$scope.groups=[];
			angular.forEach(data,function(value,key)
				{
				var name = value.name;
				$scope.groups.push({name:name,checked:$.inArray(name,groupList)>=0})
				})
			
			});
		
		var pricingList = data.prices;
		pricing.query(function(data)
			{			
			$scope.pricing=[];
			angular.forEach(data,function(value,key)			
				{
				var name = value.name;
				try			{$scope.pricing.push({name:name,value:pricingList[name]})}
				catch(e)	{$scope.pricing.push({name:name,value:""})}				
				});
			});
		}
	
	var save=function()
		{					
		var loading = $q.defer();
		
		this.loading=loading.promise;
		var obj = 
				{
				"name":this.name,
				"id":this.id,
				"code":this.code,
				"description":this.description,
				"prices":{},	
				"groups":[],
			 	"gallery":[],
				"extra":$scope.extra
			 	}		
		
		obj.gallery=this.gallery;
		angular.forEach(this.groups,function(value,key)
			{
			if(value.cheched)
				obj.groups.push(value.name);
			})
		angular.forEach(this.pricing,function(value,key)
			{			
			obj.prices[value.name]=value.value;
			})
		product.save(obj,
			function(){loading.resolve(); document.location.href="#/products/list"},
			function(){loading.resolve();});
		}
	
	var obj={}
	if($routeParams.type=="wear") obj={taglie:[]}; 
	if($routeParams.id!=null)
		product.get({id:$routeParams.id},function(data){filter(data)});				
	else
		filter(obj);
	
	$scope.save=save;
	}])
	
/** index.groups **/
.factory("groups",["$resource",function($resource)		{return $resource("/index/category/:id",{id:"@id"});}])
.controller("groupsController",["groups","$http","$scope","$routeParams",function (groups, $http,$scope,$routeParams)
	{	
	$scope.name="";
	$scope.remove=function(item)
		{					
		groups.remove({id:item.name},function()
			{
			var i= $scope.groups.list.indexOf(item)
			$scope.groups.list.splice(i,1);
			});
		}
	$scope.nuovo=function()
		{	
		var obj = {name:$scope.name};		
		groups.save(obj,function(){$scope.groups.list.push(obj)});
		}	
	groups.query(function(data)
		{
		$scope.groups={list:data};			
		});	
	}])
/** /index.groups **/
	
.controller("pricingController",["pricing","$http","$scope","$routeParams","$resource",function (pricing, $http,$scope,$routeParams,$resource)
   	{		
	$scope.nuovo=function(name)
		{	
		var obj = {name:$scope.name};
		
		pricing.save(obj,function(){$scope.list.push(obj);})
		}
	$scope.remove=function(item)
		{				
		var i= $scope.list.indexOf(item)
		$scope.list.splice(i,1);		
		}	
	pricing.query(function(data)
		{
		$scope.list=data;
		})
//	pricing.list().then(function(data)
//		{
//		$scope.list=data;
//		});
	}])	

.controller("priceController",["pricing","$http","$scope","$routeParams",function (pricing, $http,$scope,$routeParams)
   {
   pricing.get($routeParams.id,function(data)
		{
		for(var i in data) $scope[i]=data[i];
		});   
   }])
   
   
.factory("users",["$resource",function($resource)		{return $resource("community/user/:id",{id:"@id"});	}])
.controller("communityListController",["users","$scope","$routeParams",function (users, $scope,$routeParams)
    {		
	users.query(function(data)
		{
		$scope.list=data;
		})
    }])
.controller("communityUserController",["users","orders","$scope","$routeParams",function (users,orders, $scope,$routeParams)
    {				
	users.get({id:$routeParams.mail},function(data)
		{		
		data =data;
		for(var i in data)
			$scope[i]=data[i];
		})
	orders.findByUser({id:$routeParams.mail}).then(function(data)
		{		
		$scope.orders=data.data;
		})
    }])
 .controller("communityLoginController",["$scope","community",function($scope,community)
    {
	community.login($scope.$root.user.mail,$scope.$root.user.psw).then(function(data)
		{
		var user = data.data;
		$scope.$root.user=user;
		$scope.$root.user.logged=true;
		
		if(user.img==null) user.img="/images/profile.jpg";
		window.location.href="#";
		})
    }])
    
    
.controller("ordersController",["orders","$scope","$routeParams",function (orders, $scope,$routeParams)
    {		
	if($routeParams.id!=null)
		{		
		orders.get($routeParams.id,function(data)
			{						
			for(var i in data)
				$scope[i]=data[i];
			})
		return;
		}
	
	orders.query(function(data)
		{				
		$scope.list=data;
		})
    }])
.controller('AppCtrl', ['$scope', '$location',function($scope, $location)
    {           		
    $scope.main =
    	{
        brand: "eKaros",
        
    	};
    
    $scope.$root.user=
		{
		firstName:"Michela",
		lastName:"Regis",
		mail:"massimiliano.regis@ekaros.it",
		psw:"pippo",
		img:"/images/profile.jpg",
		logged:false
		}
    }
])
.controller('taggableController',['$scope',function($scope)
    {
	var type="base";
	$scope.media=[];
	$scope.gallery=[];
	$scope.type="/views/taggable/single/"+type+".html";
    }])
.controller('taggableListController',['$scope','items',function($scope,items)
    {
	$scope.list=[];
	items.query().then(function(data)
		{
		for(i in data)
			{						
			data[i].latitude	=	data[i].position.lat;
			data[i].longitude	=	data[i].position.lng;			
			$scope.list.push(data[i])
			}
		});
	
    }]);



//UNDEFINED

angular.module('myapp')
.factory("orders",["$resource","$http",function($resource,$http)
    {	
   	return {
   		findByUser:function(callback)		{return $http.get("/data/shop/userOrders.json")},
   		query:function(callback)		{return $http.get("/data/shop/userOrders.json")},
   		get:function(id,callback)		{$http.get("/data/shop/order.json").success(callback);},
   		};
    }])


