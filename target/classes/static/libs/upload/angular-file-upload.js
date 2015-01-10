/**!
 * AngularJS file upload/drop directive with http post and progress
 * @author  Danial  <danial.farid@gmail.com>
 * @version <%= pkg.version %>
 */
(function() {
	$=jQuery
var angularFileUpload = angular.module('angularFileUpload', []);

angularFileUpload.service('$upload', ['$http', '$q', '$timeout', function($http, $q, $timeout) {
	function sendHttp(config) {
		config.method = config.method || 'POST';
		config.headers = config.headers || {};
		config.transformRequest = config.transformRequest || function(data, headersGetter) {
			if (window.ArrayBuffer && data instanceof window.ArrayBuffer) {
				return data;
			}
			return $http.defaults.transformRequest[0](data, headersGetter);
		};
		var deferred = $q.defer();

		if (window.XMLHttpRequest.__isShim) {
			config.headers['__setXHR_'] = function() {
				return function(xhr) {
					if (!xhr) return;
					config.__XHR = xhr;
					config.xhrFn && config.xhrFn(xhr);
					xhr.upload.addEventListener('progress', function(e) {
						deferred.notify(e);
					}, false);
					//fix for firefox not firing upload progress end, also IE8-9
					xhr.upload.addEventListener('load', function(e) {
						if (e.lengthComputable) {
							deferred.notify(e);
						}
					}, false);
				};
			};
		}

		$http(config).then(function(r){deferred.resolve(r)}, function(e){deferred.reject(e)}, function(n){deferred.notify(n)});
		
		var promise = deferred.promise;
		promise.success = function(fn) {
			promise.then(function(response) {
				fn(response.data, response.status, response.headers, config);
			});
			return promise;
		};

		promise.error = function(fn) {
			promise.then(null, function(response) {
				fn(response.data, response.status, response.headers, config);
			});
			return promise;
		};

		promise.progress = function(fn) {
			promise.then(null, null, function(update) {
				fn(update);
			});
			return promise;
		};
		promise.abort = function() {
			if (config.__XHR) {
				$timeout(function() {
					config.__XHR.abort();
				});
			}
			return promise;
		};
		promise.xhr = function(fn) {
			config.xhrFn = (function(origXhrFn) {
				return function() {
					origXhrFn && origXhrFn.apply(promise, arguments);
					fn.apply(promise, arguments);
				}
			})(config.xhrFn);
			return promise;
		};
		
		return promise;
	}

	this.upload = function(config) {
		config.headers = config.headers || {};
		config.headers['Content-Type'] = undefined;
		config.transformRequest = config.transformRequest || $http.defaults.transformRequest;
		var formData = new FormData();
		var origTransformRequest = config.transformRequest;
		var origData = config.data;
		config.transformRequest = function(formData, headerGetter) {
			if (origData) {
				if (config.formDataAppender) {
					for (var key in origData) {
						var val = origData[key];
						config.formDataAppender(formData, key, val);
					}
				} else {
					for (var key in origData) {
						var val = origData[key];
						if (typeof origTransformRequest == 'function') {
							val = origTransformRequest(val, headerGetter);
						} else {
							for (var i = 0; i < origTransformRequest.length; i++) {
								var transformFn = origTransformRequest[i];
								if (typeof transformFn == 'function') {
									val = transformFn(val, headerGetter);
								}
							}
						}
						formData.append(key, val);
					}
				}
			}

			if (config.file != null) {
				var fileFormName = config.fileFormDataName || 'file';

				if (Object.prototype.toString.call(config.file) === '[object Array]') {
					var isFileFormNameString = Object.prototype.toString.call(fileFormName) === '[object String]';
					for (var i = 0; i < config.file.length; i++) {
						formData.append(isFileFormNameString ? fileFormName : fileFormName[i], config.file[i], 
								(config.fileName && config.fileName[i]) || config.file[i].name);
					}
				} else {
					formData.append(fileFormName, config.file, config.fileName || config.file.name);
				}
			}
			return formData;
		};

		config.data = formData;

		return sendHttp(config);
	};

	this.http = function(config) {
		return sendHttp(config);
	}
}]);

angularFileUpload.directive('ngFileSelect', [ '$parse', '$timeout', function($parse, $timeout) {
	return function(scope, elem, attr) {
		var fn = $parse(attr['ngFileSelect']);
		if (elem[0].tagName.toLowerCase() !== 'input' || (elem.attr('type') && elem.attr('type').toLowerCase()) !== 'file') {
			var fileElem = angular.element('<input type="file">')
			var attrs = elem[0].attributes;
			for (var i = 0; i < attrs.length; i++) {
				if (attrs[i].name.toLowerCase() !== 'type') {
					fileElem.attr(attrs[i].name, attrs[i].value);
				}
			}
			if (attr["multiple"]) fileElem.attr("multiple", "true");
			fileElem.css("width", "1px").css("height", "1px").css("opacity", 0).css("position", "absolute").css('filter', 'alpha(opacity=0)')
					.css("padding", 0).css("margin", 0).css("overflow", "hidden");
			fileElem.attr('__wrapper_for_parent_', true);

//			fileElem.css("top", 0).css("bottom", 0).css("left", 0).css("right", 0).css("width", "100%").
//					css("opacity", 0).css("position", "absolute").css('filter', 'alpha(opacity=0)').css("padding", 0).css("margin", 0);
			elem.append(fileElem);
			elem[0].__file_click_fn_delegate_  = function() {
				fileElem[0].click();
			}; 
			elem.bind('click', elem[0].__file_click_fn_delegate_);
			elem.css("overflow", "hidden");
//			if (fileElem.parent()[0] != elem[0]) {
//				//fix #298 button element
//				elem.wrap('<span>');
//				elem.css("z-index", "-1000")
//				elem.parent().append(fileElem);
//				elem = elem.parent();
//			}
//			if (elem.css("position") === '' || elem.css("position") === 'static') {
//				elem.css("position", "relative");
//			}
			elem = fileElem;
		}
		elem.bind('change', function(evt) {
			var files = [], fileList, i;
			fileList = evt.__files_ || evt.target.files;
			if (fileList != null) {
				for (i = 0; i < fileList.length; i++) {
					files.push(fileList.item(i));
				}
			}
			$timeout(function() {
				fn(scope, {
					$files : files,
					$event : evt
				});
			});
		});
		// removed this since it was confusing if the user click on browse and then cancel #181
//		elem.bind('click', function(){
//			this.value = null;
//		});

		// removed because of #253 bug
		// touch screens
//		if (('ontouchstart' in window) ||
//				(navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0)) {
//			elem.bind('touchend', function(e) {
//				e.preventDefault();
//				e.target.click();
//			});
//		}
	};
} ]);

angularFileUpload.directive('ngFileDropAvailable', [ '$parse', '$timeout', function($parse, $timeout) {
	return function(scope, elem, attr) {
		if ('draggable' in document.createElement('span')) {
			var fn = $parse(attr['ngFileDropAvailable']);
			$timeout(function() {
				fn(scope);
			});
		}
	};
} ]);

angularFileUpload.directive('ngFileDrop', [ '$parse', '$timeout', '$location', function($parse, $timeout, $location) {
	return function(scope, elem, attr) {
		if ('draggable' in document.createElement('span')) {
			var leaveTimeout = null;
			elem[0].addEventListener("dragover", function(evt) {
				evt.preventDefault();
				$timeout.cancel(leaveTimeout);
				if (!elem[0].__drag_over_class_) {
					if (attr['ngFileDragOverClass'] && attr['ngFileDragOverClass'].search(/\) *$/) > -1) {
						var dragOverClass = $parse(attr['ngFileDragOverClass'])(scope, {
							$event : evt
						});					
						elem[0].__drag_over_class_ = dragOverClass; 
					} else {
						elem[0].__drag_over_class_ = attr['ngFileDragOverClass'] || "dragover";
					}
				}
				elem.addClass(elem[0].__drag_over_class_);
			}, false);
			elem[0].addEventListener("dragenter", function(evt) {
				evt.preventDefault();
			}, false);
			elem[0].addEventListener("dragleave", function(evt) {
				leaveTimeout = $timeout(function() {
					elem.removeClass(elem[0].__drag_over_class_);
					elem[0].__drag_over_class_ = null;
				}, attr['ngFileDragOverDelay'] || 1);
			}, false);
			var fn = $parse(attr['ngFileDrop']);
			elem[0].addEventListener("drop", function(evt) {
				evt.preventDefault();
				elem.removeClass(elem[0].__drag_over_class_);
				elem[0].__drag_over_class_ = null;
				extractFiles(evt, function(files) {
					fn(scope, {
						$files : files,
						$event : evt
					});					
				});
			}, false);
						
			function isASCII(str) {
				return /^[\000-\177]*$/.test(str);
			}

			function extractFiles(evt, callback) {
				var files = [], items = evt.dataTransfer.items;
				if (items && items.length > 0 && items[0].webkitGetAsEntry && $location.protocol() != 'file' && 
						items[0].webkitGetAsEntry().isDirectory) {
					for (var i = 0; i < items.length; i++) {
						var entry = items[i].webkitGetAsEntry();
						if (entry != null) {
							//fix for chrome bug https://code.google.com/p/chromium/issues/detail?id=149735
							if (isASCII(entry.name)) {
								traverseFileTree(files, entry);
							} else if (!items[i].webkitGetAsEntry().isDirectory) {
								files.push(items[i].getAsFile());
							}
						}
					}
				} else {
					var fileList = evt.dataTransfer.files;
					if (fileList != null) {
						for (var i = 0; i < fileList.length; i++) {
							files.push(fileList.item(i));
						}
					}
				}
				(function waitForProcess(delay) {
					$timeout(function() {
						if (!processing) {
							callback(files);
						} else {
							waitForProcess(10);
						}
					}, delay || 0)
				})();
			}
			
			var processing = 0;
			function traverseFileTree(files, entry, path) {
				if (entry != null) {
					if (entry.isDirectory) {
						var dirReader = entry.createReader();
						processing++;
						dirReader.readEntries(function(entries) {
							for (var i = 0; i < entries.length; i++) {
								traverseFileTree(files, entries[i], (path ? path : "") + entry.name + "/");
							}
							processing--;
						});
					} else {
						processing++;
						entry.file(function(file) {
							processing--;
							file._relativePath = (path ? path : "") + file.name;
							files.push(file);
						});
					}
				}
			}
		}
	};
} ]);

angularFileUpload
.factory("$images",["$timeout",function($timeout)
    {
	var buildcanvas = function(data)
		{		
		var rsimage 	= 	new Image();
			rsimage.src	=	data;			
		var mainCanvas 	= 	document.createElement("canvas");		
		var ctx 	= 	mainCanvas.getContext("2d");	        				
		return {ctx:ctx,canvas:mainCanvas,image:rsimage};
		}
	var orientation=function(data)
		{    
		var defer 		= $.Deferred();
		var canvas 		= buildcanvas(data);
		var rsimage 	= canvas.image;
		var mainCanvas 	= canvas.canvas;		        		 	
		var ctx 		= canvas.ctx;
		var height		= rsimage.height;
		var width		= rsimage.width;		
		mainCanvas.height	= height;
		mainCanvas.width	= width;
						        		
		EXIF.getData(rsimage, function() 
	    	{                     	
	        var exif = EXIF.getAllTags(this);
	        var orientation = exif.Orientation;                    	        
	    	//orientation
	    		    	
			switch (orientation) 
				{
	            case 2:
	                // horizontal flip
	                ctx.translate(width, 0);
	                ctx.scale(-1, 1);
	                break;
	            case 3:
	                // 180� rotate left
	                ctx.translate(width, height);
	                ctx.rotate(Math.PI);
	                break;
	            case 4:
	                // vertical flip
	                ctx.translate(0, height);
	                ctx.scale(1, -1);
	                break;
	            case 5:
	                // vertical flip + 90 rotate right
	                ctx.rotate(0.5 * Math.PI);
	                ctx.scale(1, -1);	                
	                height=rsimage.width;
	                width=rsimage.height;	                
	                break;
	            case 6:
	                // 90� rotate right
	                height=rsimage.width;
	                width=rsimage.height;
	                ctx.rotate(0.5 * Math.PI);
	                ctx.translate(0, -height);	                
	                break;
	            case 7:
	                // horizontal flip + 90 rotate right
	                height=rsimage.width;
	                width=rsimage.height;
	                ctx.rotate(0.5 * Math.PI);
	                ctx.translate(width, -height);
	                ctx.scale(-1, 1);
	                
	                break;
	            case 8:
	                // 90� rotate left
	                height=rsimage.width;
	                width=rsimage.height;
	                ctx.rotate(-0.5 * Math.PI);
	                ctx.translate(-width, 0);
	                break;
	        	}
			
			ctx.drawImage(rsimage, 0, 0, width, height);			
			setTimeout(function() 
	         	{			 	 	           
	            defer.resolve(mainCanvas.toDataURL('image/jpeg'));
	            }, 0);         	    	
	        });
		return defer.promise();
		}
	var resize=function(data,w,h)
		{              		
		var defer 		= $.Deferred();
		var canvas 		= buildcanvas(data);
		var rsimage 	= canvas.image;        					
		var mainCanvas 	= canvas.canvas;
		var ctx 		= canvas.ctx;
		
		var horizontal 	= rsimage.width>rsimage.height;
		var vertical 	= !horizontal;                		
		var width 		= null;
		var height 		= null;	            		
		if(horizontal)
			{
		    width = w;
		    height = (rsimage.height/rsimage.width)*width;
			}
		if(vertical)
			{
			height = h;
			width = (rsimage.width/rsimage.height)*height;
			}
		mainCanvas.width=width;
		mainCanvas.height=height;
		
		ctx.drawImage(rsimage, 0, 0, mainCanvas.width, mainCanvas.height);
	    setTimeout(function() 
	    	{
	    	var resizedata = mainCanvas.toDataURL('image/jpeg');	    	
	        defer.resolve(resizedata);
	        }, 0);
	    return defer.promise();
		}	
	var UUID = function()
		{
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) 
			{
				var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
			return v.toString(16);
			});
		}
	var readData = function(files)
		{
		var defer 		= $.Deferred();
		var size 		= files.length;
		for (i in files) 
			{							
			/*$scope.files[i]=
				{
				data:files[i],
				url:"",
				progress:0
				};*/
			var fileReader = new FileReader();
				fileReader.readAsDataURL(files[i]);
			var loadFile = function(fileReader, index) 
				{
				fileReader.onload = function(e) 
					{
					$timeout(function() 
						{									
						defer.notify(e.target.result,index);
						size--;
						if(size==0) defer.resolve();
						//$scope.files[index].url=e.target.result;						
						});
					}
				}(fileReader, i);			
			}	
		return defer.promise();
		}
	var adjust=function(files,w,h)
		{
		var act = this;
		var defer 		= $.Deferred();
		act.readData(files).progress(function(data,index)
			{						
			act.orientation(data).done(function(data)			
				{						
				act.resize(data,w,h).done(function(data)				
					{							
					defer.notify(data);					
					});
				});
			});
		return defer.promise();
		}
	return {
		readData:readData,
		orientation:orientation,
		resize:resize,		
		adjust:adjust,
		UUID:UUID
		};
    }])
.controller("upload",["$scope","$upload","$images", function($scope,$upload,$images)
	{
	$scope.name="nome";	
	$scope.files=[];
	
	$scope.upload2=function(files,act)
		{
		document.location.href="#shot"
		$images.adjust(files,400,200).progress(function(data)
			{
			var file=act;
			if(act==null)
				{
				file = {url:"",uuid:$images.UUID()};				
				$scope.$apply(function(){$scope.files.push(file);});
				}
			$scope.$apply(function(){file.url=data});
			})
		}
	$scope.upload=function(files,act)
		{			
		$images.readData(files).progress(function(data,index)
			{			
			var file = act;
			if(act==null)
				{
				file = {url:"",uuid:$images.UUID()};
				
				$scope.files.push(file);
				}
			
			$images.orientation(data).done(function(data)			
				{						
				$images.resize(data,200,100).done(function(data)				
					{							
					$scope.$apply(function(){file.url=data});
					//$.post("/upload",{uuid:file.uuid,file:data});
					});
				});
			});
		};
	
	 
	}])

})();
