(function(w,d){

  var event = function(target, mode, func , flg){
    flg = (flg) ? flg : false;
		if (target.addEventListener){target.addEventListener(mode, func, flg)}
		else{target.attachEvent('on' + mode, function(){func.call(target , window.event)})}
  };

  var MAIN = function(canvas_selector){
    this.canvas_selector = canvas_selector || "canvas";
    this.canvas_elm = d.querySelector(this.canvas_selector);
    this.ctx = this.canvas_elm.getContext("2d");
    this.ctx.imageSmoothingEnabled       = false;
    this.ctx.mozImageSmoothingEnabled    = false;
    this.ctx.webkitImageSmoothingEnabled = false;
    this.ctx.msImageSmoothingEnabled     = false;

    this.set_imageMax();
    this.pattern = 0;
    this.view(this.pattern);
    this.animation_roop(30);
  };

  var __images = {
    "crab" : [
      {
        src : "../images/dot/crab_1.png",
        x : 10, y : 64,
        w : 64, h : 64
      },
      {
        src : "../images/dot/crab_2.png",
        x : 10, y : 64,
        w : 64, h : 64
      }
    ],
    "octpus" : [
      {
        src : "../images/dot/octpus_1.png",
        x : 80, y : 64,
        w : 64, h : 64
      },
      {
        src : "../images/dot/octpus_2.png",
        x : 80, y : 64,
        w : 64, h : 64
      }
    ],
    "squid" : [
      {
        src : "../images/dot/squid_1.png",
        x : 150, y : 64,
        w : 64, h : 64
      },
      {
        src : "../images/dot/squid_2.png",
        x : 150, y : 64,
        w : 64, h : 64
      }
    ]
  };

  MAIN.prototype.clear = function(){
    this.ctx.clearRect(0, 0,  this.canvas_elm.width,  this.canvas_elm.height);
  };

  MAIN.prototype.view = function(pattern){
    for(var i in __images){
      this.image(__images[i][pattern]);
    }
  }

  MAIN.prototype.image_cache = [];
  MAIN.prototype.image = function(options){
    if(!this.canvas_elm){return;}
    if(!options){return;}
    // 新規読み込み
    if(typeof this.image_cache[options.src] === "undefined"){
      this.image_cache[options.src] = new Image();
      var img = this.image_cache[options.src];
      img.src = options.src;
      img.onload = (function(options){
        this.image_draw(options , img);
      }).bind(this , options);
    }
    // キャッシュ利用
    else{
      this.image_draw(options , img);
    }
    
  };

  MAIN.prototype.image_draw = function(options){
    if(typeof this.image_cache[options.src] === "undefined"){return}
    var img = this.image_cache[options.src];
    this.ctx.drawImage(img , options.x, options.y ,options.w , options.h);
  };

  MAIN.prototype.animation_roop = function(time){
    var func = (function(e){this.animation(e)}).bind(this);

    if(window.requestAnimationFrame
    ||  window.webkitRequestAnimationFrame
    ||  window.mozRequestAnimationFrame
    ||  window.oRequestAnimationFrame
    ||  window.msRequestAnimationFrame){
      window.requestAnimationFrame(func);
    }
    else{
      time = time || 10;
      anim_flg = setTimeout(func , time);
    }
  };

  MAIN.prototype.animation = function(){
    this.clear();
    this.nextPattern(300);
    this.view(this.pattern);
    this.animation_roop(30);
  }
  MAIN.prototype.nextPattern = function(frame_rate){
    this.prev_time = this.prev_time || 0;
    if((+new Date()) - this.prev_time < frame_rate){return}
    this.prev_time = (+new Date());

    this.pattern++;
    if(this.pattern >= this.image_max){
      this.pattern = 0;
    }
  };

  MAIN.prototype.set_imageMax = function(){
    for(var i in __images){
      this.image_max = __images[i].length;
      break;
    }
  };



  event(w , "load" , function(){new MAIN("#mycanvas")});
})(window,document);