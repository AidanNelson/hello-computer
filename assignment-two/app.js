window.onload = function() {
  getSpeech();
};
// HERE API info
const here_app_id = "YOUR_APP_ID";
const here_app_code = "YOUD_APP_CODE";

// Speech Recognition Object
const SpeechRecognition = webkitSpeechRecognition;

// Mappa.js Info
let mapboxgl_key =
  "pk.eyJ1Ijoid29vZGVud2Fnb24iLCJhIjoiY2pjbnFhcmcxMWx4ZjJ4cndtZnN1enhhdSJ9.EtWKqHYkn0lOpoxK1BCI1Q";
const mappa = new Mappa("MapboxGL", mapboxgl_key);
let canvas, myMap;

let currentStyleIndex = 2;
let styleList = [
  // "mapbox://styles/mapbox/streets-v10",
  // "mapbox://styles/mapbox/outdoors-v10",
  "mapbox://styles/mapbox/light-v9",
  "mapbox://styles/mapbox/dark-v9",
  "mapbox://styles/mapbox/satellite-v9",
  "mapbox://styles/mapbox/satellite-streets-v10"
  // "mapbox://styles/mapbox/navigation-preview-day-v4",
  // "mapbox://styles/mapbox/navigation-preview-night-v4",
  // "mapbox://styles/mapbox/navigation-guidance-day-v4",
  // "mapbox://styles/mapbox/navigation-guidance-night-v4"
];

// Map options
let options = {
  lat: 40.782,
  lng: -73.967,
  zoom: 12,
  style: styleList[currentStyleIndex]
};

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  // Create a tile map and overlay the canvas on top.
  myMap = mappa.tileMap(options);
  myMap.overlay(canvas);

  // myMap.onChange(drawPoints);
}

// Activate SpeechRecognition Object
const getSpeech = () => {
  const recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.start();
  recognition.continuous = true;
  recognition.interimResults = true;

  console.log("started recognition");

  recognition.onresult = event => {
    const speechResult = event.results[0][0].transcript;
    console.log("result: " + speechResult);
    console.log("confidence: " + event.results[0][0].confidence);
    dealWithIt(speechResult);
  };

  recognition.onend = () => {
    console.log("recognition over");
    // for "endless" mode, comment out the next line and uncomment getSpeech()
    // recognition.stop();
    getSpeech();
  };

  recognition.onerror = event => {
    console.log("something went wrong: " + event.error);
  };
};

const dealWithIt = result => {
  result = result.toLowerCase();
  let words = result.split(" ");
  let deltaDistance = 250;
  console.log(words);

  switch (words[0]) {
    case "buildings":
      addBuildings();
    case "style":
      console.log("styleIndex:", currentStyleIndex);
      currentStyleIndex =
        currentStyleIndex < styleList.length ? currentStyleIndex + 1 : 0;
      myMap.map.setStyle(styleList[currentStyleIndex]);
      break;
    case "zoom":
      let currentZoom = myMap.map.getZoom();
      let deltaZoom = 0;
      for (let i = 1; i < words.length; i++) {
        if (words[i] == "in") {
          console.log("zooming in");
          deltaZoom += 1;
        }
        if (words[i] == "out") {
          console.log("zooming out");
          deltaZoom -= 1;
        }
      }
      myMap.map.zoomTo(currentZoom + deltaZoom, { duration: 1000 });
      break;
    case "step":
      let xDist = 0,
        yDist = 0;
      for (let i = 1; i < words.length; i++) {
        if (words[i] == "left") {
          console.log("moving left");
          xDist -= 250;
        }
        if (words[i] == "right") {
          console.log("moving right");
          xDist += 250;
        }
        if (words[i] == "up") {
          console.log("moving up");
          yDist -= 250;
        }
        if (words[i] == "down") {
          console.log("moving down");
          yDist += 250;
        }
      }
      myMap.map.panBy([xDist, yDist], {
        easing: easing
      });
      break;
    default:
      console.log("jumping to ", result);
      setLocation(result);
  }
};
// https://www.mapbox.com/mapbox-gl-js/example/game-controls/
function easing(t) {
  return t * (2 - t);
}

const addBuildings = () => {
  //https://www.mapbox.com/mapbox-gl-js/example/3d-buildings/
  // Insert the layer beneath any symbol layer.
  var layers = myMap.map.getStyle().layers;

  var labelLayerId;
  for (var i = 0; i < layers.length; i++) {
    if (layers[i].type === "symbol" && layers[i].layout["text-field"]) {
      labelLayerId = layers[i].id;
      break;
    }
  }
  myMap.map.addLayer(
    {
      id: "3d-buildings",
      source: "composite",
      "source-layer": "building",
      filter: ["==", "extrude", "true"],
      type: "fill-extrusion",
      minzoom: 15,
      paint: {
        "fill-extrusion-color": "#aaa",

        // use an 'interpolate' expression to add a smooth transition effect to the
        // buildings as the user zooms in
        "fill-extrusion-height": [
          "interpolate",
          ["linear"],
          ["zoom"],
          15,
          0,
          15.05,
          ["get", "height"]
        ],
        "fill-extrusion-base": [
          "interpolate",
          ["linear"],
          ["zoom"],
          15,
          0,
          15.05,
          ["get", "min_height"]
        ],
        "fill-extrusion-opacity": 0.6
      }
    },
    labelLayerId
  );
};
// Query HERE API for lat/lng
const setLocation = locationQuery => {
  let url = `https://geocoder.api.here.com/6.2/geocode.json?searchtext=${locationQuery}&app_id=${here_app_id}&app_code=${here_app_code}`;
  console.log(url);

  fetch(url, {
    mode: "cors"
  })
    .then(response => response.json())
    .then(result => {
      let latlng =
        result.Response.View[0].Result[0].Location.NavigationPosition[0];
      let latitude = latlng.Latitude;
      let longitude = latlng.Longitude;
      myMap.map.setCenter({ lat: latitude, lng: longitude });
      // console.log(latitude, '/',longitude);
      // let imgUrl = result.data.image_url;
      // document.querySelector('#the-gif').src = imgUrl;
    });
};

// document.querySelector('#sendSpeechButton').onclick = () => {
//   console.log('clickity');
//   getSpeech();
// };
