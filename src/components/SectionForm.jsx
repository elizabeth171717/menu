// src/components/SectionForm.jsx
import React, { useState } from "react";

const SectionForm = ({ sections, onAdd, onUpdate, onDelete, onDuplicate }) => {
  const [showForm, setShowForm] = useState(false);
  const [newSectionName, setNewSectionName] = useState("");
  const [editingSectionId, setEditingSectionId] = useState(null);
  const [draftName, setDraftName] = useState("");

  // Add new section
  const handleAdd = () => {
    if (!newSectionName.trim()) return;
    onAdd(newSectionName);
    setNewSectionName("");
    setShowForm(false);
  };

  // Save edited section
  const handleUpdate = (id) => {
    if (!draftName.trim()) return;
    onUpdate(id, draftName);
    setEditingSectionId(null);
    setDraftName("");
  };

  return (
    <div>
      {/* Existing Sections */}
      {sections.map((section) => (
        <div key={section.id} style={{ marginBottom: "0.5rem" }}>
          {editingSectionId === section.id ? (
            <>
              <input
                type="text"
                value={draftName}
                onChange={(e) => setDraftName(e.target.value)}
              />
              <button onClick={() => handleUpdate(section.id)}>Save</button>
              <button onClick={() => setEditingSectionId(null)}>Cancel</button>
            </>
          ) : (
            <>
              {section.section}{" "}
              <button
                onClick={() => {
                  setEditingSectionId(section.id);
                  setDraftName(section.section);
                }}
              >
                ✏️
              </button>{" "}
              <button onClick={() => onDelete(section.id)}>❌</button>{" "}
              <button onClick={() => onDuplicate(section)}>📑</button>
            </>
          )}
        </div>
      ))}

      {/* Add Section Form */}
      {showForm ? (
        <div>
          <input
            type="text"
            placeholder="New section name"
            value={newSectionName}
            onChange={(e) => setNewSectionName(e.target.value)}
          />
          <button onClick={handleAdd}>Add Section</button>
          <button onClick={() => setShowForm(false)}>Cancel</button>
        </div>
      ) : (
        <button onClick={() => setShowForm(true)}>➕ Add Section</button>
      )}
    </div>
  );
};

export default SectionForm;
