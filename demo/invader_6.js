(function(w,d){

  var __options = {
    canvas_size : { x : null , y : null },
    bitmap_size : { w : 64 , h : 64},

    cannon : {
      color : "#57F2D6",
      bitSize : 4,
      src : "//wordpress.ideacompo.com/wp-content/uploads/invader/cannon.dot",
      x : 0 , y : 0 , w : 64, h : 64,
      moveX : 10
    },
    uso : {
      color : "white",
      bitSize : 4,
      src : "//wordpress.ideacompo.com/wp-content/uploads/invader/ufo.dot",
      x : 0 , y : 0 , w : 64, h : 64,
      moveX : 10
    },
    bullet : {
      color : "white",
      bitSize : 4,
      src : "//wordpress.ideacompo.com/wp-content/uploads/invader/bullet.dot",
      x : 0 , y : 0 , w : 64, h : 64,
      moveX : 10
    },
    
    invader_src : {
      "crab" : [
        '//wordpress.ideacompo.com/wp-content/uploads/invader/crab_1.dot',
        "//wordpress.ideacompo.com/wp-content/uploads/invader/crab_2.dot"
      ],
      "octpus" : [
        "//wordpress.ideacompo.com/wp-content/uploads/invader/octpus_1.dot",
        "//wordpress.ideacompo.com/wp-content/uploads/invader/octpus_2.dot"
      ],
      "squid" : [
        "//wordpress.ideacompo.com/wp-content/uploads/invader/squid_1.dot",
        "//wordpress.ideacompo.com/wp-content/uploads/invader/squid_2.dot"
      ]
    },
    invader_info : {w : 64, h : 64 , bitSize : 4},
    invader_row_infos : [
      { invader : "squid" , color : "#68F205"},
      { invader : "crab"  , color : "#68F205"},
      { invader : "crab"  , color : "#57F2D6"},
      { invader : "octpus", color : "#57F2D6"},
      { invader : "octpus", color : "#F22786"}
    ]
  };

  var MAIN = function(canvas_selector){
    this.canvas_selector = canvas_selector || "canvas";
    this.shoots = [];
    this.pattern = 0;

    this.setCanvas(this.canvas_selector);
    this.set_imageMax();
    this.event_set();
    this.bitmap_load();
    this.view();
    this.animation_roop(30);
  };

  MAIN.prototype.setCanvas = function(selector){
    this.canvas_elm = d.querySelector(selector);
    if(!this.canvas_elm){return;}
    this.canvas_elm.style.setProperty("background-color","black","");
    
    if(w.innerWidth < this.canvas_elm.offsetWidth){
      this.canvas_elm.setAttribute("width" , w.innerWidth);
    }
    if(w.innerHeight < this.canvas_elm.offsetHeight){
      this.canvas_elm.setAttribute("height" , w.innerHeight);
    }

    __options.canvas_size.x = this.canvas_elm.offsetWidth;
    __options.canvas_size.y = this.canvas_elm.offsetHeight;
    __options.cannon.y      = __options.canvas_size.y - 100;

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

  MAIN.prototype.bitmap_load = function(){
    var bitmap_files = [];
    bitmap_files.push(__options.cannon.src);
    bitmap_files.push(__options.uso.src);
    bitmap_files.push(__options.bullet.src);
    for(var i in __options.invader_src){
      for(var j=0; j<__options.invader_src[i].length; j++){
        bitmap_files.push(__options.invader_src[i][j]);
      }
    }
    for(var i=0; i<bitmap_files.length; i++){
      this.image_bit_set(bitmap_files[i]);
    }
  };

  MAIN.prototype.view = function(){
    // invader
    this.view_invader();

    // canon
    this.image(__options.cannon , "cannon");
  }

  MAIN.prototype.view_invader = function(){
    if(typeof __options.invaders === "undefined"){
      this.init_invaders_info();
    }
    for(var i in __options.invaders){
      for(var j in __options.invaders[i]){
        this.image(__options.invaders[i][j][this.pattern]);
      }
    }

  };

  MAIN.prototype.init_invaders_info = function(){
    // 配置マージン
    margin = 10;
    // 配置個数（w）
    var count_w = Math.floor((__options.canvas_size.x - margin * 2) / __options.bitmap_size.w) -1;

    // 敵機配置情報作成
    __options.invaders = [];
    for(var i=0; i<__options.invader_row_infos.length; i++){
      var type = __options.invader_row_infos[i].invader;
      __options.invaders[i] = [];
      var srcs = __options.invader_src[type];
      for(var j=0; j<count_w; j++){
        __options.invaders[i][j] = [];
        for(var k=0; k<srcs.length; k++){
          // var options = JSON.parse(JSON.stringify(__options.invader[type][k]));
          __options.invaders[i][j][k] = {
            color : __options.invader_row_infos[i].color,
            x     : (j * __options.bitmap_size.w) + margin,
            y     : (i * __options.bitmap_size.h) + margin,
            type  : type,
            src   : srcs[k]
          };
        }
        
      }
    }
    // return options_invaders;
    // console.log(__options.invaders);
  };

  MAIN.prototype.image_cache = [];
  MAIN.prototype.image = function(options){
    if(!this.canvas_elm){return;}
    if(!options){return;}

    if(typeof this.image_cache[options.src] !== "undefined"){
      this.image_bit_make(options);
    }
  };
  // MAIN.prototype.image_file_set = function(options , key){
  //   this.image_cache[key] = new Image();
  //   var img = this.image_cache[key];
  //   img.src = options.src;
  //   img.onload = (function(options){
  //     this.image_draw(options , key);
  //   }).bind(this , options);
  // };

  MAIN.prototype.image_bit_set = function(src){
    this.image_cache[src] = {
      bitsize : 0,
      bitmap  : []
    };
    new AJAX({
      url       : src,
      methdo    : "GET",
      async     : true,
      onSuccess : (function(src , data){
        var char16 = data.split("\n");
        for(var i in char16){
          // 16進数を２進数に変換
          var char2 = parseInt(char16[i] , 16).toString(2);
          // ゼロパディング用桁数算出
          var str_count = Math.pow(char16[i].length , 2);
          var zero = new Array(str_count).fill("0").join("")
          // サイズ取得
          this.image_cache[src].bitsize = __options.bitmap_size.w / str_count;
          char2 = (zero + char2).slice(-str_count);
          this.image_cache[src].bitmap.push(char2);
        }
        // if(flg === "view"){console.log(options);
        //   this.image_bit_make(options);
        // }
      }).bind(this , src)
    });
  };
  MAIN.prototype.image_bit_make = function(options){
    if(typeof this.image_cache[options.src]         === "undefined"
    || typeof this.image_cache[options.src].bitmap  === "undefined"
    || typeof this.image_cache[options.src].bitsize === "undefined"){return;}

    var bitmap  = this.image_cache[options.src].bitmap;
    var bitsize = this.image_cache[options.src].bitsize;
    this.ctx.fillStyle   = options.color;
    this.ctx.strokeStyle = null;
    this.ctx.strikeWidth = 0;
    for(var i=0; i<bitmap.length; i++){
      for(var j=0; j<bitmap[i].length; j++){
        var bit = bitmap[i].charAt(j);
        if(bit == 0){continue;}
        var w = bitsize;
        var h = bitsize;
        var x = options.x + (j * w);
        var y = options.y + (i * h);
        this.ctx.fillRect(x , y , Math.ceil(w) , Math.ceil(h));
      }
    }
  };


  // MAIN.prototype.image_draw = function(options , key){
  //   if(typeof this.image_cache[key] !== "object"){return}
  //   var img = this.image_cache[key];
  //   this.ctx.drawImage(img , options.x, options.y ,options.w , options.h);
  // };

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
    // anim_flg = setTimeout(func , 3000);
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

    this.animation_shoot();
  };

  MAIN.prototype.animation_shoot = function(){
    if(!this.shoots.length){return;}
    for(var i in this.shoots){
      var w = 1 * __options.cannon.bitSize;
      var h = 2 * __options.cannon.bitSize;
      if(this.shoots[i].y < h){
        this.shoots.splice(i,1);
      }
      else{
        this.ctx.fillStyle   = "white";
        this.ctx.fillRect(this.shoots[i].x - __options.cannon.bitSize , this.shoots[i].y , w , h);
        this.shoots[i].y -= __options.cannon.bitSize * 2;
      }
    }
  };

  MAIN.prototype.cannon_move = function(pos){
    if(pos < 0){
      pos = 0;
    }
    else if(pos > this.canvas_elm.offsetWidth - __options.bitmap_size.w){
      pos = this.canvas_elm.offsetWidth - __options.bitmap_size.w;
    }
    __options.cannon.x = pos;
  };

  MAIN.prototype.animation = function(){
    this.clear();
    this.nextPattern(300);
    this.view();
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
    for(var i in __options.invader_src){
      this.image_max = __options.invader_src[i].length;
      break;
    }
  };

  /* Event */

  MAIN.prototype.event_set = function(){
    new LIB().event(w , "click"      , (function(e){this.click(e)}).bind(this));
    new LIB().event(w , "keydown"    , (function(e){this.keydown(e)}).bind(this));
    new LIB().event(w , "keyup"      , (function(e){this.keyup(e)}).bind(this));
    new LIB().event(w , "mousemove"  , (function(e){this.mousemove(e)}).bind(this));
    new LIB().event(w , "touchmove"  , (function(e){this.touchmove(e)}).bind(this));
    new LIB().event(w , "touchend"   , (function(e){this.touchend(e)}).bind(this));
  };

  MAIN.prototype.click = function(e){
    // if(this.flg_gamestart === true){return}
    this.shoot_add();
  };

  MAIN.prototype.shoot_add = function(){
    if(this.shoots.length < 2){
      this.shoots.push({
        x : __options.cannon.x + (__options.bitmap_size.w / 2),
        y : __options.cannon.y + (__options.cannon.bitSize * 4)
      });
    }
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

      case 32:  // space
      this.shoot_add();
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

  var AJAX = function(option){
    if(!option){return}
		var httpoj = this.createHttpRequest();
    if(!httpoj){return;}
    
		// var option = new MAIN().setOption(options);
		var data   = this.setQuery(option);
		if(!data.length){
			option.method = "get";
		}

		httpoj.open( option.method , option.url , option.async );
    httpoj.setRequestHeader('Content-Type', option.type);
		
		httpoj.onreadystatechange = function(){
			if (this.readyState==4 && httpoj.status == 200){
				option.onSuccess(this.responseText);
			}
		};

		// FormData 送信用
		if(typeof option.form === "object" && Object.keys(option.form).length){
			httpoj.send(option.form);
		}
		// query整形後 送信
		else{
			if(data.length){
				httpoj.send(data.join("&"));
			}
			else{
				httpoj.send();
			}
		}
  };
	AJAX.prototype.dataOption = {
		url:"",
		query:{},
		querys:[],
		data:{},
		form:{},
		async:"true",
		method:"POST",
		type:"application/x-www-form-urlencoded",
		onSuccess:function(res){},
		onError:function(res){}
	};
	AJAX.prototype.createHttpRequest = function(){
		//Win ie用
		if(window.ActiveXObject){
			//MSXML2以降用;
			try{return new ActiveXObject("Msxml2.XMLHTTP")}
			catch(e){
				//旧MSXML用;
				try{return new ActiveXObject("Microsoft.XMLHTTP")}
				catch(e2){return null}
			}
		}
		//Win ie以外のXMLHttpRequestオブジェクト実装ブラウザ用;
		else if(window.XMLHttpRequest){return new XMLHttpRequest()}
		else{return null}
  };
  // URL-Queryの作成
  AJAX.prototype.setQuery = function(option){
		var data = [];
		if(typeof option.datas !== "undefined"){
			for(var key of option.datas.keys()){
				data.push(key + "=" + option.datas.get(key));
			}
		}
		if(typeof option.query !== "undefined"){
			for(var i in option.query){
				data.push(i+"="+encodeURIComponent(option.query[i]));
			}
		}
		if(typeof option.querys !== "undefined"){
			for(var i=0;i<option.querys.length;i++){
				if(typeof option.querys[i] == "Array"){
					data.push(option.querys[i][0]+"="+encodeURIComponent(option.querys[i][1]));
				}
				else{
					var sp = option.querys[i].split("=");
					data.push(sp[0]+"="+encodeURIComponent(sp[1]));
				}
			}
		}
    return data;
  }





  new LIB().event(w , "load" , function(){new MAIN("#mycanvas")});
})(window,document);