angular.module("ngCommunity",["ngAnimate","cgBusy"])
	.factory("community",["$http",function($http)
	    {
		return {
			login:function(mail,psw)
				{
				return $http.post("/community/login",{mail:mail,psw:psw});
				},
			register:function(mail,psw)
				{				
				return $http.post("/community/register",{mail:mail,psw:psw});
				}
			}
	    }])
	.controller("communityListController",[function()
        {
		
        }])
    .controller("communityRegisterController",["$scope","$rootScope","$http","community","$q",function($scope,$rootScope,$http,community,$q)
        {
    	$scope.loading=null;
    	$scope.send=function()
			{					
			var deferred = $q.defer();
			
			community.register(this.mail,this.psw)
				.then(function()
					{
					deferred.resolve({});
					},
				function()
					{
					deferred.reject({});
					});
			
			$scope.loading=deferred.promise;
			return $scope.loading;
			}
        }])
	.controller("communityController",["$scope","$rootScope","$http","community","$q",function($scope,$rootScope,$http,community,$q)
		{				
		$scope.$root.user.logged=$scope.$root.user.logged||false;
		$scope.view="login";
		$scope.page=
			{
			remember	:	function(){$scope.view="remember"},
			login		:	function(){$scope.view="login"},
			QR			:	function()
				{
				$scope.view="QR"
				setTimeout(function()
						{
						$("#webcam").show();
						$("video").css(
								{
								position:"absolute",
								width:$("#qrpanel").width(),
								height:$("#qrpanel").height(),
								top:$("#qrpanel").offset().top,
								left:$("#qrpanel").offset().left
								});	
						},1000);
				},
			register	:	function(){$scope.view="register"},
			logged		:	function(){$scope.view="logged"}
			}
//		
//		$scope.user=
//			{
//			logged	:	false,
//			first_name: "Massimiliano",
//			last_name: 	"Regis",
//			mail	:	"massimiliano.regis@ekaros.it",
//			psw		:	"MACITO",
//			psw2	:	"MACITO",
//			img:"/images/profile.jpg"
//			}
		$scope.facebook=
			{
			login:function()
				{
				
				}
			}
		$scope.twitter=
			{
			login:function()
				{
				
				}
			}
		$scope.QR=
			{
			login:function()
				{
				
				}
			}
		
		$scope.resetPsw=function()
			{
			
			};
		$scope.lostPsw=function()
			{
			
			};
		$scope.register=function()
			{
			
			};
		
		$scope.unlock=
			{						
			psw:"",
			state:"",
			send:function()
				{	
				this.state=""
				community.login($scope.user.mail,this.psw)
					.then(function()
						{						
						window.location.href="/"
						},
						function()
						{
						$scope.unlock.state="error";
						})					
				}
			}
		$scope.$watch("unlock.psw",function(){$scope.unlock.state="";});
		$scope.loading=null;
			
		$scope.register=
			{				
			send:function()
				{					
				var deferred = $q.defer();
				
				community.register(this.mail,this.psw)
					.then(function()
						{
						deferred.resolve({});
						},
					function()
						{
						deferred.reject({});
						});
				
				$scope.loading=deferred.promise;
				return $scope.loading;
				}
			};
				
		$scope.login=
			{					
			mail:$scope.$root.user.mail,
			psw: $scope.$root.user.psw,
			send:function()
				{				
				var deferred = $q.defer();
				community.login(this.mail,this.psw)
					.then(function(data)
						{
						var user = data.data;
						if(user.img==null) user.img="/images/profile.jpg";
						$scope.$root.user=user;
						$scope.$root.user.logged=true;
						
						deferred.resolve(user);
						window.location.href="#";
						},
					function()
						{
						deferred.reject(user)
						})
				return deferred.promise;
				}			
			};
		var parentScope=function()
			{
			var parent = $scope.parent
			while(parent!=null)
				parent = $scope.parent
			}
		$scope.logout=function()
			{
			$scope.user.logged=false;
			$scope.view="login";
			}
		}])
		
