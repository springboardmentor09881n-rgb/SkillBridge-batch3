const express = require('express');
const router = express.Router();
const Opportunity = require('../models/Opportunity');
const User = require('../models/User'); // Import User for matching
// Get all opportunities (for volunteers)
router.get('/', async (req, res) => {
    try {
        const opportunities = await Opportunity.find().sort({ createdAt: -1 });
        res.json(opportunities);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get all opportunities for a specific NGO
router.get('/ngo/:ngoId', async (req, res) => {
    try {
        const opportunities = await Opportunity.find({ organizationId: req.params.ngoId }).sort({ createdAt: -1 });
        res.json(opportunities);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Match opportunities for a volunteer based on skills and location
router.get('/matches/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user || user.userType !== 'volunteer') return res.status(404).json({ message: "Volunteer not found" });

        const userSkills = user.skills ? user.skills.split(',').map(s => s.trim().toLowerCase()) : [];
        const userLoc = user.location ? user.location.toLowerCase() : "";

        const allOpportunities = await Opportunity.find({ status: { $in: ['Open', 'active'] } });
        
        let matches = allOpportunities.map(opp => {
            let score = 0;
            // Match location
            if (userLoc && opp.location && opp.location.toLowerCase() === userLoc) {
                score += 10;
            }
            // Match skills
            const oppSkills = opp.skillsRequired.map(s => s.toLowerCase());
            const matchedSkills = userSkills.filter(skill => oppSkills.includes(skill));
            score += matchedSkills.length * 5;
            
            return { opportunity: opp, score, matchedSkills };
        });

        // Filter out 0 score and sort by score descending
        matches = matches.filter(m => m.score > 0).sort((a, b) => b.score - a.score);
        
        // Return mostly full opportunity objects 
        res.json(matches.map(m => ({ ...m.opportunity.toObject(), matchScore: m.score, matchedSkills: m.matchedSkills })));
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Match volunteers for a specific opportunity
router.get('/matches/organization/:opportunityId', async (req, res) => {
    try {
        const opp = await Opportunity.findById(req.params.opportunityId);
        if (!opp) return res.status(404).json({ message: "Opportunity not found" });

        const oppSkills = opp.skillsRequired.map(s => s.toLowerCase());
        const oppLoc = opp.location ? opp.location.toLowerCase() : "";

        const allVolunteers = await User.find({ userType: 'volunteer' });
        
        let matches = allVolunteers.map(vol => {
            let score = 0;
            // Match location
            const volLoc = vol.location ? vol.location.toLowerCase() : "";
            if (oppLoc && volLoc && volLoc === oppLoc) {
                score += 10;
            }
            // Match skills
            const volSkills = vol.skills ? vol.skills.split(',').map(s => s.trim().toLowerCase()) : [];
            const matchedSkills = volSkills.filter(skill => oppSkills.includes(skill));
            score += matchedSkills.length * 5;
            
            return { volunteer: vol, score, matchedSkills };
        });

        // Filter out 0 score and sort by score descending
        matches = matches.filter(m => m.score > 0).sort((a, b) => b.score - a.score);
        
        res.json(matches.map(m => ({ 
            id: m.volunteer._id, 
            fullName: m.volunteer.fullName,
            email: m.volunteer.email,
            location: m.volunteer.location,
            skills: m.volunteer.skills,
            matchScore: m.score, 
            matchedSkills: m.matchedSkills 
        })));
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
