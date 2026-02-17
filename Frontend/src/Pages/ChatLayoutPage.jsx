import { useState } from "react";
import Navbar from "../components/Navbar";
import ChatSidebar from "../components/ChatSidebar";
import ChatWindow from "../components/ChatWindow";

const ChatLayoutPage = () => {
  const [selectedChatId, setSelectedChatId] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100">
      <Navbar />

      <div className="lg:ml-72 pt-14 lg:pt-0 max-w-7xl mx-auto py-4 sm:py-10 px-2 sm:px-4 lg:px-6">
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl lg:rounded-3xl overflow-hidden flex flex-col lg:flex-row h-[75vh] shadow-2xl border border-white/20">

          <ChatSidebar
            selectedChatId={selectedChatId}
            setSelectedChatId={setSelectedChatId}
          />

          <ChatWindow
            selectedChatId={selectedChatId}
            setSelectedChatId={setSelectedChatId}
          />

        </div>
      </div>
    </div>
  );
};

export default ChatLayoutPage;