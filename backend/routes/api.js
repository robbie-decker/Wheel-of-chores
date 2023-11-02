const express = require('express');
const router = express.Router();
const People = require('../models/People');


// Just get the specified document in the DB based of a name
router.get('/name', async (req, res) => {
    // This is mainly a dev function
    try {
      const { name } = req.query;
      const data = await People.find({'name': 'dfds'})
      res.status(201).json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

// Increment the total if name exists, if not create it and set its total to 1
router.post('/name_increment', async (req, res) => {
  try {
    const { name } = req.body; // Get picked name given
    // Check if name exists
    const document = await People.findOne({'name': name});
    if(document){
      // Name exists so find and increment
      const updatedDocument = await People.findOneAndUpdate({'name': name}, {$inc: {'total': 1}}, {new: true})
      res.status(200).json(updatedDocument);
    }
    // Document does not exist so create it and put it in the DB.
    // Make sure total is set to 1 now.
    else{
      const newPerson = new People({
        name: name,
        total: 1 
      })
      await newPerson.save();
      res.status(200).json(newPerson);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;

