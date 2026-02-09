import React, { useState } from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function OnboardingStep1({ onNext, onBack }) {
  const [progress, setProgress] = useState(20);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 font-sans">
      {/* Progress Bar */}
      <div className="w-3/4 -mt-15 mb-15">
        <div className="h-2 bg-blue-300 rounded-full overflow-hidden">
          <div
            className="h-2 bg-blue-700 transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-col md:flex-row w-3/4">
        {/* Left panel */}
        <div className="bg-blue-800 text-white p-10 rounded-2xl flex items-center justify-center md:w-1/3 mb-6 md:mb-0 md:mr-6">
          <h2 className="text-2xl font-bold tracking-widest whitespace-nowrap">
            Let's Know You More!
          </h2>
        </div>

        {/* Right panel */}
        <div className="flex-1 bg-white/70 backdrop-blur-md p-10 rounded-2xl shadow-lg text-center">
          <h1 className="text-3xl font-extrabold text-blue-900 mb-6">
            Upload Your Info
          </h1>
          <p className="text-gray-700 mb-8">
            Get started by uploading your resume or adding details manually to
            personalize your HackMate experience.
          </p>

          <div className="flex flex-col gap-4">
            <button className="bg-blue-400 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl transition-all duration-200">
              Upload Using Resume
            </button>
            <button
              className="bg-blue-400 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
              onClick={() => {
                setProgress(40);
                onNext?.();
                navigate("/your-info");
              }}
            >
              Add Details Manually <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Back Button */}
          <div className="mt-8">
            <button
              onClick={() => {
                navigate('/get-started') // Go back if no handler is passed
              }}
              className="flex items-center justify-center gap-2 text-gray-800 bg-gray-300 hover:bg-gray-400 font-bold py-2 px-4 border border-blue-400 rounded-xl  transition-all duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
