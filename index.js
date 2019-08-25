var maps;;
var player;
var clock = 0;
var delay = 5;
var mapsplit = {w:40,h:40}

function setup() {
  var min = ~~(Math.min(windowWidth, windowHeight)/100)*100;
  createCanvas(min, min);
  noStroke();
  maps = Array.apply(null, Array(mapsplit.w)).map(v=>Array.apply(null, Array(mapsplit.h)).map(v=>false))
  player = new playerObject({
    size:{w:width/mapsplit.w, h:height/mapsplit.h}
  });
}

function draw(){
  background("#080808");
  game();
}

function game(){
  clock = (clock+1)%delay;
  if(player.body.length<3)
    player.generate();
  if(clock==0)
    player.apply();
  var find = false;
  for(var x=0;x<maps.length;x++)
    for(var y=0;y<maps[x].length;y++)
    if(maps[x][y]){
      find = true;
      fill("#7186e5");
      rect(y*player.size.w, x*player.size.h, player.size.w, player.size.h);
    }
  if(!find){
    let x = ~~(Math.random()*maps.length);
    let y = ~~(Math.random()*maps[x].length);
    maps[x][y] = true;
  }

  //if(clock==0&&console.clear());

  for(var i=0;i<player.body.length;i++){
    let pos = player.body[i].pos;
    let size = player.size;
    let x = ~~(pos.x/size.h),
        y = ~~(pos.y/size.w),
        x0 = ~~(player.body[0].pos.x/player.size.w),
        y0 = ~~(player.body[0].pos.y/player.size.h);
    fill(i==0?"#98C8C5":"#a1c6b5")
    //fill(i==0?"#d1e6e5":"#a1c6b5");
    rect(pos.x, pos.y, size.w, size.h);

    if(i!=0 && x0 == x && y0 == y)
      player = new playerObject({size:{w:width/mapsplit.w, h:height/mapsplit.h}});
    
    if(maps[y][x]){
      player.generate();
      maps[y][x] = false;
    }

    text(`${i}`, pos.x+size.w/3-textWidth(`${i}`)/2, pos.y+size.h/3*2);
  }
}

function keyPressed(){
  player.control(key);
  if(key=='g')
    player.generate();
}

function playerObject({size, ctrl}){
  this.size = size||{
    w:40,
    h:40
  };
  this.body = [new blockObject({
    x: 0,
    y: 0,
    dir: {
      x: 1,
      y: 0
    }
  })];
  this.ctrl = ctrl||{
    u:"w",
    d:"s",
    l:"a",
    r:"d",
    lu:"q",
    ld:"z",
    ru:"e",
    rd:"c"
  };
  this.action = {
    
  }
  this.upgrade = false;
  this.dir = {
    x:1,
    y:0
  };
}
playerObject.prototype.apply = function() {
  let newBlock = null;
  if(this.upgrade)
    newBlock = new blockObject({
      x: this.body[this.body.length-1].pos.x,
      y: this.body[this.body.length-1].pos.y,
      dir:{
        x:(this.body[this.body.length-1]||this.body[0]).dir.x,
        y:(this.body[this.body.length-1]||this.body[0]).dir.y
      }
    });

  for (var i=this.body.length-1;i>-1;i--){
    if(i>0){
      this.body[i].move(this.size);
      this.body[i].chdir(this.body[i-1].dir);
    }else{
      this.body[i].move(this.size);
      this.body[i].chdir(this.dir);
    }
  }
  if(newBlock!=null)
    this.body.push(newBlock);
  this.upgrade = false;
}
playerObject.prototype.generate = function(){
  this.upgrade = true;
}
playerObject.prototype.control = function(key) {
  let dir = {x:0, y:0}
  switch(key){
    case this.ctrl.u:
      dir.x =  0
      dir.y = -1;
    break;
    case this.ctrl.d:
      dir.x =  0
      dir.y =  1;
    break;
    case this.ctrl.l:
      dir.x = -1;
      dir.y =  0;
    break;
    case this.ctrl.r:
      dir.x =  1;
      dir.y =  0;
    break;
    case this.ctrl.lu:
      dir.x =  -1;
      dir.y =  -1;
    break;
    case this.ctrl.ld:
      dir.x =  -1;
      dir.y =   1;
    break;
    case this.ctrl.rd:
      dir.x =  1;
      dir.y =  1;
    break;
    case this.ctrl.ru:
      dir.x =   1;
      dir.y =  -1;
    break;
  }
  let x1 = this.body[0].pos.x/this.size.w,
      y1 = this.body[0].pos.y/this.size.h,
      x2 = this.body[1].pos.x/this.size.w-dir.x,
      y2 = this.body[1].pos.y/this.size.h-dir.y;
  //console.log(x1, x2, y1, y2, dir);
  if(x1!=x2&&y1!=y2&&!(dir.x==0&&dir.y==0))
    this.dir = dir;
}


function blockObject({x,y,dir}) {
  this.pos = {
    x: x || 0,
    y: y || 0
  };

  this.dir = dir || {
    x: 0,
    y: 0
  };
}
blockObject.prototype.move = function(size) {
  let x = this.dir.x*(size.w||1),
      y = this.dir.y*(size.h||1);
  this.pos.x = (this.pos.x + x)%width;
  this.pos.y = (this.pos.y + y)%height;
    if(this.pos.x<0)
    this.pos.x = width+x;
  if(this.pos.y<0)
    this.pos.y = height+y;
}
blockObject.prototype.chdir = function({x, y}){
  this.dir.x = x;
  this.dir.y = y;
}
