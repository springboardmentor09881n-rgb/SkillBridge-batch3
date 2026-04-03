const mongoose = require("mongoose");
require("dotenv").config();
const Message = require("./models/Message");

async function test() {
  await mongoose.connect(process.env.MONGO_URI, { family: 4 });
  try {
    const msg = new Message({
      senderId: new mongoose.Types.ObjectId().toString(),
      receiverId: "invalid_id_string_test",
      content: "Hello"
    });
    await msg.save();
  } catch(e) {
    require('fs').writeFileSync('err.log', e.message);
  }
  process.exit();
}
test();
