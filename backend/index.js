const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

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
  // People.find({'name': 'Robbie'}).then((data) => {
  //   console.log(data);
  // });
  const agg = [
    {
      '$group': {
        '_id': null, 
        'totalamount': {
          '$sum': '$total'
        }
      }
    }
  ];
  People.aggregate(agg).then((data) => {
    console.log(data);
  })
  

});

// Define routes and APIs
// Example:
// app.use('/api', require('./routes/api'));

// Course Modal Schema 
const wheelSchema = new mongoose.Schema({ 
  _id: Number, 
  name: String, 
  total: Number 
}, {collection:'people'}); 
  
const People = mongoose.model('people', wheelSchema);
app.get('/', (req, res) => {
  res.send('Hi World!')
})

// TODO: GET document based off of name value
// If name does exist then add 1 to the total
// People.findOneAndUpdate({'name': '<name>'}, {$inc: {'total': 1}}, {new: true}).then((data) => {
//   console.log(data);
// });

// TODO: Then query the collection to sum the total number of spins for each person
// const agg = [
//   {
//     '$group': {
//       '_id': null, 
//       'totalamount': {
//         '$sum': '$total'
//       }
//     }
//   }
// ];
// People.aggregate(agg).then((data) => {
//   console.log(data);
// })

// If name does not exist...
// TODO: POST document with name set to name and total set to 0



// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



// Finds person and updates total by 1
// people.findAndModify({
//   query: { 'name': <name> },
//   update: { $inc: { total: 1 } },
//   new: true,
// })
// People.findOneAndUpdate({'name': 'Robbie'}, {$inc: {'total': 1}}, {new: true}).then((data) => {
//   console.log(data);
// });

