//*variable field
var START_TIME = 16000;
var wiresinfo = {
    bluewire: {
        uncuturl: "../img/uncut-blue-wire.png",
        cuturl: "../img/cut-blue-wire.png"
    },
    greenwire: {
        uncuturl: "../img/uncut-green-wire.png",
        cuturl: "../img/cut-green-wire.png"
    },
    redwire: {
        uncuturl: "../img/uncut-red-wire.png",
        cuturl: "../img/cut-red-wire.png"
    },
    whitewire: {
        uncuturl: "../img/uncut-white-wire.png",
        cuturl: "../img/cut-white-wire.png"
    },
    yellowwire: {
        uncuturl: "../img/uncut-yellow-wire.png",
        cuturl: "../img/cut-yellow-wire.png"
    }
}
var remainTime;
var wireToCut = [];
var wireCut = [];
var intervalHandler;
var delayHandler;
var cutWireSound;
var loseSound;


//*element field
var mainEl;
var wiresImgElArr;
var ctlBtnEl;
var wireBoardEl;
var timerPEl;
var bkgSoundEl;
var cheerEl;
var winSongEl;

//*event field
document.addEventListener('DOMContentLoaded', function(e){
    console.log('loaded!');
    mainEl = document.getElementsByTagName('main')[0];
    wiresImgElArr = document.getElementById('wireboard').getElementsByTagName('img');
    ctlBtnEl = document.getElementById('ctlbtn');
    wireBoardEl = document.getElementById('wireboard');
    timerPEl = document.getElementById('timer').getElementsByTagName('p')[0];
    bkgSoundEl = document.getElementById('gamebackground');
    console.log(bkgSoundEl);
    cheerEl = document.getElementById('cheer');
    winSongEl = document.getElementById('winsong');
    cheerEl.addEventListener('ended', function() {
        winSongEl.play();
    })
    ctlBtnEl.addEventListener('click', createGame);
 
});



//*function field
function createGame() {
    mainEl.style.background = 'url("img/simcity.jpg")';
    for (let wireimg of wiresImgElArr) {
        wireimg.src = wiresinfo[wireimg.id].uncuturl;
    }
    remainTime = START_TIME;
    wireToCut = [];
    wireCut = [];
    timerPEl.style.color = 'green';
    timerPEl.textContent = '00:00:' + (remainTime/1000).toFixed(3);
    for (let wire in wiresinfo) {
        if (Math.random() >= 0.5) {
            wireToCut.push(wire);
        }
    }
    console.log(wireToCut);
    
    cutWireSound = new sound('sounds/Electricity.wav');
    loseSound = new sound('sounds/BldgExplode.wav');
    bkgSoundEl.play();

    ctlBtnEl.textContent = 'RESET';
    wireBoardEl.addEventListener('click', cutWire);
    let timeInterval = 69;
    intervalHandler = setInterval(function(){
        remainTime -=timeInterval;
        // console.log('00:00:' + (remainTime/1000).toFixed(3));
        timerPEl.textContent = '00:00:' + (remainTime/1000).toFixed(3);
        if (remainTime <= 0) {
            timerPEl.textContent = '00:00:00.000';
        }
    }, timeInterval);
}

function cutWire(evt) {
    console.log('Cut wire');
    cutWireSound.play();
    let wire = evt.target.id;
    // console.log(wire);
    // console.log(evt.target.src, wiresinfo[wire].cuturl);
    evt.target.src = wiresinfo[wire].cuturl;
    if (!wireCut.includes(wire)) {
        if (wireToCut.includes(wire)) {
            wireCut.push(wire)
            
        } else {
            delayHandler = setTimeout(loseGame, 700);
        }
        if (wireCut.length === wireToCut.length) {
            winGame();
        }
    }
}

function loseGame() {
    console.log('Lose');
    bkgSoundEl.pause();
    bkgSoundEl.currentTime = 0;
    loseSound.play();
    mainEl.style.background ="url('../img/explosion.jpg')";
    clearInterval(intervalHandler);
    timerPEl.style.color = 'red';
    wireBoardEl.removeEventListener('click', cutWire);
}

function winGame() {
    console.log('Win');
    clearInterval(intervalHandler);
    bkgSoundEl.pause();
    bkgSoundEl.currentTime = 0;
    cheerEl.play();
    wireBoardEl.removeEventListener('click', cutWire);
}

function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }    
}