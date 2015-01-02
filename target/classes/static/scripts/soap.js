angular.module('soap',["ngRoute"])
	.config(['$routeProvider', 
      	function($routeProvider) 
      		{
        	$routeProvider        		
        		.when('/soap', 		{templateUrl: 'views/soap/action.html'})
        		.when('/soap/test', {controller:"testController",templateUrl: 'views/soap/test.html'})
        	
        		.when('/404',{templateUrl: 'views/pages/404.html'})
        		.otherwise({redirectTo: '/products/list'});
        	}]
      )
	.factory("send",["$q","$http",function($q,$http)
		{
		var call = function()
			{			
			return $http.post("https://tst.vaservices.eu/cbk-qa1/services/Dcms","<request><applicazione>?</applicazione><password>cartasi</password><userId>allBossc</userId><utentePortale>?</utentePortale></request>");			
			}
		return {call:call}
		}])
	.controller("testController",["$scope","send",function($scope,send)
		{		
		$scope.test=[
		             {	name:"openSession",
		            	request:"<request><applicazione>?</applicazione><password>cartasi</password><userId>allBossc</userId><utentePortale>?</utentePortale></request>",
			             call:function()
			             	{
			            	send.call().success(function(data){alert(data);});
			             	}
		             },
		             {name:"createClaim"}
		             ]
		}]);