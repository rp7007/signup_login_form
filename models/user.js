const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },  
  password: {
    type: String,
    required: true
  }, 
  educationLevel:{
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  countryCode: {
    type: String,
    required: true
  },
  mobileNumber: {
    type: String,
    required: true
  } 
});

const User = mongoose.model('User', userSchema);

module.exports = User;
