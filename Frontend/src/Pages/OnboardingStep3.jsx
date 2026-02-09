import React, { useState, useRef } from "react";
import { ArrowLeft, Plus, X, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../utils/api";

export default function OnboardingStep3({ onBack }) {
  const [progress] = useState(50);
  const navigate = useNavigate();

  const [profileFile, setProfileFile] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    bio: "",
    skills: [],
    techStack: [],
    github: "",
    linkedin: "",
    instagram: "",
  });

  const [currentSkill, setCurrentSkill] = useState("");
  const [currentTech, setCurrentTech] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ---------------- IMAGE SELECT ---------------- */
  const handleProfileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setProfileFile(file);
    setProfilePreview(URL.createObjectURL(file));
  };

  const handleAddTag = (type, value) => {
    if (!value.trim()) return;
    setFormData((prev) => ({
      ...prev,
      [type]: [...prev[type], value.trim()],
    }));
    type === "skills" ? setCurrentSkill("") : setCurrentTech("");
  };

  const handleRemoveTag = (type, index) => {
    setFormData((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));
  };

  /* ---------------- FINAL SUBMIT ---------------- */
  const handleFinish = async () => {
    setLoading(true);
    setError("");

    try {
      // 1️⃣ UPDATE TEXT PROFILE
      const res = await apiFetch("/profile/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Profile update failed");
      }

      // 2️⃣ UPLOAD PROFILE IMAGE
      if (profileFile) {
        const formDataImg = new FormData();
        formDataImg.append("image", profileFile);

        const imgRes = await apiFetch("/profile/upload-image", {
          method: "POST",
          body: formDataImg,
        });

        const imgData = await imgRes.json();
        if (!imgRes.ok) {
          throw new Error(imgData.message || "Image upload failed");
        }
      }

      navigate("/confirmDetails");
    } catch (err) {
      console.error("❌ Step 3 error:", err);
      setError(err.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 font-sans">
      {/* Progress Bar */}
      <div className="w-3/4 mt-10 mb-10">
        <div className="h-2 bg-blue-300 rounded-full overflow-hidden">
          <div
            className="h-2 bg-blue-700 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row w-3/4">
        {/* Left */}
        <div className="bg-blue-800 text-white p-10 rounded-2xl flex items-center justify-center md:w-1/3 mb-6 md:mb-0 md:mr-6">
          <h2 className="text-2xl font-bold tracking-widest md:-rotate-90">
            BUILD YOUR PROFILE
          </h2>
        </div>

        {/* Right */}
        <div className="flex-1 bg-white/70 backdrop-blur-md p-10 rounded-2xl shadow-lg">
          <h1 className="text-3xl font-extrabold text-blue-900 mb-8 text-center">
            Customize Your Profile
          </h1>

          {error && <p className="text-red-600 text-center mb-4">{error}</p>}

          {/* PROFILE IMAGE */}
          <div className="flex flex-col items-center mb-8">
            <div
              className="w-20 h-20 rounded-full border-4 border-blue-400 flex items-center justify-center overflow-hidden cursor-pointer"
              onClick={() => fileInputRef.current.click()}
            >
              {profilePreview ? (
                <img src={profilePreview} className="w-full h-full object-cover" />
              ) : (
                <Plus size={36} className="text-blue-600" />
              )}
            </div>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleProfileUpload}
              className="hidden"
            />
          </div>

          {/* Bio */}
          <textarea
            value={formData.bio}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, bio: e.target.value }))
            }
            placeholder="Write a short bio..."
            className="w-full p-3 mb-6 rounded-xl border"
          />

          {/* Skills */}
          <div className="mb-6">
            <label className="font-semibold mb-2 block">Skills</label>
            <div className="flex flex-wrap gap-2 border rounded-xl p-3">
              {formData.skills.map((skill, i) => (
                <span
                  key={i}
                  className="bg-blue-500 text-white px-3 py-1 rounded-full flex gap-2"
                >
                  {skill}
                  <X size={14} onClick={() => handleRemoveTag("skills", i)} />
                </span>
              ))}
              <input
                value={currentSkill}
                onChange={(e) => {
                  setCurrentSkill(e.target.value);
                  if (e.target.value.endsWith(",")) {
                    handleAddTag("skills", e.target.value.slice(0, -1));
                  }
                }}
                placeholder="Type skill and press comma"
                className="flex-1 outline-none"
              />
            </div>
          </div>

          {/* Tech Stack */}
          <div className="mb-6">
            <label className="font-semibold mb-2 block">Tech Stack</label>
            <div className="flex flex-wrap gap-2 border rounded-xl p-3">
              {formData.techStack.map((tech, i) => (
                <span
                  key={i}
                  className="bg-blue-500 text-white px-3 py-1 rounded-full flex gap-2"
                >
                  {tech}
                  <X size={14} onClick={() => handleRemoveTag("techStack", i)} />
                </span>
              ))}
              <input
                value={currentTech}
                onChange={(e) => {
                  setCurrentTech(e.target.value);
                  if (e.target.value.endsWith(",")) {
                    handleAddTag("techStack", e.target.value.slice(0, -1));
                  }
                }}
                placeholder="Type tech and press comma"
                className="flex-1 outline-none"
              />
            </div>
          </div>

          {/* Social Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              placeholder="GitHub"
              value={formData.github}
              onChange={(e) => setFormData(p => ({ ...p, github: e.target.value }))}
              className="p-3 rounded-xl border"
            />
            <input
              placeholder="LinkedIn"
              value={formData.linkedin}
              onChange={(e) => setFormData(p => ({ ...p, linkedin: e.target.value }))}
              className="p-3 rounded-xl border"
            />
            <input
              placeholder="Instagram"
              value={formData.instagram}
              onChange={(e) => setFormData(p => ({ ...p, instagram: e.target.value }))}
              className="p-3 rounded-xl border md:col-span-2"
            />
          </div>

          {/* Buttons */}
          <div className="mt-10 flex justify-between">
            <button
              onClick={() => {
                onBack?.(formData);
                navigate("/your-info");
              }}
              className="bg-gray-300 px-6 py-2 rounded-xl flex gap-2"
            >
              <ArrowLeft size={18} /> Back
            </button>

            <button
              onClick={handleFinish}
              disabled={loading}
              className={`${
                loading ? "bg-green-300" : "bg-green-500 hover:bg-green-600"
              } text-white px-6 py-2 rounded-xl flex gap-2`}
            >
              {loading ? "Saving..." : <>Next <ArrowRight size={18} /></>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}