const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const People = require('./models/People');

const app = express();

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
  const topNumber = 
      [
        {
            '$sort': {
                'total': -1
            }
        }, {
            '$limit': 5
        }
    ]
    People.aggregate(topNumber).then((data) =>{
      console.log(data);
    })
});

// Define routes and APIs
// If name does exist then add 1 to the total
app.use('/api', require('./routes/api'));

app.get('/', (req, res) => {
  res.send('Hi World!')
})
// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});