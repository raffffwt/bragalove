const left = keyboard("ArrowLeft"),
  up = keyboard("ArrowUp"),
  right = keyboard("ArrowRight"),
  down = keyboard("x");

const jumpSpeed = 15;

var audio = new Audio("cuzcuz.mp3");
var audioRaf = new Audio("rafvaga.mp3");
var audioLose = new Audio("bahianolose.mp3");
var stopGame = new Audio("stopgame.mp3");
var fraquinha = new Audio("fraquinha.mp3");
var caboCTaNoChao = new Audio("oh_polemico.mp3");
var isMuted = true;

var tracks = [
  fraquinha,
  caboCTaNoChao
];
var track = tracks[Math.floor(Math.random() * tracks.length)];

function muteUnmute(){
  if(track.muted) {
    track.play();
    document.getElementById("muted").style.display = "none";
    document.getElementById("unmuted").style.display = "block";
    return track.muted = false;
  } else {
    document.getElementById("muted").style.display = "block";
    document.getElementById("unmuted").style.display = "none";
    return track.muted = true;
  }
}

function playNext() {
  if(track.currentTime > 0 && !track.ended) {
    document.getElementById("muted").style.display = "none";
    document.getElementById("unmuted").style.display = "block";
    muteUnmute();
  } else {
    track = tracks[Math.floor(Math.random() * tracks.length)];
    track.play();
  }
}

track.addEventListener('ended', playNext);

audioRaf.volume = 0.2;
const backgroundImage = PIXI.Sprite.from("bahiafundo.png");
const backgroundWin = PIXI.Sprite.from("juliette.png");
const derrota = PIXI.Sprite.from("baianinhoperdeu.png");
const derrotaBackground = PIXI.Sprite.from("bahiafundoderrota.png");
const startScreenImg = PIXI.Sprite.from("startscreen.png");
const botaoStart = PIXI.Sprite.from("botao.png");

const startScreen = new PIXI.Application({
  width: 1000,
  height: 400,
});

document.body.appendChild(startScreen.view);
startScreen.stage.addChild(startScreenImg);
startScreenImg.width = 1000;
startScreenImg.height = 400;
startScreen.stage.addChild(botaoStart);
botaoStart.width = 200;
botaoStart.height = 50;
botaoStart.x = 100;
botaoStart.y = 250;

botaoStart.interactive = true;
botaoStart.buttonMode = true;
botaoStart.on('pointerdown', playGame);

const app = new PIXI.Application({
  width: 1000,
  height: 400,
});

function playGame(){
  track.pause();
  document.getElementById("muted").style.display = "none";
  document.getElementById("unmuted").style.display = "none";
  const hearts = document.getElementsByClassName("heart");
  if(hearts.length < 1){
    window.location.reload();
    audioRaf.play();
    return;
  }
  document.getElementById("hearts").style.visibility = "visible";
  document.body.appendChild(app.view);
  app.x = startScreen.x;
  app.y = startScreen.y;
  app.width = startScreen.width;
  app.height = startScreen.height;
  document.body.removeChild(startScreen.view);
  audioRaf.play();
  app.ticker.add(MainGame);
}

backgroundImage.width = 1000;
backgroundImage.height = 400;
app.stage.addChild(backgroundImage);
let gota = null;
let lastDamageTimer = Date.now();
const baianinho = PIXI.Sprite.from("baianinho2.png");
baianinho.width = 80;
baianinho.height = 80;
baianinho.x = 0;
baianinho.y = app.view.height - baianinho.height;
baianinho.jumpCount = 0;
baianinho.isJumping = false;
baianinho.isFalling = false;
baianinho.fallingCount = 0;
baianinho.moving = "right";
baianinho.dash = 0;

const isPlaying = true;

app.stage.addChild(baianinho);

const kraken = PIXI.Sprite.from("kraken.png");

app.stage.addChild(kraken);

kraken.width = 120;
kraken.height = 120;
let krakenSpeed = 3;
kraken.x = app.view.width - kraken.width;
kraken.y = app.view.height - kraken.height;
kraken.isMoving = "left";

