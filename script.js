//Global Variables
const patternSize = 8;
var pattern = [];
var progress = 0;
var gamePlaying = false;
var tonePlaying = false;
var volume = 0.5; //must be between 0.0 and 1.0
var guessCounter = 0;
var mistakes = 0;

// random pattern
for (let i = 0; i < patternSize; i++) {
  pattern.push(Math.floor(Math.random() * patternSize) + 1);
}

function startGame() {
  //initialize game variables
  progress = 0;
  mistakes = 0;
  document.getElementById("mistakesText").innerHTML = "Mistakes: 0"
  gamePlaying = true;
  // swap the Start and Stop buttons
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("stopBtn").classList.remove("hidden");
  document.getElementById("mistakesText").classList.remove("hidden");
  playClueSequence();
}

function stopGame() {
  gamePlaying = false;
  document.getElementById("startBtn").classList.remove("hidden");
  document.getElementById("stopBtn").classList.add("hidden");
  document.getElementById("mistakesText").classList.add("hidden");
}

// global constants
const nextClueWaitTime = 1000; //how long to wait before starting playback of the clue sequence

function clueHoldTime() {
  if (progress < 3) {
    return 1000;
  } else if (progress < 6) {
    return 666;
  } else {
    return 333;
  }
}

function cluePauseTime() {
  if (progress < 3) {
    return 333;
  } else if (progress < 6) {
    return 222;
  } else {
    return 100;
  }
}

// Sound Synthesis Functions
const freqMap = {
  1: 261.6256,
  2: 293.6648,
  3: 329.6276,
  4: 349.2282,
  5: 391.9954,
  6: 440.0000,
  7: 493.8833,
  8: 523.2511
};

function playTone(btn, len) {
  o.frequency.value = freqMap[btn];
  g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025);
  tonePlaying = true;
  setTimeout(function() {
    stopTone();
  }, len);
}

function startTone(btn) {
  if (!tonePlaying) {
    o.frequency.value = freqMap[btn];
    g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025);
    tonePlaying = true;
  }
}

function stopTone() {
  g.gain.setTargetAtTime(0, context.currentTime + 0.05, 0.025);
  tonePlaying = false;
}

//Page Initialization
// Init Sound Synthesizer
var context = new AudioContext();
var o = context.createOscillator();
var g = context.createGain();
g.connect(context.destination);
g.gain.setValueAtTime(0, context.currentTime);
o.connect(g);
o.start(0);

function lightButton(btn) {
  document.getElementById("button" + btn).classList.add("lit");
}
function clearButton(btn) {
  document.getElementById("button" + btn).classList.remove("lit");
}

function playSingleClue(btn) {
  guessCounter = 0;
  let delay = nextClueWaitTime;
  if (gamePlaying) {
    lightButton(btn);
    playTone(btn, clueHoldTime());
    setTimeout(clearButton, clueHoldTime(), btn);
  }
}

function playClueSequence() {
  let delay = nextClueWaitTime; //set delay to initial wait time
  for (let i = 0; i <= progress; i++) {
    // for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms");
    setTimeout(playSingleClue, delay, pattern[i]); // set a timeout to play that clue
    delay += clueHoldTime();
    delay += cluePauseTime();
  }
}

function loseGame() {
  stopGame();
  alert("Game Over. You lost.");
}

function winGame() {
  stopGame();
  alert("Game Over. You won!");
}

function guess(btn) {
  console.log("user guessed: " + btn);
  if (!gamePlaying) {
    return;
  }

  // add game logic here
  if (pattern[guessCounter] == btn) {
    if (guessCounter == progress) {
      progress++;
      if (progress < pattern.length) {
        playClueSequence();
      } else {
        winGame();
      }
    } else {
      guessCounter++;
    }
  } else {
    mistakes++;
    document.getElementById("mistakesText").innerHTML = "Mistakes: " + mistakes;
    if (mistakes >= 3) {
      loseGame();
    } 
  }
}
