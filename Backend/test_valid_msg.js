const mongoose = require("mongoose");
require("dotenv").config();
const User = require("./models/User");
const Message = require("./models/Message");

async function check() {
  await mongoose.connect(process.env.MONGO_URI, { family: 4 });
  const users = await User.find().limit(2);
  if (users.length < 2) { console.log('not enough users'); process.exit(); }
  console.log("User 1:", users[0]._id, "User 2:", users[1]._id);
  
  try {
    const res = await fetch("http://localhost:5000/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            senderId: users[0]._id,
            receiverId: users[1]._id,
            content: "Test message from CLI"
        })
    });
    console.log("POST STATUS:", res.status);
    const body = await res.json();
    console.log("BODY", body);
  } catch(e) { console.error(e); }
  process.exit();
}
check();
