const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const https = require('https');
const fs = require('fs');

const People = require('./models/People');

const app = express();

// Files needed for SSL to use HTTPS
var privateKey = fs.readFileSync("/etc/letsencrypt/live/rootsy.dev/privkey.pem");
var certificate = fs.readFileSync("/etc/letsencrypt/live/rootsy.dev/fullchain.pem");

// Enable All CORS Requests
app.use(cors());

// Middleware
app.use(bodyParser.json());

var uri = "mongodb+srv://robbd56:Ghoulishhule.\"75@cluster0.6dfwv8y.mongodb.net/wheeldata?retryWrites=true&w=majority"

// MongoDB Connection
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define routes and APIs
// If name does exist then add 1 to the total
app.use('/api', require('./routes/api'));

app.get('/', (req, res) => {
  res.send('This is the REST API for Robbie Decker\'s Wheel of Chores apps. \n Go to https://robbie-decker.github.io/Wheel-of-chores/')
})
// Start the server with HTTPS
const PORT = process.env.PORT || 4000;
https.createServer({
    key: privateKey,
    cert: certificate
}, app).listen(PORT, () =>{
	console.log(`listening on ${PORT}`)
});
