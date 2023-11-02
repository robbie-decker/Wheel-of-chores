const express = require('express');
const router = express.Router();
const People = require('../models/People');



router.post('/name', async (req, res) => {
    // Get a 
    try {
        console.log(req.body);
    //   const newItem = new YourModel(req.body);
    //   await newItem.save();
    //   res.status(201).json(newItem);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });


module.exports = router;
