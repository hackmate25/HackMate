import mongoose from "mongoose";
const { Schema } = mongoose;

const MessageSchema = new Schema({
  sender: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  text: {
    type: String,
    maxlength: 500,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const ChatSchema = new Schema(
  {
    participants: {
      type: [Schema.Types.ObjectId],
      ref: "User",
      required: true,
      validate: v => v.length === 2
    },

    messages: {
      type: [MessageSchema],
      default: []
    },

    messageLimit: {
      type: Number,
      default: 40
    },

    isLocked: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

const ChatModel = mongoose.model("Chat", ChatSchema);
export default ChatModel;