const synth = window.speechSynthesis;

let phrase = "";

const speak = text => {
  if (synth.speaking) {
    console.error("already talking!!");
    return;
  }
  let utterThis = new SpeechSynthesisUtterance(text);
  utterThis.pitch = 2;
  utterThis.rate = 0.2;
  synth.speak(utterThis);
};

document.querySelector("#my-button").onclick = () => {
  console.log("button pressed");
  const textInput = document.querySelector("#text-input").value;
  console.log(textInput);

  let split = textInput.split("");
  split.forEach(letter => {
    console.log(letter);

    switch (letter) {
      case "h":
        phrase += "heh";
        break;

      case "e":
        phrase += "ee";
        break;

      case "l":
        phrase += "luh";
        break;

      case "o":
        phrase += "oh";
        break;
    }
  });

  speak(phrase);
};
