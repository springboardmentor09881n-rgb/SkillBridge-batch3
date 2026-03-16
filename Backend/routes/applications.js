const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const Opportunity = require('../models/Opportunity');

// Get all applications
router.get('/', async (req, res) => {
    try {
        const applications = await Application.find()
            .populate('volunteerId', 'fullName email userType')
            .populate('opportunityId', 'title organizationId')
            .sort({ dateApplied: -1 });

        res.json(applications);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

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

// Get all applications for an organization (across all its opportunities)
router.get('/organization/:organizationId', async (req, res) => {
    try {
        const opportunities = await Opportunity.find({ organizationId: req.params.organizationId }).select('_id');
        const opportunityIds = opportunities.map((opp) => opp._id);

        if (opportunityIds.length === 0) {
            return res.json([]);
        }

        const applications = await Application.find({ opportunityId: { $in: opportunityIds } })
            .populate('volunteerId', 'fullName email userType')
            .populate('opportunityId', 'title organizationId')
            .sort({ dateApplied: -1 });

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

// Update application status
router.patch('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const allowedStatuses = ['Pending', 'Accepted', 'Rejected'];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status value.' });
        }

        const updatedApplication = await Application.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        )
            .populate('volunteerId', 'fullName email userType')
            .populate('opportunityId', 'title organizationId');

        if (!updatedApplication) {
            return res.status(404).json({ message: 'Application not found.' });
        }

        res.json(updatedApplication);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
