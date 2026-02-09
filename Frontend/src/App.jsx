import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LandingScreen from "./Pages/LandingScreen"; 
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import GetStarted from "./Pages/GetStarted";
import WelcomeScreen from "./Pages/WelcomeScreen";

import OnboardingStep1 from "./Pages/OnboardingStep1";
import OnboardingStep2 from "./Pages/OnboardingStep2";
import OnboardingStep3 from "./Pages/OnboardingStep3";
import ConfirmDetails from "./Pages/ConfirmDetails";

import Discover from "./Pages/Discover";
import PendingRequests from "./Pages/PendingRequests";
import MySelections from "./Pages/MySelections";
import MyMatches from "./Pages/MyMatches";
import Profile from "./Pages/Profile";

// 🔥 CHAT PAGES (to be created next)
import ChatListPage from "./Pages/ChatListPage";
import ChatPage from "./Pages/ChatPage";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Landing / Auth */}
        <Route path="/" element={<LandingScreen />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/get-started" element={<GetStarted />} />
        <Route path="/welcome" element={<WelcomeScreen />} />

        {/* Onboarding */}
        <Route path="/details" element={<OnboardingStep1 />} />
        <Route path="/your-info" element={<OnboardingStep2 />} />
        <Route path="/skills" element={<OnboardingStep3 />} />
        <Route path="/confirmDetails" element={<ConfirmDetails />} />

        {/* Core App */}
        <Route path="/discover" element={<Discover />} />
        <Route path="/pending" element={<PendingRequests />} />
        <Route path="/selections" element={<MySelections />} />
        <Route path="/matches" element={<MyMatches />} />
        <Route path="/profile" element={<Profile />} />

        {/* 🔥 CHAT SYSTEM */}
        <Route path="/chat" element={<ChatListPage />} />
        <Route path="/chat/:chatId" element={<ChatPage />} />

        {/* Fallback */}
        <Route path="*" element={<LandingScreen />} />
      </Routes>
    </Router>
  );
};

export default App;
