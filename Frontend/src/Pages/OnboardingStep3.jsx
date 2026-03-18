import React, { useState, useRef, useEffect } from "react";
import { ArrowLeft, Plus, X, ArrowRight, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../utils/api";

const SUGGESTED_SKILLS = [
  "React", "Node.js", "Python", "Machine Learning", "UI/UX", "DevOps",
  "Blockchain", "Java", "C++", "JavaScript", "TypeScript", "Go", "Rust",
  "Flutter", "Docker", "AWS", "MongoDB", "PostgreSQL", "GraphQL", "Figma",
  "Next.js", "Express.js", "Django", "TensorFlow", "Kubernetes", "Firebase",
  "Swift", "Kotlin", "R", "Data Science"
];

const SUGGESTED_TECH = [
  "React", "Vue.js", "Angular", "Node.js", "Express.js", "Django", "Flask",
  "Spring Boot", "FastAPI", "Next.js", "MongoDB", "PostgreSQL", "MySQL",
  "Redis", "Docker", "Kubernetes", "AWS", "GCP", "Azure", "Firebase",
  "Tailwind CSS", "TypeScript", "GraphQL", "REST API"
];

function SkillDropdown({ suggestions, selected, onAdd, currentValue, onChangeValue, placeholder }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const filtered = suggestions.filter(
    (s) =>
      !selected.includes(s) &&
      s.toLowerCase().includes(currentValue.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="flex flex-wrap gap-2 border border-gray-200 rounded-xl p-3 bg-white/80 focus-within:ring-2 focus-within:ring-blue-300/50 focus-within:border-blue-400 transition-all duration-200">
        {selected.map((skill, i) => (
          <span
            key={i}
            className="bg-blue-500/90 text-white px-3 py-1 rounded-full flex items-center gap-1.5 text-sm shadow-sm hover:bg-blue-600 transition-colors duration-200"
          >
            {skill}
            <X
              size={14}
              className="cursor-pointer hover:text-red-200 transition-colors duration-200"
              onClick={() => onAdd("remove", i)}
            />
          </span>
        ))}
        <div className="flex-1 flex items-center gap-1 min-w-[140px]">
          <input
            value={currentValue}
            onChange={(e) => {
              onChangeValue(e.target.value);
              if (e.target.value.endsWith(",")) {
                onAdd("add", e.target.value.slice(0, -1));
                onChangeValue("");
              }
              if (e.target.value.length > 0) setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            placeholder={selected.length === 0 ? placeholder : "Add more..."}
            className="flex-1 outline-none bg-transparent placeholder-gray-400/70 text-sm"
          />
          <ChevronDown
            size={16}
            className={`text-gray-400 cursor-pointer hover:text-gray-600 transition-all duration-200 ${open ? "rotate-180" : ""}`}
            onClick={() => setOpen(!open)}
          />
        </div>
      </div>

      {/* Dropdown */}
      <div
        className={`absolute left-0 right-0 top-full mt-1 z-20 bg-white/95 backdrop-blur-xl border border-white/30 rounded-xl shadow-2xl overflow-hidden transition-all duration-200 origin-top ${
          open && filtered.length > 0
            ? "opacity-100 scale-y-100 max-h-48"
            : "opacity-0 scale-y-95 max-h-0 pointer-events-none"
        }`}
      >
        <div className="overflow-y-auto max-h-48 py-1">
          {filtered.slice(0, 10).map((skill) => (
            <button
              key={skill}
              type="button"
              onClick={() => {
                onAdd("add", skill);
                onChangeValue("");
              }}
              className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-150 cursor-pointer flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400/60" />
              {skill}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

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

  /* ---------------- IMAGE SELECT -------------- */
  const handleProfileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setProfileFile(file);
    setProfilePreview(URL.createObjectURL(file));
  };

  const handleSkillAction = (action, value) => {
    if (action === "remove") {
      setFormData((prev) => ({
        ...prev,
        skills: prev.skills.filter((_, i) => i !== value),
      }));
    } else if (action === "add" && value.trim()) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, value.trim()],
      }));
    }
  };

  const handleTechAction = (action, value) => {
    if (action === "remove") {
      setFormData((prev) => ({
        ...prev,
        techStack: prev.techStack.filter((_, i) => i !== value),
      }));
    } else if (action === "add" && value.trim()) {
      setFormData((prev) => ({
        ...prev,
        techStack: [...prev.techStack, value.trim()],
      }));
    }
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

      navigate("/discover");
    } catch (err) {
      if (import.meta.env.MODE === 'development') {
        console.error("Step 3 error:", err);
      }
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
        <div className="flex-1 bg-white/70 backdrop-blur-md p-10 rounded-2xl shadow-xl">
          <h1 className="text-3xl font-extrabold text-blue-900 mb-8 text-center">
            Customize Your Profile
          </h1>

          {error && (
            <div className="bg-red-50/90 backdrop-blur-sm border border-red-300 text-red-700 rounded-xl text-sm p-3 mb-6 flex items-center gap-2 shadow-sm">
              <span className="text-red-500 flex-shrink-0">⚠</span>
              <span>{error}</span>
            </div>
          )}

          {/* PROFILE IMAGE */}
          <div className="flex flex-col items-center mb-8">
            <div
              className="w-20 h-20 rounded-full border-4 border-blue-400 flex items-center justify-center overflow-hidden cursor-pointer hover:border-blue-500 transition-colors duration-200 shadow-md"
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
            className="w-full p-3 mb-6 rounded-xl border border-gray-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-300/50 focus:border-blue-400 transition-all duration-200 placeholder-gray-400/80 resize-none"
            rows={3}
          />

          {/* Skills */}
          <div className="mb-6">
            <label className="font-semibold mb-2 block text-gray-700 text-sm tracking-wide">Skills</label>
            <SkillDropdown
              suggestions={SUGGESTED_SKILLS}
              selected={formData.skills}
              onAdd={handleSkillAction}
              currentValue={currentSkill}
              onChangeValue={setCurrentSkill}
              placeholder="Type skill and press comma, or select below"
            />
          </div>

          {/* Tech Stack */}
          <div className="mb-6">
            <label className="font-semibold mb-2 block text-gray-700 text-sm tracking-wide">Tech Stack</label>
            <SkillDropdown
              suggestions={SUGGESTED_TECH}
              selected={formData.techStack}
              onAdd={handleTechAction}
              currentValue={currentTech}
              onChangeValue={setCurrentTech}
              placeholder="Type tech and press comma, or select below"
            />
          </div>

          {/* Social Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              placeholder="GitHub"
              value={formData.github}
              onChange={(e) => setFormData(p => ({ ...p, github: e.target.value }))}
              className="p-3 rounded-xl border border-gray-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-300/50 focus:border-blue-400 transition-all duration-200 placeholder-gray-400/80"
            />
            <input
              placeholder="LinkedIn"
              value={formData.linkedin}
              onChange={(e) => setFormData(p => ({ ...p, linkedin: e.target.value }))}
              className="p-3 rounded-xl border border-gray-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-300/50 focus:border-blue-400 transition-all duration-200 placeholder-gray-400/80"
            />
            <input
              placeholder="Instagram"
              value={formData.instagram}
              onChange={(e) => setFormData(p => ({ ...p, instagram: e.target.value }))}
              className="p-3 rounded-xl border border-gray-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-300/50 focus:border-blue-400 transition-all duration-200 placeholder-gray-400/80 md:col-span-2"
            />
          </div>

          {/* Buttons */}
          <div className="mt-10 flex justify-between">
            <button
              onClick={() => {
                onBack?.(formData);
                navigate("/your-info");
              }}
              className="bg-gray-300 hover:bg-gray-400 px-6 py-2 rounded-xl flex gap-2 cursor-pointer transition-all duration-200 active:scale-[0.97] items-center shadow-sm"
            >
              <ArrowLeft size={18} /> Back
            </button>

            <button
              onClick={handleFinish}
              disabled={loading}
              className={`${
                loading ? "bg-green-300" : "bg-green-500 hover:bg-green-600"
              } text-white px-6 py-2 rounded-xl flex gap-2 cursor-pointer transition-all duration-200 active:scale-[0.97] items-center shadow-md hover:shadow-lg disabled:cursor-not-allowed`}
            >
              {loading ? "Saving..." : <>Next <ArrowRight size={18} /></>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}