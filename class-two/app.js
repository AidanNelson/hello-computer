let giphyAPIKey = "GIPHY_API_KEY";

const SpeechRecognition = webkitSpeechRecognition;

const getSpeech = () => {
  const recognition = new SpeechRecognition();
  recognition.lang = "en-US";

  recognition.start();
  console.log("started recognition");

  recognition.onresult = event => {
    const speechResult = event.results[0][0].transcript;
    console.log("result: ", speechResult);
    console.log("event: ", event);
    document.querySelector("#textBubble").textContent = speechResult;
    getGif(speechResult);
  };

  recognition.onend = () => {
    recognition.stop();
    console.log("speech recognition event over");
    recognition.start();
  };

  recognition.onerror = event => {
    console.error("something went wrong! ", event.error);
  };
};

const getGif = phrase => {
  //note use of back-tics and in-line phrase
  //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
  let url = `http://api.giphy.com/v1/gifs/translate?api_key=${giphyAPIKey}&tag=${phrase}`;
  console.log(url);
  fetch(url, { mode: "cors" })
    .then(response => response.json())
    .then(result => {
      let imgUrl = result.data.image_url;
      document.querySelector("#gifBox").src = imgUrl;
    });
};
// getSpeech();

document.querySelector("#speechButton").onclick = () => {
  getSpeech();
};
