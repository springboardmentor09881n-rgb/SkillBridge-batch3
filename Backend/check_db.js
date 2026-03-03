const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
    const Opportunity = require('./models/Opportunity');
    const opps = await Opportunity.find({});
    console.log(JSON.stringify(opps, null, 2));
    process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});
