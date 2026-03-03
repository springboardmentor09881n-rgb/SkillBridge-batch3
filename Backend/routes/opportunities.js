const express = require('express');
const router = express.Router();
const Opportunity = require('../models/Opportunity');

// Get all opportunities for a specific NGO
router.get('/ngo/:ngoId', async (req, res) => {
    try {
        const opportunities = await Opportunity.find({ organizationId: req.params.ngoId }).sort({ createdAt: -1 });
        res.json(opportunities);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new opportunity
router.post('/', async (req, res) => {
    try {
        const { title, description, organizationId, location, skillsRequired, duration, status } = req.body;

        const newOpportunity = new Opportunity({
            title,
            description,
            organizationId,
            location,
            skillsRequired,
            duration,
            status
        });

        const savedOpportunity = await newOpportunity.save();
        res.status(201).json(savedOpportunity);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});// Update an opportunity
router.put('/:id', async (req, res) => {
    try {
        const { title, description, location, skillsRequired, duration, status } = req.body;
        const updatedOpportunity = await Opportunity.findByIdAndUpdate(
            req.params.id,
            { title, description, location, skillsRequired, duration, status },
            { new: true }
        );
        res.json(updatedOpportunity);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete an opportunity
router.delete('/:id', async (req, res) => {
    try {
        await Opportunity.findByIdAndDelete(req.params.id);
        res.json({ message: 'Opportunity deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
