import React from "react";
import { useNavigate } from "react-router-dom";

const DocumentPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      
      {/* Back to Home Button */}
      <button
        onClick={() => navigate("/")}
        style={{
          position: "fixed",
          top: "18px",
          left: "18px",
          zIndex: 9999,
          background: "#1e293b",
          color: "#fff",
          border: "1px solid #334155",
          borderRadius: "10px",
          padding: "10px 18px",
          fontWeight: "600",
          cursor: "pointer",
          fontSize: "0.9rem",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
        }}
      >
        ← Back to Home
      </button>

      {/* Document iframe */}
      <iframe
        src="/Document.html"
        title="Project Documentation"
        style={{
          width: "100%",
          height: "100vh",
          border: "none",
          display: "block",
        }}
      />
    </div>
  );
};

export default DocumentPage;