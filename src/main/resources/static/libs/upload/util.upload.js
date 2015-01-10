var callback=
 		{
 		
 		add:function(img)
 			{ 		
 			var im = $("#prodotto .img"); 
 			
 			var box = $("<DIV/>");
 				box.width(im.width());
 				box.height(im.height());
 				box.css("position","relative");
 				box.css("overflow","hidden");
 			im.wrap(box);
 			
 			var loading = $("<DIV/>",{"class":"loading","data-bind":"style:{top:remainPerc},text:progressPerc"});
 				loading.css("top","100%");
 				loading.css("background-image","url("+img.data+")")
 				loading.css("background-size","cover");
 				loading.css("position","absolute");
 				loading.width(im.width());
 				loading.height(im.height());
 				
 			callback.loading=loading;
 			$("#prodotto .img").before(loading); 			
 			//$("#prodotto .img").css("background-image","url("+img.data+")"); 			
 			
 			
 			kendo.bind(loading,img);
 			},
 		progress:function(img)
 			{
 			},
 		end:function(img)
 			{ 	 			
 			callback.loading.html("");
 			model.product.set("img",img.src); 			
 			}
 		}

var upload =		
        {            
        data:null,
        upload:null,
        callback:null,
        maxUpload:2,
        actUpload:0,
        images:[],
        choice: function (callback)
            {               
        	this.init();
        	this.upload.click();               
        	this.callback=callback;
            },
        chosen:function(ev)
            {
            var act = this;
            if (ev.target.files && ev.target.files[0]) 
            	{
                var FR = new FileReader();
                FR.onload = function (e) 
                	{
                    var binaryString = e.target.result;                        
                    
                    var obj = upload.start(binaryString,act.callback);                                            
                	};
                FR.readAsDataURL(ev.target.files[0]);
            	}
            },            
        init: function ()
        	{
            if ($("#upload").size() == 1) return;

            var act = this;
            $("body").prepend("<FORM><INPUT TYPE='file' id='upload'/></FORM>");
            act.upload=$("#upload");
            act.upload.hide();
            $(act.upload).bind("change",function(e){ act.chosen(e)});
        	},              
        start:function(data,callback)
        	{
        	var upload = this;
        	var img =
        		{
        		id:null,
        		callback:callback,
            	data:data,
            	progress:0,
            	progressPerc:"0%",
            	remainPerc:"100%",
            	inUpload:false,  
            	canvas:function()
            		{
            		var rsimage = new Image();
						rsimage.src=this.data;
            		var mainCanvas = document.createElement("canvas");
	        		var width=rsimage.width; 	
            		var height=rsimage.height; 	
        			var ctx = mainCanvas.getContext("2d");	        				
        			return {ctx:ctx,canvas:mainCanvas,image:rsimage};
            		},
            	orientation:function(callback)
            		{    
            		var canvas 		= this.canvas();
        			var rsimage 	= canvas.image;
        			var mainCanvas 	= canvas.canvas;		        		 	
        			var ctx 		= canvas.ctx;
        			var height		= rsimage.height;
        			var width		= rsimage.width;
        			alert(mainCanvas.width+"X"+mainCanvas.height);
        			mainCanvas.height	= height;
        			mainCanvas.width	= width;
        			
        			alert(mainCanvas.width+"X"+mainCanvas.height);
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
                                break;
                            case 6:
                                // 90� rotate right
                                ctx.rotate(0.5 * Math.PI);
                                ctx.translate(0, -height);
                                break;
                            case 7:
                                // horizontal flip + 90 rotate right
                                ctx.rotate(0.5 * Math.PI);
                                ctx.translate(width, -height);
                                ctx.scale(-1, 1);
                                break;
                            case 8:
                                // 90� rotate left
                                ctx.rotate(-0.5 * Math.PI);
                                ctx.translate(-width, 0);
                                break;
                        	}
                		ctx.drawImage(rsimage, 0, 0, mainCanvas.width, mainCanvas.height);
                		//orientation
                		setTimeout(function() 
 	                    	{
            			 	var resizedata = mainCanvas.toDataURL('image/jpeg');
 	                    	this.data=resizedata;
 	                        //alert("Modified Image Data: "+resizedata.substring(0, 30)+"...");
 	                       // $("#img").attr("src",resizedata);
 	                        if(callback) callback();
 	                        }, 100);
//                          act.save();                	    	
            	        });
            		},
	        	resize:function(callback)
	        		{                		
	        		var canvas = this.canvas();
	        		var rsimage = canvas.image;        					
	    			var mainCanvas = canvas.canvas;
	    			var ctx =canvas.ctx;
	    			
	    			var horizontal 	= rsimage.width>rsimage.height;
	        		var vertical 	= !horizontal;                		
	        		var width 		= null;
	        		var height 		= null;	            		
	        		if(horizontal)
	        			{
	            	    width = 800;
	            	    height = (rsimage.height/rsimage.width)*width;
	        			}
	        		if(vertical)
	        			{
	        			height = 600;
	        			width = (rsimage.width/rsimage.height)*height;
	        			}
	        		mainCanvas.width=width;
	        		mainCanvas.height=height;
	        		
	        		ctx.drawImage(rsimage, 0, 0, mainCanvas.width, mainCanvas.height);
	                setTimeout(function() 
	                	{
	                	var resizedata = mainCanvas.toDataURL('image/jpeg');
	                	this.data=resizedata;	      
	                	//alert("Modified Image Data: "+resizedata.substring(0, 30)+"...");
	                    
	                    if(callback) callback();
	                    }, 100);
	        		},
            	start:function()
            		{                   	
            		var act=this;
            		this.inUpload=true;                		
            		this.resize(function()
            			{                			
            			act.orientation(function()
            				{
            				$("#img").attr("src",this.data);
            				});	
            			});   
            		},
            	save:function()
            		{                	
            		var act = this;
            		$.ajax({
            			url:"https://blistering-fire-1397.firebaseio.com/images.json",
            			method:"post",
            			data:JSON.stringify({data:act.data}),
            			xhr: function()
            				{
            				var xhr = $.ajaxSettings.xhr() ;
            					xhr.upload.onprogress = function(evt)
            						{
            						act.set("progress",evt.loaded/evt.total*100);
            						act.set("progressPerc",parseInt(evt.loaded/evt.total*100)+"%");
            						act.set("remainPerc",parseInt(100-(evt.loaded/evt.total*100))+"%");
            						try{act.callback.progress(act);}catch(e){}
            						} ;                				   
            				return xhr ;
            				},
            			success:function(data)
            				{                		    	
            				act.set("src",data.name);
    				    	act.end();
            				}
            			})  
            		},
            	end:function()
            		{                    	
            		try{this.callback.end(this);}catch(e){}
            		for(var i in upload.images)
            			if(upload.images[i]==this)
            				{                				
            				upload.images.splice(i,1);
            				upload.end(this);                				
            				return;
            				}
            		}                	
            	};
            	            	
            	//img = kendo.observable(img);
            	//try{this.callback.add(img);}catch(e){}
            	$("#img").attr("src",data);
            	
            	this.images.push(img);
            	this.update();
            	
            	return img;
            	},
        end:function(img)
        	{
        	this.actUpload--;
        	this.update();
        	},
        update:function()
        	{            	            	
        	while(this.actUpload<this.maxUpload && this.images.length>0)
        		try{
            		for(var i in this.images)
	            		if(!this.images[i].inUpload)
	            			{	            			
	            			this.images[i].start();
	            			this.actUpload++;
	            			return;
	            			}
        			}catch(e){}
        	}
        };
