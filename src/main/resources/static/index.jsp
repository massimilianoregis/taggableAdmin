<%
String mail = request.getParameter("mail");
String psw = request.getParameter("psw");
String context = request.getParameter("context");

String version = request.getParameter("version");
String shop = request.getParameter("shop");
String type = request.getParameter("type");
String url 	= request.getServerName()+request.getContextPath();
	url = url==null?"www.macumba.eu":url;
%>
<!doctype html>
<!--[if gt IE 8]><!--> <html class="no-js"> <!--<![endif]-->
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <title>Web Application</title>
        <meta name="description" content="">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
        <!-- Place favicon.ico and apple-touch-icon.png in the root directory -->
        <link href="http://fonts.googleapis.com/css?family=Lato:300,400,700,300italic,400italic" rel="stylesheet" type="text/css">
        <!-- needs images, font... therefore can not be part of ui.css -->
        <link rel="stylesheet" href="bower_components/font-awesome/css/font-awesome.min.css">
        <link rel="stylesheet" href="bower_components/weather-icons/css/weather-icons.min.css">
        <!-- end needs images -->

            <link rel="stylesheet" href="styles/ui.css"/>
            <link rel="stylesheet" href="styles/main.css">
            
<style>
	.top-header .logo
		{
		text-align:left;
		}
	.top-header .logo span
		{
		margin-left: 13px;
		}
	.chat
		{
		position: fixed;
		bottom: 0;
		right: 0;
		}
	#waiting	
		{
		background-image: url('images/cf-ReverseHourglass_bw.gif');
		width: 43px;
		height: 43px;
		position: absolute;
		left: 5px;
		top: 4px;
		background-size: 77%;
		opacity: 0;
		-webkit-transition-duration: 1s;
		border: solid 5px rgba(255,255,255,.8);
		border-radius: 99PX;
		padding: 10px;
		background-clip: padding-box;
		background-position: 50%;
		background-color: rgba(255,255,255,.6);
		z-index: 100000;
		background-size: cover;
		}
</style>
    </head>
   
    <body data-ng-app="app" id="app" data-custom-background="" data-off-canvas-nav="">
        <!--[if lt IE 9]>
            <p class="browsehappy">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
        <![endif]-->

        <div data-ng-controller="AppCtrl">
            <div data-ng-hide="isSpecificPage()" data-ng-cloak="">
                <section data-ng-include=" 'views/header.html' " id="header" class="top-header"></section>

                <aside data-ng-include=" 'views/nav.html' " id="nav-container"></aside>
            </div>

            <div class="view-container">
                <section data-ng-view="" id="content" class="animate-fade-up"></section>
            </div>
        </div>
        
        <DIV ID="waiting"></DIV>
        <script>
        	function ChatCtrl($scope)
        		{        		        		
        		$scope.txt="test";	
        		$scope.send=function()
        			{        			
        			fb.send({from:user.mail(),msg:$scope.txt});
        			};
        		$scope.sendObj=function()
        			{        			
        			fb.send({from:user.mail(),msg:'lista prodotti',action:'$m.admin.prodotti.findByCode("3000000217")'});
        			};
        		var fb = new FirebaseService("max",
	        		function()
	        			{        
	        			var first = $scope.data==null;	        							        			
	        			$scope.data= $.extend(true,[],fb.data);
	        			
	        			var last =$scope.data[$scope.data.length-1]; 	        			
	        			if(last.action!=null && last.from!=user.mail()) eval(last.action);	   
	        			if(first)$scope.$apply();     			        		
	        			});
        		$scope.data= null;
        		}
        </script>
        <!--div class="col-md-4 col-xs-12 chat" data-ng-controller="ChatCtrl">
        	<div class="panel panel-default">
		        <div class="panel-heading">
		        	<strong><span class="glyphicon glyphicon-th"> </span> Chat</strong>		        	
		        </div>
		        <div class="panel-body">
		        	<UL ng-repeat="d in data">
		        		<LI>{{d.msg}}</LI>
		        	</UL>
		        	<INPUT TYPE="text" ng-model="txt"><A ng-click="send()">+</A>
		        	<A ng-click="sendObj()">obj</A>
		        </div>
		    </div>
        </div-->
        


        <script src="scripts/vendor.js"></script>
        <script src="scripts/ui.js"></script>
        <script src="scripts/app.js"></script>
		<script src="scripts/route.js"></script>        
		<script>
			var pages=
				{
				prodotti:
					{
					list:function(){document.location.href="#/products/list"},
					singolo:function(){document.location.href="#/products/single"},
					nuovo:function(){document.location.href="#/products/single"},
					categorie:function(){document.location.href="#/products/groups"}
					},
				pricing:
					{
					list:function(){document.location.href="#/products/pricing"}	
					},
				pages:
					{
					groups:
						{
						list:function(){document.location.href="#/products/groups"}
						}
					},
				community:
					{
					user:function(){document.location.href="#/users/user"}
					},
				index:
					{
					price:function(){document.location.href="#/index/price"}
					},
				me:
					{
					orders:
						{
						single:function(){document.location.href="#/user/order"}
						}		
					},
				orders:
					{
					single:function(){document.location.href="#/products/order"}
					}
				};
		</script>
        
        
        
        <script src="http://<%=url%>/js/jquery-1.9.1.min.js" type="text/javascript"></script>	
		<script src="http://<%=url%>/js/kendo.all.min.js" type="text/javascript"></script>	
		<script src="http://<%=url%>/services_v21/loader.jsp?shop=<%=context%>&type=admin" type="text/javascript"></script>
		<script type="text/javascript" src="https://cdn.firebase.com/js/client/1.0.15/firebase.js"></script>
		<script type="text/javascript" src="scripts/chat.js"></script>					
		<script type="text/javascript" src="http://<%=url%>/services_v<%=version%>/admin/loader.jsp?mail=<%=mail%>&psw=<%=psw%>&shop=<%=context%>"></script>
		<!--script type="text/javascript" src="http://maps.googleapis.com/maps/api/js?libraries=places&sensor=false"></script-->
		 <script>
		 function select()
		 	{
		 	window.parent.postMessage("open","*");
		 	}
    	
    		/*
    	function message(msg)
			{
			window.parent.postMessage(msg,"*");
			}
		function select(act)
			{
			window.parent.postMessage("open","*");
			//$m.admin.open();
			//$("#administrative .pointer").remove();
			//$(act).parent().prepend("<div class='pointer'><div class='arrow'></div></div>");
			}*/
    </script>
    </body>
</html>