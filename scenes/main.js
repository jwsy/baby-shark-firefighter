const BULLET_SPEED = 640;
// const ENEMY_SPEED = 60;
const ENEMY_SPEED = 50;
// const PLAYER_SPEED = 120;
const PLAYER_SPEED = 200;

// draw background on the bottom, ui on top, layer "obj" is default
layers([
  "bg",
  "obj",
  "ui",
], "obj");

var el = document.getElementsByTagName("canvas")[0];
el.addEventListener("touchstart", handleTouchMouseStartMove, false);
// el.addEventListener("touchend", handleEnd, false);
// el.addEventListener("touchcancel", handleCancel, false);
el.addEventListener("touchmove", handleTouchMouseStartMove, false);
var epochTime = Date.now();

function findPos(obj) {
  var curleft = 0,
    curtop = 0;

  if (obj.offsetParent) {
    do {
      curleft += obj.offsetLeft;
      curtop += obj.offsetTop;
    } while (obj = obj.offsetParent);

    return { x: curleft - document.body.scrollLeft, y: curtop - document.body.scrollTop };
  }
}

function handleTouchMouseStartMove(evt) {
  evt.preventDefault();
  var el = document.getElementsByTagName("canvas")[0];
  clientRec = el.getBoundingClientRect();
  x = evt.targetTouches[0].pageX;
  y = evt.targetTouches[0].pageY;
  // console.log(clientRec, x, y);
  var curTime = Date.now();
  if (curTime - epochTime > 100) {
    epochTime = curTime
    // spawnBullet(player.pos);
  }
  // if (x < clientRec.width / 2) {
  //   movePlayerLeft();
  // }
  // else if (clientRec.width / 2 < x) {
  //   movePlayerRight();
  // }
  updateTouchPosText(x, y);
}

const score = add([
  pos(12, 12),
  text(0),
  // all objects defaults origin to center, we want score text to be top left
  // plain objects becomes fields of score
  {
    value: 0,
  },
]);

const babyshark = add([
  sprite("baby-shark-firefighter"),
  pos(width() / 2, height() - 50),
  origin("center"),
  "babyshark",
  scale(2),
  {
    animSpeed: 0.3
  },
]);

function movePlayerLeft() {
  if (babyshark.pos.x > 0) {
    babyshark.move(-PLAYER_SPEED, 0);
  }
};

function movePlayerRight() {
  if (babyshark.pos.x < width()) {
    babyshark.move(PLAYER_SPEED, 0);
  }
};

function movePlayerUp() {
  if (babyshark.pos.y > 0) {
    babyshark.move(0, -PLAYER_SPEED);
  }
};

function movePlayerDown() {
  if (babyshark.pos.y < height()) {
    babyshark.move(0, PLAYER_SPEED);
  }
};


function spawnEnemy() {
  enemySpriteArr = ["fire", "fire"];
  // enemySprite = enemySpriteArr[Math.floor(Math.random() * 8)]
  enemySprite = enemySpriteArr[Math.floor(Math.random() * 2)]
  return add([
    sprite(enemySprite),
    pos(rand(10, width() - 10), rand(10, height() - 10)),
    "enemy",
    {
        animSpeed: 0.9
    },
    enemySprite
  ]);
}

action("enemy", (e) => {
  e.scale = 1 + 0.1 * Math.sin(time());
});

for (let i = 0; i < width()/90; i++) {
  add([
    sprite("bubble"),
    pos(rand(10, width() - 10), rand(10, height() - 10)),
    scale(3),
    layer("bg"),
    "bubble"
  ]);
}

action("bubble", (r) => {
  r.scale = 3 + Math.sin(time()) * .2;
  r.move(0, -32);
  if (r.pos.y >= height()) {
    r.pos.y -= height() * 2;
  }
  if (r.pos.y <= 0) {
    r.pos.y += height() * 2;
  }
});

// if a "bullet" and a "enemy" collides, remove both of them
collides("babyshark", "enemy", (b, e) => {
  // console.log(JSON.stringify(e) );
  if (e.is("rainbowpoop")) {
    score.value += 10;
    camShake(12);
  }
  else {
    score.value += 1;
    camShake(5);
  }
  // destroy(b);
  destroy(e);
  score.text = score.value;
});


// display fps
const fpsText = add([pos(width() * 0.6, 12), text("fps"), { value: 0, },]);
function updateFps() {
  fpsText.value = parseFloat(debug.fps()).toFixed(3);
  fpsText.text = "fps: " + fpsText.value;
};
loop(0.1, updateFps);

// display mpos
const mousePosText = add([pos(width() * 0.6, 12 * 2), text("mpos: no mouse detected"), { value: 0 },]);
function updateMousePosText() {
  mp = mousePos();
  // console.log("updateMousePosText.mp: ", JSON.stringify(mp));
  mousePosText.text = "mpos: " + JSON.stringify(mp);
  var curTime = Date.now();
  if (curTime - epochTime > 100) {
    epochTime = curTime
    // spawnBullet(player.pos);
  }
  if (mp.x <= babyshark.pos.x- 10) {
    movePlayerLeft();
  }
  else if (babyshark.pos.x <= mp.x - 10) {
    movePlayerRight();
  }
  if (mp.y <= babyshark.pos.y- 10) {
    movePlayerUp();
  }
  else if (babyshark.pos.y <= mp.y - 10) {
    movePlayerDown();
  }


};

// display tpos
const touchPosText = add([pos(width() * 0.6, 12 * 3), text("tpos: no touch detected"), { value: 0 },]);
function updateTouchPosText(x, y) {
  touchPosText.text = "tpos: " + JSON.stringify({ "x": Math.ceil(x), "y": Math.ceil(y), });
  // console.log("touchPosText.text", touchPosText.text);
};


mouseDown(updateMousePosText);
babyshark.clicks(() => {
  console.log("aloha");
});

// spawn an enemy every period
loop(2.0, spawnEnemy);