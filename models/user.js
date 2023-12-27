const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { type: String, required: true },
  name: { type: String, required: true },
  password: { type: String, required: true, maxLength: 60 },
  membershipStatus: { type: Boolean, required: true },
  admin: { type: Boolean, required: true },
});

module.exports = mongoose.model("User", UserSchema);
