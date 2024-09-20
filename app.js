const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const socketio = require('socket.io');

const server = http.createServer(app);
const io = socketio(server);

// Handle socket.io connection
io.on('connection', function(socket){
    socket.on("send-location", function(data){
        // Broadcast the received location data to all connected clients
        io.emit("receive-location", {id:socket.id, ...data});
        console.log("Received location data:", data);
    });
    console.log("Socket connected");

    // Handle client disconnection
    socket.on('disconnect', function(){
        io.emit("user-disconnected", socket.id);
    });
});

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Correctly serve static files (CSS, JS, images, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Render the homepage
app.get("/", function(req, res){
    res.render("index");
});

// Start the server on port 3000
server.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
