(function(w,d){

  var __options = {
    canvas_size : {
      x : null , y : null
    },
    "cannon" : {
      src : "//wordpress.ideacompo.com/wp-content/uploads/invader/cannon.png",
      x : 10, y : 200,
      w : 64, h : 64,
      moveX : 10
    },
    "invader" : {
      "crab" : [
        {
          src : "//wordpress.ideacompo.com/wp-content/uploads/invader/crab_1.png",
          x : 10, y : 64,
          w : 64, h : 64
        },
        {
          src : "//wordpress.ideacompo.com/wp-content/uploads/invader/crab_2.png",
          x : 10, y : 64,
          w : 64, h : 64
        }
      ],
      "octpus" : [
        {
          src : "//wordpress.ideacompo.com/wp-content/uploads/invader/octpus_1.png",
          x : 80, y : 64,
          w : 64, h : 64
        },
        {
          src : "//wordpress.ideacompo.com/wp-content/uploads/invader/octpus_2.png",
          x : 80, y : 64,
          w : 64, h : 64
        }
      ],
      "squid" : [
        {
          src : "//wordpress.ideacompo.com/wp-content/uploads/invader/squid_1.png",
          x : 150, y : 64,
          w : 64, h : 64
        },
        {
          src : "//wordpress.ideacompo.com/wp-content/uploads/invader/squid_2.png",
          x : 150, y : 64,
          w : 64, h : 64
        }
      ]
    }
    
  };

  var MAIN = function(canvas_selector){
    this.canvas_selector = canvas_selector || "canvas";
    
    this.setCanvas(this.canvas_selector);
    this.set_imageMax();
    this.pattern = 0;
    this.view(this.pattern);
    this.event_set();

    this.animation_roop(30);
  };

  MAIN.prototype.setCanvas = function(selector){
    this.canvas_elm = d.querySelector(selector);
    
    if(w.innerWidth < this.canvas_elm.offsetWidth){
      this.canvas_elm.setAttribute("width" , w.innerWidth);
    }
    if(w.innerHeight < this.canvas_elm.offsetHeight){
      this.canvas_elm.setAttribute("height" , w.innerHeight);
    }

    __options.canvas_size.x = this.canvas_elm.offsetWidth;
    __options.canvas_size.y = this.canvas_elm.offsetHeight;

    __options.cannon.y = __options.canvas_size.y - 100;

    // smooth
    this.ctx = this.canvas_elm.getContext("2d");
    this.ctx.imageSmoothingEnabled       = false;
    this.ctx.mozImageSmoothingEnabled    = false;
    this.ctx.webkitImageSmoothingEnabled = false;
    this.ctx.msImageSmoothingEnabled     = false;


  };

  

  MAIN.prototype.clear = function(){
    this.ctx.clearRect(0, 0,  this.canvas_elm.width,  this.canvas_elm.height);
  };

  MAIN.prototype.view = function(pattern){

    // invader
    for(var i in __options.invader){
      this.image(__options.invader[i][pattern]);
    }

    // canon
    this.image(__options.cannon);
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

    this.animation_proc();

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

  MAIN.prototype.animation_proc = function(){
    switch(this.keydown_flg){
      case "right":
        this.cannon_move(__options.cannon.x + __options.cannon.moveX);
        break;
      case "left":
        this.cannon_move(__options.cannon.x - __options.cannon.moveX);
        break;
    }
  };
  MAIN.prototype.cannon_move = function(pos){
    if(pos < 0){
      pos = 0;
    }
    else if(pos > this.canvas_elm.offsetWidth - __options.cannon.w){
      pos = this.canvas_elm.offsetWidth - __options.cannon.w;
    }
    __options.cannon.x = pos;
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
    for(var i in __options.invader){
      this.image_max = __options.invader[i].length;
      break;
    }
  };

  /* Event */

  MAIN.prototype.event_set = function(){
    // new LIB().event(window , "click"      , (function(e){this.click(e)}).bind(this));
    new LIB().event(w , "keydown"    , (function(e){this.keydown(e)}).bind(this));
    new LIB().event(w , "keyup"      , (function(e){this.keyup(e)}).bind(this));
    new LIB().event(w , "mousemove"  , (function(e){this.mousemove(e)}).bind(this));
    new LIB().event(w , "touchmove"  , (function(e){this.touchmove(e)}).bind(this));
    new LIB().event(w , "touchend"   , (function(e){this.touchend(e)}).bind(this));
  };

  MAIN.prototype.keydown = function(e){
    switch(e.keyCode){
      case 37:  // <-
      case 'ArrowLeft':
      this.keydown_flg = "left";
      break;

      case 39:  // ->
      case 'ArrowRight':
      this.keydown_flg = "right";
      break;
    }
  };

  MAIN.prototype.keyup = function(e){
    this.keydown_flg = false;
  };

  MAIN.prototype.mousemove = function(e){
    // if(this.flg_gamestart !== true){return;}

    this.mousePos = this.mousePos || e.clientX;
    this.cannon_move(__options.cannon.x + (e.clientX - this.mousePos));
    this.mousePos = e.clientX;
  };

  MAIN.prototype.touchmove = function(e){
    // if(this.flg_gamestart !== true){return;}

    if(!e || !e.touches || e.touches.length > 1){
      this.mousePos = null;
      return;
    }
    this.mousePos = typeof this.mousePos === "number" ? this.mousePos : e.touches[0].clientX;
    this.cannon_move(__options.cannon.x + (e.touches[0].clientX - this.mousePos));
    this.mousePos = e.touches[0].clientX;
  };
  MAIN.prototype.touchend = function(e){
    this.mousePos = null;
  };





  var LIB  = function(){};

  LIB.prototype.event = function(target, mode, func , flg){
    flg = (flg) ? flg : false;
    if (target.addEventListener){target.addEventListener(mode, func, flg)}
    else{target.attachEvent('on' + mode, function(){func.call(target , window.event)})}
  };





  new LIB().event(w , "load" , function(){new MAIN("#mycanvas")});
})(window,document);