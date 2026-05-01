import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './header';
import Footer from './Footer';

const Layout = () => {
  const [selectedAlgo, setSelectedAlgo] = useState("");
  const [selectedPathAlgo, setSelectedPathAlgo] = useState("");
  const [selectedGraphAlgo, setSelectedGraphAlgo] = useState("");
  const [selectedSearchAlgo, setSelectedSearchAlgo] = useState("");
  const [showCode, setShowCode] = useState(false);
  const [showChat, setShowChat] = useState(false);

  return (
    <div className="min-h-screen bg-[#060913] text-slate-200 flex flex-col font-sans">
      <Header
        selectedAlgo={selectedAlgo}
        setSelectedAlgo={setSelectedAlgo}
        selectedPathAlgo={selectedPathAlgo}
        setSelectedPathAlgo={setSelectedPathAlgo}
        selectedGraphAlgo={selectedGraphAlgo}
        setSelectedGraphAlgo={setSelectedGraphAlgo}
        selectedSearchAlgo={selectedSearchAlgo}
        setSelectedSearchAlgo={setSelectedSearchAlgo}
        showCode={showCode}
        setShowCode={setShowCode}
        showChat={showChat}
        setShowChat={setShowChat}
      />
      
      {/* This renders the current page */}
      <Outlet />
      
      <Footer />
    </div>
  );
};

export default Layout;