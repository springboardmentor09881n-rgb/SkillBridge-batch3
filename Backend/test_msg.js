const mongoose = require("mongoose");
require("dotenv").config();
const User = require("./models/User");
const Message = require("./models/Message");

async function test() {
  await mongoose.connect(process.env.MONGO_URI, { family: 4 });
  
  const org = new User({
    userName: "test_org_" + Date.now(),
    email: "org" + Date.now() + "@test.com",
    password: "pwd",
    fullName: "Org Name",
    userType: "organization"
  });
  await org.save();

  const vol = new User({
    userName: "test_vol_" + Date.now(),
    email: "vol" + Date.now() + "@test.com",
    password: "pwd",
    fullName: "Vol Name",
    userType: "volunteer"
  });
  await vol.save();

  try {
    const res = await fetch("http://localhost:5000/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        senderId: vol._id,
        receiverId: org._id,
        content: "Hello! Testing POST message"
      })
    });
    const data = await res.json();
    console.log("POST /api/messages Output:", res.status, data);

    const convRes = await fetch("http://localhost:5000/api/messages/conversations/" + vol._id);
    const convData = await convRes.json();
    console.log("GET Conversations Output:", convRes.status, JSON.stringify(convData).substring(0, 200));

  } catch (err) {
    console.error("Fetch failed:", err);
  }
  
  process.exit();
}

test();
