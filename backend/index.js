const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

// Middleware
app.use(bodyParser.json());

var uri = "mongodb+srv://robbd56:Ghoulishhule.\"75@cluster0.6dfwv8y.mongodb.net/?retryWrites=true&w=majority"

// MongoDB Connection
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
  console.log(Wheel.find());
});

// Define routes and APIs
// Example:
// app.use('/api', require('./routes/api'));

// Course Modal Schema 
const wheelSchema = new mongoose.Schema({ 
  _id: Number, 
  name: String, 
  total: Number 
}); 
  
const Wheel = mongoose.model('wheel', wheelSchema);

app.get('/', (req, res) => {
  res.send('Hi World!')
})


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
