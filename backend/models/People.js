const mongoose = require('mongoose');

// Wheel Modal Schema 
const wheelSchema = new mongoose.Schema({ 
    name: String, 
    total: Number 
  }, {collection:'people'}); 
    
const People = mongoose.model('people', wheelSchema);

module.exports = People;