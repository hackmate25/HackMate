import mongoose from "mongoose";
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    profileImage: {
      type: String,
      default: ""
    },

    profileImagePublicId: {
      type: String,
      default: ""
    },

    name: { type: String, required: true, trim: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      immutable: true,
    },

    password: { type: String, required: true },

    age: { type: Number, min: 16, max: 100 },

    phoneNumber: {
      type: Number,
      unique: true,
      sparse: true,
    },

    year: { type: String },
    gender: { type: String },

    bio: { type: String, maxlength: 500 },

    raNumber: {
      type: String,
      match: /^RA\d{13}$/,
      unique: true,
      sparse: true,
    },

    skills: { type: [String], default: [] },
    techStack: { type: [String], default: [] },
    trackPreference: { type: [String], default: [] },

    mostPreferredRole: { type: String },
    mostPreferredDomain: { type: String },

    projects: { type: [String], default: [] },

    hackathonsParticipated: { type: String, default: "" },
    hackathonsWon: { type: String, default: "" },

    github: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    instagram: { type: String, default: "" },

    selectedUsers: {
      type: [Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },

    pendingRequests: {
      type: [Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },

    matches: {
      type: [Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
  },
  { timestamps: true }
);

UserSchema.index({ selectedUsers: 1 });
UserSchema.index({ pendingRequests: 1 });
UserSchema.index({ matches: 1 });

const UserModel = mongoose.model("User", UserSchema);
export default UserModel;
