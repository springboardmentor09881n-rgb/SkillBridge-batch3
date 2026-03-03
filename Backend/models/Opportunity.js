const mongoose = require('mongoose');

const OpportunitySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  // This links the opportunity to the specific NGO that created it
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  location: { type: String },
  duration: { type: String },
  skillsRequired: [{ type: String }], // Array of skills
  status: { type: String, enum: ['Open', 'Closed', 'Draft', 'active', 'closed'], default: 'Open' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Opportunity', OpportunitySchema);