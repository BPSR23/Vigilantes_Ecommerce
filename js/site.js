var ICT = ICT || {};

;ICT.Util = {

	user : function(){
		
		var userCon = {}
		,	_ua		=	navigator.userAgent;
				
		userCon.clickTrigger	=	'ontouchstart' in window ? 'touchstart' : 'click';
		userCon.resizeTrigger	=	'onorientationchange' in window ? 'orientationchange' : 'resize';
		userCon.touchStart		= 	'touchstart',
		userCon.touchMove		=	'touchmove',
		userCon.touchEnd		=	'touchend',
		userCon.touch			=	Modernizr.touch;
		userCon.iOS				=	RegExp("iPhone").test(_ua) || RegExp("iPad").test(_ua) || RegExp("iPod").test(_ua);
		userCon.mozilla			=	$.browser.mozilla
		userCon.ie				=	$.browser.msie
		userCon.handheld		=	$(window).width() < 480 || RegExp("iPhone").test(_ua) || RegExp("iPod").test(_ua);		
		
		return userCon;
		
	},

};


ICT.Viewer = function(opts){	
	
	var viewer = {}
	,	wcst	= this
	,	user	= wcst.Util.user()
	,	threshold = 65
	,	touchTarget
	,	touchStartX
	,	touchEndX;	
	
	var config = {
		imgs: 	$('.viewer img, .viewer iframe'),
		slider: $('.viewer'),
		slide:	$('.slider-item'),
		ctrl:	$('.control'),
		indic:	$('.indic')
	};	
	
	$.extend(config,opts);	

	var cur			= 0
	,	len			= config.imgs.length
	,	ind_class	= 'indic-active';	
	
	function controlClick( evt ){		
		
		if(typeof(evt.keyCode) === 'undefined'){
			var tgt = $(evt.currentTarget);
			
			if(tgt.hasClass('next')){
				cur++;
			}else if(tgt.hasClass('prev')){
				cur--;	
			}else if(tgt.hasClass('ind')){
				cur = tgt.index();
			}		
		}else{
			
			if(evt.keyCode===39)
			cur++;
			else if(evt.keyCode === 37)
			cur--;
		};
		
		
		if(cur > len-1) cur = 0;
		if(cur<0) cur = len-1;
		
		viewer.update();
		
	};
	
	function setupIndicators(){
		
		var i = 0
		,	class_str;
		
		for(i; i<len; i++){
			
			if(i === cur)
			class_str = 'ind '+ind_class
			else
			class_str = "ind";
			
			config.indic.append('<li class="'+class_str+'"></li>');
		}
		
		$('.ind').on('click', controlClick);
		
		if(len == 1){
			config.ctrl.hide();		
		}
		
	};			
	
	viewer.update = function(){
		
		var calc = ( -cur * $(window).width() );
		
		// Slider pos
		config.slider.css({"marginLeft":calc+'px'});
		
		// UI indicators
		$('.'+ind_class).removeClass(ind_class)
		$('.ind').eq(cur).addClass(ind_class);
		
		$('.next,.prev').removeClass('deactive');
		
		
		if(cur === 0 ){
			$('.prev').addClass('deactive');
		}else if(cur === len-1){
			$('.next').addClass('deactive');
		}
		
	};
	
	// Resize method, called on device rotate or window resize
	viewer.resize = function(){
		
		//console.log('res');
		
		// Calculate window width
		// * by # of slides to make ul proper width
		var nw = $(window).width()
		,	calc = nw*len;
		
		// Set each individual slide to the width of the viewport to
		// allow our proper slide effect
		config.slide.each(function(){$(this).css({width:nw+'px'});});
		
		// Set slider itself to window.width * # slides
		config.slider.css({width:calc+'px'});
		
		this.update();
		
		if(!user.handheld){
			config.imgs.each(function(){
				
				var self 	=	$(this)
				,	selfh	=	self.height()
				,	sh		= 	config.slider.height()
				,	calc	= 	(sh-selfh)/2;		
							
				if(selfh > 0) self.css({'marginTop':calc+'px'});
				
			});
		}else{
			
			var fi = config.imgs.eq(0);
			if( fi.parent().hasClass('isvid') ){
				fi.attr('height',234);
				fi.css({'marginBottom':'15px'})
			}else{
				fi.css({'marginTop':'15px'});
			}			
			
		}			
		
	}
	
	
	viewer.resize();	
	
	if(!user.handheld){	
		setupIndicators();		
		$('body').on('keyup',controlClick);	
	}	
	config.ctrl.on('click',controlClick);		
	return viewer;

};

// Document ready
$(function(){
	
	
	// Create an instance of our viewer in our ICT global {}
	// so that it can be called from various points externally
	ICT.viewer = ICT.Viewer();
	
	// Set listener to broadcast events
	$(window).bind('resize', function(){
		ICT.viewer.resize();
	});
	
	//setTimeout(function(){
		window.scrollTo(0,1);
	//}, 10 );
	
});


$(window).load(function(){
	if(ICT.viewer){
		ICT.viewer.resize();
	}
});