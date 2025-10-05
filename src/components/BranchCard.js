import React from "react";

export default function BranchCard({ branch, onSelect, isHighlighted }) {
  return (
    <div
      onClick={() => onSelect(branch)} // 👈 callback to parent
      style={{
        border: isHighlighted ? "2px solid #1976d2" : "1px solid #ccc",
        backgroundColor: isHighlighted ? "#e3f2fd" : "#fff",
        padding: "15px",
        marginBottom: "10px",
        borderRadius: "8px",
        cursor: "pointer",
        transition: "all 0.2s ease"
      }}
    >
      <h3>{branch.Bank_Name} - {branch.Branch_Name}</h3>
      <p>{branch.Branch_Address}, {branch.City}</p>
      <p>Phone: {branch.Telephone || "N/A"}</p>
      <p>Handicap access: {branch.Handicap_Access}</p>
    </div>
  );
}
