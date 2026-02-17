const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  userName: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: { type: String, required: true },
  userType: { type: String, enum: ['volunteer', 'organization'], default: 'volunteer' },
  // Optional fields for Organizations
  organizationName: { type: String },
  organizationDescription: { type: String },
  location: { type: String },
  skills: { type: String }
});

module.exports = mongoose.model('User', UserSchema);