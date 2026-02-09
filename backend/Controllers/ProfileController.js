import UserModel from "../Modules/User.js";
import cloudinary from "../utils/cloudinary.js";
import streamifier from "streamifier";

// Get logged-in user profile
const getProfile = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await UserModel.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, profile: user });
  } catch (err) {
    console.error("GET PROFILE ERROR:", err);
    res.status(500).json({ success: false, message: "Error fetching profile" });
  }
};

// Update profile
const updateProfile = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const allowedFields = [
      "name",
      "age",
      "phoneNumber",
      "year",
      "gender",
      "raNumber",
      "bio",
      "skills",
      "techStack",
      "trackPreference",
      "github",
      "linkedin",
      "instagram",
    ];

    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const user = await UserModel.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.json({
      success: true,
      message: "Profile updated successfully",
      profile: user,
    });
  } catch (err) {
    console.error("❌ UPDATE PROFILE ERROR:", err);

    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Duplicate email / phone / RA number",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ---------------- UPLOAD PROFILE IMAGE ----------------
const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image uploaded",
      });
    }

    const user = await UserModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 🔥 DELETE OLD IMAGE (if exists)
    if (user.profileImagePublicId) {
      await cloudinary.v2.uploader.destroy(user.profileImagePublicId);
    }

    // 🔥 STREAM UPLOAD (FAST & SAFE)
    const uploadFromBuffer = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.v2.uploader.upload_stream(
          {
            folder: "hackmate/profile-images",
            transformation: [
              { width: 400, height: 400, crop: "fill" },
              { quality: "auto" },
            ],
          },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );

        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });

    const result = await uploadFromBuffer();

    user.profileImage = result.secure_url;
    user.profileImagePublicId = result.public_id;

    await user.save();

    return res.json({
      success: true,
      message: "Profile image uploaded successfully",
      profileImage: result.secure_url,
    });
  } catch (err) {
    console.error("❌ IMAGE UPLOAD ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Image upload failed",
    });
  }
};

export { getProfile, updateProfile, uploadProfileImage };