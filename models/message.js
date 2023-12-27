const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  title: { type: String },
  text: { type: String },
  timestamp: { type: String },
  user: { type: Schema.Types.ObjectID, ref: "User", required: true },
});

MessageSchema.virtual("url").get(function () {
  return `/message/${this.id}`
})

module.exports = mongoose.model("Message", MessageSchema);
