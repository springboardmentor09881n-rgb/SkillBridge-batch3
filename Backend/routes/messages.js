const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const User = require('../models/User');

// Get message history for a specific conversation (between current user and selected user)
router.get('/:userId/:otherId', async (req, res) => {
    try {
        const { userId, otherId } = req.params;
        const messages = await Message.find({
            $or: [
                { senderId: userId, receiverId: otherId },
                { senderId: otherId, receiverId: userId }
            ]
        }).sort({ createdAt: 1 });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Post a new message
router.post('/', async (req, res) => {
    try {
        const { senderId, receiverId, content } = req.body;
        const msg = new Message({ senderId, receiverId, content });
        await msg.save();
        res.status(201).json(msg);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get conversations (latest message with each user)
router.get('/conversations/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const messages = await Message.find({
            $or: [{ senderId: userId }, { receiverId: userId }]
        }).populate('senderId', 'userName fullName organizationName').populate('receiverId', 'userName fullName organizationName').sort({ createdAt: -1 });
        
        // Extract unique conversations
        const conversationsMap = new Map();
        
        messages.forEach(msg => {
            // Null-check safeguard for deleted users / orphaned messages
            if (!msg.senderId || !msg.receiverId || !msg.senderId._id || !msg.receiverId._id) {
                return;
            }

            // Find the ID of the 'other' person in the message
            const otherPerson = msg.senderId._id.toString() === userId 
                                ? msg.receiverId 
                                : msg.senderId;
                                
            if (!conversationsMap.has(otherPerson._id.toString())) {
                conversationsMap.set(otherPerson._id.toString(), {
                    otherUser: otherPerson,
                    latestMessage: msg
                });
            }
        });
        
        res.json(Array.from(conversationsMap.values()));
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
