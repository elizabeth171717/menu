// src/components/UniversalMenuForm.jsx
import React, { useState, useEffect } from "react";
import { sampleMenu } from "../data/sampleMenu";

// Determine the backend URL based on the environment
const BACKEND_URL =
  import.meta.env.MODE === "production"
    ? import.meta.env.VITE_BACKEND_URL_PRODUCTION
    : import.meta.env.VITE_BACKEND_URL_DEVELOPMENT;
const client = import.meta.env.VITE_CLIENT;
console.log("📦 Backend URL:", BACKEND_URL);
console.log("🏷️ Client tenant:", client);

const UniversalMenuForm = () => {
  const [restaurantName, setRestaurantName] = useState("");
  const [editingRestaurant, setEditingRestaurant] = useState(false);
  const [sections, setSections] = useState([]);
  const [addingSection, setAddingSection] = useState(false);

  const [newSectionName, setNewSectionName] = useState("");
  const [editingSectionId, setEditingSectionId] = useState(null);
  const [sectionDraftName, setSectionDraftName] = useState("");

  const [addingDishSectionId, setAddingDishSectionId] = useState(null);
  const [dishDraft, setDishDraft] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
  });

  const [editingDish, setEditingDish] = useState({
    sectionId: null,
    dishId: null,
    draft: {},
  });

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/${client}/menu`);
        const data = await res.json();

        if (data?.sections?.length > 0) {
          setRestaurantName(data.restaurantName);
          setSections(data.sections);
        } else {
          // first-time fallback
          setRestaurantName(sampleMenu.restaurantName);
          setSections(sampleMenu.sections);
        }
      } catch (err) {
        console.error(err);
        setRestaurantName(sampleMenu.restaurantName);
        setSections(sampleMenu.sections);
      }
    };

    fetchMenu();
  }, []);

  // ------------------- Sections Handlers -------------------
  const addSection = () => {
    if (!newSectionName.trim()) return;
    const id = "section-" + Date.now();
    setSections([...sections, { id, section: newSectionName, items: [] }]);
    setNewSectionName("");
    setAddingSection(false); // close form after save
  };

  const editSection = (id) => {
    setEditingSectionId(id);
    const sec = sections.find((s) => s.id === id);
    setSectionDraftName(sec.section);
  };

  const saveSection = (id) => {
    setSections(
      sections.map((s) =>
        s.id === id ? { ...s, section: sectionDraftName } : s
      )
    );
    setEditingSectionId(null);
    setSectionDraftName("");
  };

  const cancelEditSection = () => {
    setEditingSectionId(null);
    setSectionDraftName("");
  };

  const deleteSection = (id) => {
    setSections(sections.filter((s) => s.id !== id));
  };

  const duplicateSection = (id) => {
    const sec = sections.find((s) => s.id === id);
    if (!sec) return;
    const newId = "section-" + Date.now();
    setSections([
      ...sections,
      { ...sec, id: newId, section: sec.section + " Copy" },
    ]);
  };

  // ------------------- Dish Handlers -------------------
  const startAddingDish = (sectionId) => {
    setAddingDishSectionId(sectionId);
    setDishDraft({ name: "", description: "", price: "", image: "" });
  };

  const saveDish = (sectionId) => {
    const newDish = {
      id: "dish-" + Date.now(),
      name: dishDraft.name,
      description: dishDraft.description,
      price: parseFloat(dishDraft.price),
      image: dishDraft.image,
    };
    setSections(
      sections.map((s) =>
        s.id === sectionId ? { ...s, items: [...s.items, newDish] } : s
      )
    );
    setAddingDishSectionId(null);
  };

  const cancelAddDish = () => {
    setAddingDishSectionId(null);
    setDishDraft({ name: "", description: "", price: "", image: "" });
  };

  const editDish = (sectionId, dish) => {
    setEditingDish({ sectionId, dishId: dish.id, draft: { ...dish } });
  };

  const saveEditedDish = () => {
    const { sectionId, dishId, draft } = editingDish;
    setSections(
      sections.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              items: s.items.map((d) =>
                d.id === dishId
                  ? { ...d, ...draft, image: draft.image || d.image } // ✅ keep old image if none uploaded
                  : d
              ),
            }
          : s
      )
    );
    setEditingDish({ sectionId: null, dishId: null, draft: {} });
  };

  const cancelEditDish = () => {
    setEditingDish({ sectionId: null, dishId: null, draft: {} });
  };

  const deleteDish = (sectionId, dishId) => {
    setSections(
      sections.map((s) =>
        s.id === sectionId
          ? { ...s, items: s.items.filter((d) => d.id !== dishId) }
          : s
      )
    );
  };

  const duplicateDish = (sectionId, dishId) => {
    const sec = sections.find((s) => s.id === sectionId);
    if (!sec) return;
    const dish = sec.items.find((d) => d.id === dishId);
    if (!dish) return;
    const newId = "dish-" + Date.now();
    setSections(
      sections.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              items: [
                ...s.items,
                { ...dish, id: newId, name: dish.name + " Copy" },
              ],
            }
          : s
      )
    );
  };

  const handleImageChange = async (e, mode = "add") => {
    const file = e.target.files[0];
    if (!file) return;

    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      alert("❌ Image too large. Please upload a file smaller than 2MB.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch(`${BACKEND_URL}/api/${client}/upload-image`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();

      if (mode === "edit") {
        // ✅ update the editing dish draft
        setEditingDish((prev) => ({
          ...prev,
          draft: { ...prev.draft, image: data.url },
        }));
      } else {
        // ✅ update the add-dish draft
        setDishDraft((prev) => ({ ...prev, image: data.url }));
      }
    } catch (err) {
      console.error("❌ Error uploading image:", err);
      alert("Failed to upload image");
    }
  };

  // ------------------- Restaurant Name Handlers -------------------
  const saveRestaurantName = () => setEditingRestaurant(false);
  const cancelRestaurantEdit = () => setEditingRestaurant(false);

  // ------------------- API Save Handler -------------------
  const saveMenuToServer = async () => {
    const menuData = {
      restaurantName,
      sections,
    };

    try {
      const response = await fetch(`${BACKEND_URL}/api/${client}/menu`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(menuData),
      });

      if (!response.ok) throw new Error("Failed to save menu");

      const result = await response.json();
      alert("✅ Menu saved successfully!");
      console.log("Server response:", result);
    } catch (error) {
      console.error("Error saving menu:", error);
      alert("❌ Error saving menu. Check console for details.");
    }
  };

  return (
    <div style={{ padding: "1rem", maxWidth: "800px", margin: "0 auto" }}>
      <h2>Owner View – Build Your Menu</h2>

      {/* Restaurant Name */}
      <div>
        {editingRestaurant ? (
          <>
            <input
              type="text"
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
              style={{ marginRight: "0.5rem" }}
            />
            <button onClick={saveRestaurantName}>Save</button>
            <button onClick={cancelRestaurantEdit}>Cancel</button>
          </>
        ) : (
          <>
            <strong>{restaurantName}</strong>
            <button
              style={{ marginLeft: "0.5rem" }}
              onClick={() => setEditingRestaurant(true)}
            >
              ✏️
            </button>
          </>
        )}
      </div>

      <hr style={{ margin: "1rem 0" }} />

      {/* Sections */}
      <div>
        <h3>Sections</h3>
        {sections.map((s) => (
          <div
            key={s.id}
            style={{
              marginBottom: "1rem",
              border: "1px solid #ddd",
              padding: "0.5rem",
            }}
          >
            {editingSectionId === s.id ? (
              <>
                <input
                  type="text"
                  value={sectionDraftName}
                  onChange={(e) => setSectionDraftName(e.target.value)}
                  style={{ marginRight: "0.5rem" }}
                />
                <button onClick={() => saveSection(s.id)}>Save</button>
                <button onClick={cancelEditSection}>Cancel</button>
              </>
            ) : (
              <>
                <strong>{s.section}</strong>
                <button
                  style={{ marginLeft: "0.5rem" }}
                  onClick={() => editSection(s.id)}
                >
                  ✏️
                </button>
                <button
                  style={{ marginLeft: "0.25rem" }}
                  onClick={() => deleteSection(s.id)}
                >
                  ❌
                </button>
                <button
                  style={{ marginLeft: "0.25rem" }}
                  onClick={() => duplicateSection(s.id)}
                >
                  📑
                </button>
                <button
                  style={{ marginLeft: "0.25rem" }}
                  onClick={() => startAddingDish(s.id)}
                >
                  ➕ Add item
                </button>
              </>
            )}

            {/* Add Dish Form */}
            {addingDishSectionId === s.id && (
              <div
                style={{
                  marginTop: "0.5rem",
                  borderTop: "1px dashed #ccc",
                  paddingTop: "0.5rem",
                }}
              >
                <input
                  type="text"
                  placeholder="Dish Name"
                  value={dishDraft.name}
                  onChange={(e) =>
                    setDishDraft({ ...dishDraft, name: e.target.value })
                  }
                  style={{ marginRight: "0.25rem" }}
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={dishDraft.price}
                  onChange={(e) =>
                    setDishDraft({ ...dishDraft, price: e.target.value })
                  }
                  style={{ marginRight: "0.25rem" }}
                />
                <input
                  type="text"
                  placeholder="Description"
                  value={dishDraft.description}
                  onChange={(e) =>
                    setDishDraft({ ...dishDraft, description: e.target.value })
                  }
                  style={{ marginRight: "0.25rem" }}
                />

                <input
                  type="file"
                  onChange={(e) => handleImageChange(e, "add")}
                />
                <button onClick={() => saveDish(s.id)}>Save</button>
                <button onClick={cancelAddDish}>Cancel</button>
              </div>
            )}

            {/* Dishes */}
            <ul>
              {s.items.map((d) => (
                <li key={d.id} style={{ marginTop: "0.25rem" }}>
                  {editingDish.dishId === d.id ? (
                    <>
                      <input
                        type="text"
                        value={editingDish.draft.name}
                        onChange={(e) =>
                          setEditingDish({
                            ...editingDish,
                            draft: {
                              ...editingDish.draft,
                              name: e.target.value,
                            },
                          })
                        }
                      />
                      <input
                        type="number"
                        value={editingDish.draft.price}
                        onChange={(e) =>
                          setEditingDish({
                            ...editingDish,
                            draft: {
                              ...editingDish.draft,
                              price: parseFloat(e.target.value),
                            },
                          })
                        }
                        style={{ width: "70px", marginLeft: "0.25rem" }}
                      />
                      <input
                        type="text"
                        value={editingDish.draft.description}
                        onChange={(e) =>
                          setEditingDish({
                            ...editingDish,
                            draft: {
                              ...editingDish.draft,
                              description: e.target.value,
                            },
                          })
                        }
                        style={{ marginLeft: "0.25rem" }}
                      />

                      <input
                        type="file"
                        onChange={(e) => handleImageChange(e, "edit")}
                      />
                      <button onClick={saveEditedDish}>Save</button>
                      <button onClick={cancelEditDish}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <strong>{d.name}</strong> - ${d.price.toFixed(2)}
                      <br />
                      <em>{d.description}</em>
                      <br />
                      {d.image && (
                        <img
                          src={d.image}
                          alt={d.name}
                          style={{ width: "100px", borderRadius: "4px" }}
                        />
                      )}
                      <button
                        style={{ marginLeft: "0.25rem" }}
                        onClick={() => editDish(s.id, d)}
                      >
                        ✏️
                      </button>
                      <button
                        style={{ marginLeft: "0.25rem" }}
                        onClick={() => deleteDish(s.id, d.id)}
                      >
                        ❌
                      </button>
                      <button
                        style={{ marginLeft: "0.25rem" }}
                        onClick={() => duplicateDish(s.id, d.id)}
                      >
                        📑
                      </button>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Add New Section */}
        <div style={{ marginTop: "1rem" }}>
          {addingSection ? (
            <div style={{ marginTop: "0.5rem" }}>
              <input
                type="text"
                placeholder="New Section Name"
                value={newSectionName}
                onChange={(e) => setNewSectionName(e.target.value)}
                style={{ marginRight: "0.5rem" }}
              />
              <button onClick={addSection}>Save</button>
              <button
                onClick={() => {
                  setAddingSection(false);
                  setNewSectionName("");
                }}
                style={{ marginLeft: "0.5rem" }}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button onClick={() => setAddingSection(true)}>
              ➕ Add Section
            </button>
          )}
        </div>
      </div>

      <hr style={{ margin: "1rem 0" }} />

      <hr style={{ margin: "1rem 0" }} />
      <button onClick={saveMenuToServer}>💾 Save Menu to Server</button>
    </div>
  );
};

export default UniversalMenuForm;
