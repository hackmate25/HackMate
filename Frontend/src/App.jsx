import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import LandingScreen from "./Pages/LandingScreen";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import GetStarted from "./Pages/GetStarted";

import OnboardingStep1 from "./Pages/OnboardingStep1";
import OnboardingStep2 from "./Pages/OnboardingStep2";
import OnboardingStep3 from "./Pages/OnboardingStep3";


import Discover from "./Pages/Discover";
import PendingRequests from "./Pages/PendingRequests";
import MySelections from "./Pages/MySelections";
import MyMatches from "./Pages/MyMatches";
import Profile from "./Pages/Profile";

// 🔥 CHAT PAGES (to be created next)
import ChatLayoutPage from "./Pages/ChatLayoutPage";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Landing / Auth */}
          <Route path="/" element={<LandingScreen />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/get-started" element={<GetStarted />} />

          {/* Onboarding - Protected */}
          <Route path="/details" element={<ProtectedRoute><OnboardingStep1 /></ProtectedRoute>} />
          <Route path="/your-info" element={<ProtectedRoute><OnboardingStep2 /></ProtectedRoute>} />
          <Route path="/skills" element={<ProtectedRoute><OnboardingStep3 /></ProtectedRoute>} />

          {/* Core App - Protected */}
          <Route path="/discover" element={<ProtectedRoute><Discover /></ProtectedRoute>} />
          <Route path="/pending" element={<ProtectedRoute><PendingRequests /></ProtectedRoute>} />
          <Route path="/selections" element={<ProtectedRoute><MySelections /></ProtectedRoute>} />
          <Route path="/matches" element={<ProtectedRoute><MyMatches /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

          {/* 🔥 CHAT SYSTEM - Protected */}
          <Route path="/chat" element={<ChatLayoutPage />} />

          {/* Fallback */}
          <Route path="*" element={<LandingScreen />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
