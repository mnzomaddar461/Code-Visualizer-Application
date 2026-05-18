import React from "react";
import { useNavigate } from "react-router-dom";
import { useLang } from "./LanguageContext";

const DocumentPage = () => {
  const navigate = useNavigate();
  const { isBn } = useLang();

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>

      <button
        onClick={() => navigate("/")}
        style={{
          position: "fixed", top: "18px", left: "18px", zIndex: 9999,
          background: "#1e293b", color: "#fff", border: "1px solid #334155",
          borderRadius: "10px", padding: "10px 18px", fontWeight: "600",
          cursor: "pointer", fontSize: "0.9rem", display: "flex",
          alignItems: "center", gap: "8px", boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
        }}
      >
        {isBn ? "← হোমে ফিরে যাও" : "← Back to Home"}
      </button>

      <iframe
        src="/Document.html"
        title="Project Documentation"
        style={{ width: "100%", height: "100vh", border: "none", display: "block" }}
      />
    </div>
  );
};

export default DocumentPage;