const MainGame = () => {
  if (right.isDown) {
    if(baianinho.x > app.view.width){
      baianinho.x = 0 - baianinho.width;
    }else{
      baianinho.x += 5;
    }
    baianinho.moving = "right";
  }

  if (left.isDown) {
    if(baianinho.x + baianinho.width < 0){
      baianinho.x = app.view.width;
    }else{
      baianinho.x -= 5;
    }
    baianinho.moving = "left";
  }

  if (up.isDown && !baianinho.isJumping && !baianinho.isFalling) {
    baianinho.isJumping = true;
  }

  if(gota != null){
    gota.y += gota.ySpeed;
    if(gota.y > app.view.height){
      app.stage.removeChild(gota);
      gota = null;
    }
  }

  if (baianinho.isJumping && baianinho.jumpCount < 20) {
    baianinho.jumpCount += 1;
    baianinho.y -= jumpSpeed;
  } else if (baianinho.jumpCount >= 20) {
    baianinho.isJumping = false;
    baianinho.isFalling = true;
    baianinho.jumpCount = 0;
  }

  if (baianinho.isFalling && baianinho.fallingCount < 40) {
    baianinho.fallingCount += 1;
    baianinho.y += jumpSpeed / 2;
  } else if (baianinho.fallingCount >= 40) {
    baianinho.isFalling = false;
    baianinho.fallingCount = 0;
  }

  if (kraken.isMoving == "left") {
    if (kraken.x <= app.view.width + kraken.x && kraken.x > -kraken.x) {
      kraken.x -= krakenSpeed;
    }

    if (kraken.x <= krakenSpeed) {
      kraken.isMoving = "right";
    }
  }

  if (kraken.isMoving == "right") {
    if (kraken.x <= app.view.width - kraken.width) {
      kraken.x += krakenSpeed;
    }

    if (kraken.x >= app.view.width - kraken.width) {
      kraken.isMoving = "left";
    }
  }
  
  if (lastDamageTimer < Date.now() && (isCollided(baianinho, kraken) || (gota!= null && isCollided(baianinho, gota)))) {
    lastDamageTimer = Date.now() + 1000;
    baianinho.blendMode = PIXI.BLEND_MODES.MULTIPLY;
    audioLose.play();
    const hearts = document.getElementsByClassName("heart");
    if (hearts.length >= 1) {
      hearts[0].remove();
      if(hearts.length == 0) {
        app.stage.addChild(derrotaBackground);
        derrotaBackground.width = backgroundImage.width;
        derrotaBackground.height = backgroundImage.height;
        derrotaBackground.x = backgroundImage.x;
        derrotaBackground.y = backgroundImage.y;
        app.stage.removeChild(backgroundImage);

        app.stage.addChild(derrota);
        derrota.height = 200;
        derrota.width = 200;
        derrota.x = 500;
        derrota.y = 200;
        app.stage.removeChild(baianinho);
        app.ticker.remove(MainGame);

        app.stage.addChild(botaoStart);
        audioRaf.pause()
        stopGame.play()
      }
    }
  }

  if(lastDamageTimer < Date.now()){
    baianinho.blendMode = PIXI.BLEND_MODES.NORMAL;
  }

  if (isCollided(baianinho, chapeu)) {
    if (power.style.width != "100%") {
      power.style.width = addPercentagePower(power.style.width, 5);
      bar.style.width = removePercentageBar(bar.style.width, 5);
    }
    spawnChapeu();
  }

  if (power.style.width == "100%") {
    power.style.width = "0%";
    bar.style.width = "100%";
    document.getElementById("podertexto").innerText = "PARABENS JOAO VC VENCEU";
    document.getElementById("hearts").style.visibility = "hidden";

    const winnerbraga = PIXI.Sprite.from("bragavitoria.png");
    app.stage.addChild(backgroundWin);
    backgroundWin.width = backgroundImage.width;
    backgroundWin.height = backgroundImage.height;
    backgroundWin.x = backgroundImage.x;
    backgroundWin.y = backgroundImage.y;
    app.stage.removeChild(backgroundImage);

    app.stage.addChild(winnerbraga);
    winnerbraga.height = 200;
    winnerbraga.width = 200;
    winnerbraga.x = 400;
    winnerbraga.y = 10;
    app.stage.removeChild(baianinho);

    app.ticker.remove(MainGame);
    audioRaf.pause()
    audio.play();
  }
  const progress = parseInt(power.style.width.replace("%", ""));
  if(gota == null){
    gota = gerarGota();
    if(progress > 75) {
      gota.ySpeed = 6;
      krakenSpeed = 6
    } 
    else if(progress > 50) {
      gota.ySpeed = 4;
      krakenSpeed = 4;
    }
    
  }
};

function isCollided(object1, object2) {
  const bounds1 = object1.getBounds();
  const bounds2 = object2.getBounds();

  return (
    bounds1.x < bounds2.x + bounds2.width &&
    bounds1.x + bounds1.width > bounds2.x &&
    bounds1.y < bounds2.y + bounds2.height &&
    bounds1.y + bounds1.height > bounds2.y
  );
}

const chapeu = PIXI.Sprite.from("chapeu.png");
chapeu.width = 60;
chapeu.height = 60;

power = document.getElementById("power");
bar = document.getElementById("bar");

app.stage.addChild(chapeu);

function spawnChapeu() {
  chapeu.x = Math.floor(Math.random() * app.view.width - chapeu.width / 2); //math.random(0, app.view.width)
  chapeu.y = Math.floor(Math.random() * app.view.height - chapeu.height / 2);

  return true;
}

spawnChapeu();

function addPercentagePower(string, value) {
  var number = string.split("%")[0];

  number = parseInt(number);

  number += value;

  return String(number) + "%";
}

function removePercentageBar(string, value) {
  var number = string.split("%")[0];

  number = parseInt(number);

  number -= value;

  return String(number) + "%";
}

function gerarGota() {
  const gota = PIXI.Sprite.from("aguamedo.png");
  app.stage.addChild(gota);
  gota.width = 50;
  gota.height = 50;

  gota.ySpeed = 2;

  gota.y = 0;

  gota.x = Math.random() * app.view.width;

  return gota;
}