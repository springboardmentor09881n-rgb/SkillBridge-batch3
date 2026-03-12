const express = require('express');
const router = express.Router();
const Application = require('../models/Application');

// Apply for an opportunity
router.post('/', async (req, res) => {
    try {
        const { opportunityId, volunteerId } = req.body;

        // Check if already applied
        const existingApplication = await Application.findOne({ opportunityId, volunteerId });
        if (existingApplication) {
            return res.status(400).json({ message: 'You have already applied for this opportunity.' });
        }

        const newApplication = new Application({
            opportunityId,
            volunteerId
        });

        const savedApplication = await newApplication.save();
        res.status(201).json(savedApplication);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get applications for a volunteer
router.get('/volunteer/:userId', async (req, res) => {
    try {
        const applications = await Application.find({ volunteerId: req.params.userId }).populate('opportunityId');
        res.json(applications);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get applications for an opportunity
router.get('/opportunity/:opportunityId', async (req, res) => {
    try {
        const applications = await Application.find({ opportunityId: req.params.opportunityId }).populate('volunteerId', 'fullName email userType');
        res.json(applications);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
