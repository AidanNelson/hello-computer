/*
2018.09.13
Bueller, Bueller
by Aidan Nelson
for "Hello, Computer" course by Nicole He, Fall 2018 at NYU-ITP
*/

let synth;
let img;
let nameIndex = 1;
let phrase = "";

function preload() {
  synth = window.speechSynthesis;
  img = loadImage("ferrisbueller.png"); // image from Ferris Bueller's Day Off
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  imageMode(CENTER);
  image(img, width / 2, height / 2);

  textSize(36);
  textAlign(CENTER);
  stroke(0);
  strokeWeight(2);
  fill(255, 255, 0);
  text("CLICK ME", width / 2, height / 2);
}

let responses = ["present", "here"];

function mousePressed() {
  if (!synth.speaking) {
    let voices = synth.getVoices();

    if (random(1) > 0.2) {
      speak(voices[nameIndex].name, voices[0], 0.8, 1);
      speak(
        responses[floor(random(responses.length))],
        voices[nameIndex],
        1,
        1
      );
    } else {
      speak("Bueller", voices[0], 0.8, 0.8);
      speak("Bueller", voices[0], 0.8, 0.8, 0);
      speak("Bueller", voices[0], 0.8, 0.8);
      speak("Bueller", voices[0], 0.8, 0.8, 0);
      speak("Bueller", voices[0], 0.8, 0.8);
      speak("Bueller", voices[0], 0.8, 0.8, 0);
      speak("Bueller", voices[0], 0.8, 0.8);
    }
    nameIndex++;

    for (let i = 0; i < 5; i++) {
      if (random(1) < 0.5) {
        text("✋🏽", random(width), random(height));
      } else {
        text("✋🏿", random(width), random(height));
      }
    }
  }
}

const speak = (text, voice, pitch, rate, volume) => {
  let utterance = new SpeechSynthesisUtterance(text);

  utterance.voice = voice;
  utterance.lang = voice.lang;
  utterance.pitch = pitch;
  utterance.rate = rate;
  utterance.volume = volume === undefined ? 1 : 0;

  synth.speak(utterance);
};
