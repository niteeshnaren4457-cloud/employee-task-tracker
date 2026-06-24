const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },

  desc: {
    type: String
  },

  assignee: {
    type: String,
    required: true
  },

  priority: {
    type: String,
    enum: ["Low", "Medium", "High"],
    default: "Low"
  },

  due: {
    type: String
  },

  status: {
    type: String,
    enum: ["todo", "inprogress", "done"],
    default: "todo"
  },

  createdAt: {
    type: Number,
    default: Date.now
  }
});

module.exports = mongoose.model("Task", taskSchema);