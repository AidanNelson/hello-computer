// Create server
let port = process.env.PORT || 8000;

let express = require("express");
let app = express();
let server = require("http")
  .createServer(app)
  .listen(port, function() {
    console.log("Server listening at port: ", port);
  });

const fetch = require("node-fetch");

// Tell server where to look for files
app.use(express.static("public"));

// Create socket connection
let io = require("socket.io").listen(server);

// HERE API info
const here_app_id = process.env.here_app_id;
const here_app_code = process.env.here_app_code;

// Listen for individual clients to connect
io.sockets.on(
  "connection",
  // Callback function on connection
  // Comes back with a socket object
  function(socket) {
    console.log("We have a new client: " + socket.id);

    // Listen for data from this client
    socket.on("placeName", function(data) {
      // Data can be numbers, strings, objects
      console.log("Received: 'data' " + data);

      let url = `https://geocoder.api.here.com/6.2/geocode.json?searchtext=${data}&app_id=${here_app_id}&app_code=${here_app_code}`;
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
          socket.emit("location", { lat: latitude, lng: longitude });
        });

      // Send it to all clients, including this one
      // io.sockets.emit("data", data);

      // Send it to all other clients, not including this one
      //socket.broadcast.emit('data', data);

      // Send it just this client
      // socket.emit('data', data);
    });

    // Listen for this client to disconnect
    socket.on("disconnect", function() {
      console.log("Client has disconnected " + socket.id);
    });
  }
);
