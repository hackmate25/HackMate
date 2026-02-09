import mongoose from "mongoose";
const { Schema } = mongoose;

const TagSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true
    },
    type: {
      type: String,
      enum: ["skill", "tech"],
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Tag", TagSchema);