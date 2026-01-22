// src/components/UniversalMenuForm.jsx
import React, { useState, useEffect } from "react";
import { sampleMenu } from "../data/sampleMenu";
import ItemCard from "./Cards/ItemCard";
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

  // Will hold { sectionId, groupId } while adding (groupId optional)
  const [addingDishSectionId, setAddingDishSectionId] = useState(null);

  const [dishDraft, setDishDraft] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    available: true,
    visible: true,
    modifiers: [],
    customProperties: [],
  });

  const [addingGroupSectionId, setAddingGroupSectionId] = useState(null);
  const [groupDraftName, setGroupDraftName] = useState("");
  const [editingGroup, setEditingGroup] = useState({
    sectionId: null,
    groupId: null,
    name: "",
  });

  // editingDish now supports optional groupId and a transient 'moveTarget' used in the edit panel
  const [editingDish, setEditingDish] = useState({
    sectionId: null,
    groupId: null,
    dishId: null,
    draft: {},
    moveTarget: "", // "" = no action, "section" = move to section (ungroup), or groupId
  });

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/${client}/menu`);
        const data = await res.json();

        if (data?.sections?.length > 0) {
          const normalized = data.sections.map((s) => ({
            ...s,
            groups: s.groups || [],
            items: s.items || [],
          }));
          setRestaurantName(data.restaurantName);
          setSections(normalized);
        } else {
          const fallback = sampleMenu.sections.map((s) => ({
            ...s,
            groups: s.groups || [],
            items: s.items || [],
          }));
          setRestaurantName(sampleMenu.restaurantName);
          setSections(fallback);
        }
      } catch (err) {
        console.error(err);
        const fallback = sampleMenu.sections.map((s) => ({
          ...s,
          groups: s.groups || [],
          items: s.items || [],
        }));
        setRestaurantName(sampleMenu.restaurantName);
        setSections(fallback);
      }
    };

    fetchMenu();
  }, []);

  // ------------------- Sections Handlers -------------------
  const addSection = () => {
    if (!newSectionName.trim()) return;
    const id = "section-" + Date.now();
    setSections([
      ...sections,
      { id, section: newSectionName, items: [], groups: [] },
    ]);
    setNewSectionName("");
    setAddingSection(false);
  };

  const editSection = (id) => {
    setEditingSectionId(id);
    const sec = sections.find((s) => s.id === id);
    setSectionDraftName(sec.section);
  };

  const saveSection = (id) => {
    setSections(
      sections.map((s) =>
        s.id === id ? { ...s, section: sectionDraftName } : s,
      ),
    );
    setEditingSectionId(null);
    setSectionDraftName("");
  };

  const cancelEditSection = () => {
    setEditingSectionId(null);
    setSectionDraftName("");
  };

  const deleteSection = (id) =>
    setSections(sections.filter((s) => s.id !== id));

  const duplicateSection = (id) => {
    const sec = sections.find((s) => s.id === id);
    if (!sec) return;
    const newId = "section-" + Date.now();
    setSections([
      ...sections,
      {
        ...JSON.parse(JSON.stringify(sec)),
        id: newId,
        section: sec.section + " Copy",
      },
    ]);
  };

  // ------------------- Group Handlers -------------------
  const startAddingGroup = (sectionId) => {
    setAddingGroupSectionId(sectionId);
    setGroupDraftName("");
  };

  const saveGroup = (sectionId) => {
    if (!groupDraftName.trim()) return;
    const newGroup = {
      id: "group-" + Date.now(),
      groupName: groupDraftName,
      items: [],
    };
    setSections(
      sections.map((s) =>
        s.id === sectionId
          ? { ...s, groups: [...(s.groups || []), newGroup] }
          : s,
      ),
    );
    setAddingGroupSectionId(null);
    setGroupDraftName("");
  };

  const cancelAddGroup = () => {
    setAddingGroupSectionId(null);
    setGroupDraftName("");
  };

  const editGroup = (sectionId, groupId, currentName) =>
    setEditingGroup({ sectionId, groupId, name: currentName });

  const saveEditedGroup = () => {
    const { sectionId, groupId, name } = editingGroup;
    setSections(
      sections.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              groups: s.groups.map((g) =>
                g.id === groupId ? { ...g, groupName: name } : g,
              ),
            }
          : s,
      ),
    );
    setEditingGroup({ sectionId: null, groupId: null, name: "" });
  };

  const cancelEditGroup = () =>
    setEditingGroup({ sectionId: null, groupId: null, name: "" });

  const deleteGroup = (sectionId, groupId) => {
    setSections(
      sections.map((s) =>
        s.id === sectionId
          ? { ...s, groups: s.groups.filter((g) => g.id !== groupId) }
          : s,
      ),
    );
  };

  const duplicateGroup = (sectionId, groupId) => {
    const sec = sections.find((s) => s.id === sectionId);
    if (!sec) return;
    const grp = sec.groups.find((g) => g.id === groupId);
    if (!grp) return;
    const newId = "group-" + Date.now();
    setSections(
      sections.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              groups: [
                ...s.groups,
                {
                  ...JSON.parse(JSON.stringify(grp)),
                  id: newId,
                  groupName: grp.groupName + " Copy",
                },
              ],
            }
          : s,
      ),
    );
  };

  // ------------------- Dish Handlers -------------------
  const startAddingDish = (sectionId, groupId = null) => {
    setAddingDishSectionId({ sectionId, groupId });
    setDishDraft({
      name: "",
      description: "",
      price: "",
      image: "",
      available: true,
      visible: true,
      modifiers: [],
      customProperties: [],
    });
  };

  const saveDish = (sectionId, groupId = null) => {
    const newDish = {
      id: "dish-" + Date.now(),
      name: dishDraft.name,
      description: dishDraft.description,
      price: parseFloat(dishDraft.price),
      image: dishDraft.image,
      available: dishDraft.available,
      visible: dishDraft.visible,
      modifiers: dishDraft.modifiers,
      customProperties: dishDraft.customProperties,
    };

    setSections(
      sections.map((s) => {
        if (s.id !== sectionId) return s;
        if (groupId) {
          return {
            ...s,
            groups: s.groups.map((g) =>
              g.id === groupId ? { ...g, items: [...g.items, newDish] } : g,
            ),
          };
        } else {
          return { ...s, items: [...s.items, newDish] };
        }
      }),
    );

    setAddingDishSectionId(null);
    setDishDraft({
      name: "",
      description: "",
      price: "",
      image: "",
      available: true,
      visible: true,
      modifiers: [],
      customProperties: [],
    });
  };

  const cancelAddDish = () => {
    setAddingDishSectionId(null);
    setDishDraft({
      name: "",
      description: "",
      price: "",
      image: "",
      available: true,
      visible: true,
      modifiers: [],
      customProperties: [],
    });
  };

  const editDish = (sectionId, dish, groupId = null) => {
    // set editingDish; include moveTarget default to current location
    setEditingDish({
      sectionId,
      groupId,
      dishId: dish.id,
      draft: { ...dish },
      moveTarget: groupId ?? "section",
    });
  };

  const saveEditedDish = () => {
    const { sectionId, groupId, dishId, draft } = editingDish;
    setSections(
      sections.map((s) => {
        if (s.id !== sectionId) return s;
        if (groupId) {
          return {
            ...s,
            groups: s.groups.map((g) =>
              g.id === groupId
                ? {
                    ...g,
                    items: g.items.map((d) =>
                      d.id === dishId
                        ? { ...d, ...draft, image: draft.image || d.image }
                        : d,
                    ),
                  }
                : g,
            ),
          };
        } else {
          return {
            ...s,
            items: s.items.map((d) =>
              d.id === dishId
                ? { ...d, ...draft, image: draft.image || d.image }
                : d,
            ),
          };
        }
      }),
    );
    setEditingDish({
      sectionId: null,
      groupId: null,
      dishId: null,
      draft: {},
      moveTarget: "",
    });
  };

  const cancelEditDish = () =>
    setEditingDish({
      sectionId: null,
      groupId: null,
      dishId: null,
      draft: {},
      moveTarget: "",
    });

  const deleteDish = (sectionId, dishId, groupId = null) => {
    setSections(
      sections.map((s) => {
        if (s.id !== sectionId) return s;
        if (groupId) {
          return {
            ...s,
            groups: s.groups.map((g) =>
              g.id === groupId
                ? { ...g, items: g.items.filter((d) => d.id !== dishId) }
                : g,
            ),
          };
        } else {
          return { ...s, items: s.items.filter((d) => d.id !== dishId) };
        }
      }),
    );
  };

  const duplicateDish = (sectionId, dishId, groupId = null) => {
    const sec = sections.find((s) => s.id === sectionId);
    if (!sec) return;
    let dish;
    if (groupId) {
      const grp = sec.groups.find((g) => g.id === groupId);
      dish = grp?.items.find((d) => d.id === dishId);
    } else {
      dish = sec.items.find((d) => d.id === dishId);
    }
    if (!dish) return;
    const newId = "dish-" + Date.now();
    setSections(
      sections.map((s) => {
        if (s.id !== sectionId) return s;
        if (groupId) {
          return {
            ...s,
            groups: s.groups.map((g) =>
              g.id === groupId
                ? {
                    ...g,
                    items: [
                      ...g.items,
                      { ...dish, id: newId, name: dish.name + " Copy" },
                    ],
                  }
                : g,
            ),
          };
        } else {
          return {
            ...s,
            items: [
              ...s.items,
              { ...dish, id: newId, name: dish.name + " Copy" },
            ],
          };
        }
      }),
    );
  };

  // Move dish (works for section -> group, group -> section, group -> group)
  const moveDishToGroup = (sectionId, dishId, targetGroupIdOrSection) => {
    // targetGroupIdOrSection: "section" -> ungrouped (section.items), or groupId string
    setSections(
      sections.map((s) => {
        if (s.id !== sectionId) return s;

        // find if dish exists in section items
        let dish = s.items.find((d) => d.id === dishId);
        let source = "section";
        let updatedItems = s.items;
        let updatedGroups = s.groups
          ? [...s.groups.map((g) => ({ ...g, items: [...g.items] }))]
          : [];

        if (!dish) {
          // find in groups
          for (let i = 0; i < updatedGroups.length; i++) {
            const g = updatedGroups[i];
            const found = g.items.find((d) => d.id === dishId);
            if (found) {
              dish = found;
              source = g.id;
              // remove from that group's items
              updatedGroups[i] = {
                ...g,
                items: g.items.filter((d) => d.id !== dishId),
              };
              break;
            }
          }
        } else {
          // dish was in section items: remove it
          updatedItems = updatedItems.filter((d) => d.id !== dishId);
        }

        if (!dish) return s; // nothing to move

        if (targetGroupIdOrSection === "section") {
          // move to section items
          updatedItems = [...updatedItems, dish];
        } else {
          // move into target group
          updatedGroups = updatedGroups.map((g) =>
            g.id === targetGroupIdOrSection
              ? { ...g, items: [...g.items, dish] }
              : g,
          );
        }

        return { ...s, items: updatedItems, groups: updatedGroups };
      }),
    );

    // Update editingDish to reflect new location if currently editing this dish
    if (editingDish.dishId === dishId && editingDish.sectionId === sectionId) {
      setEditingDish((prev) => ({
        ...prev,
        groupId:
          targetGroupIdOrSection === "section" ? null : targetGroupIdOrSection,
        moveTarget: targetGroupIdOrSection,
      }));
    }
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
        setEditingDish((prev) => ({
          ...prev,
          draft: { ...prev.draft, image: data.url },
        }));
      } else {
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
    const menuData = { restaurantName, sections };
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

  // ------------------- Render helpers (keeps inline UI identical) -------------------
  const renderDishEditor = (
    dDraft,
    onChangeDraft,
    onSave,
    onCancel,
    sectionId,
    currentGroupId,
  ) => {
    // this editor includes the move-to-group control inside the edit panel
    const section = sections.find((s) => s.id === sectionId);
    const groupsForSection = section ? section.groups || [] : [];

    return (
      <div className="modal-overlay">
        <div className="modal-card">
          <label>
            <input
              type="checkbox"
              checked={dDraft.available ?? true}
              onChange={(e) =>
                onChangeDraft({ ...dDraft, available: e.target.checked })
              }
              className="dish-input"
            />
            Available
          </label>
          <label>
            <input
              type="checkbox"
              checked={dDraft.visible ?? true}
              onChange={(e) =>
                onChangeDraft({ ...dDraft, visible: e.target.checked })
              }
            />
            Visible
          </label>
          <input
            type="text"
            placeholder="Dish Name"
            value={dDraft.name || ""}
            onChange={(e) => onChangeDraft({ ...dDraft, name: e.target.value })}
          />
          <input
            type="number"
            placeholder="Price"
            value={dDraft.price || ""}
            onChange={(e) =>
              onChangeDraft({ ...dDraft, price: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Description"
            value={dDraft.description || ""}
            onChange={(e) =>
              onChangeDraft({ ...dDraft, description: e.target.value })
            }
          />

          <input type="file" onChange={(e) => handleImageChange(e, "edit")} />

          {/* Move-to-group control: user asked to have move option inside edit */}
          <div style={{ marginTop: "0.5rem" }}>
            <label style={{ marginRight: "0.5rem", fontWeight: "bold" }}>
              Move to:
            </label>
            <select
              value={editingDish.moveTarget || (currentGroupId ?? "section")}
              onChange={(e) => {
                const val = e.target.value;
                // update transient selection
                setEditingDish((prev) => ({ ...prev, moveTarget: val }));
              }}
              style={{ marginRight: "0.5rem" }}
            >
              <option value="section">
                Keep / Move to section (ungrouped)
              </option>
              {groupsForSection.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.groupName}
                </option>
              ))}
            </select>
            <button
              onClick={() => {
                const target =
                  editingDish.moveTarget || (currentGroupId ?? "section");
                // perform move
                if (target === "section") {
                  moveDishToGroup(sectionId, editingDish.dishId, "section");
                } else {
                  moveDishToGroup(sectionId, editingDish.dishId, target);
                }
              }}
            >
              Move
            </button>
          </div>

          {/* Modifiers editor */}
          <div style={{ marginTop: "0.5rem" }}>
            <strong>Modifiers:</strong>
            {(dDraft.modifiers || []).map((m, idx) => (
              <div key={m.id || idx}>
                <input
                  type="text"
                  value={m.name}
                  placeholder="Modifier name"
                  onChange={(e) => {
                    const updated = (dDraft.modifiers || []).map((mod, i) =>
                      i === idx ? { ...mod, name: e.target.value } : mod,
                    );
                    onChangeDraft({ ...dDraft, modifiers: updated });
                  }}
                />
                <input
                  type="number"
                  step="0.01"
                  value={m.price}
                  placeholder="Price"
                  onChange={(e) => {
                    const updated = (dDraft.modifiers || []).map((mod, i) =>
                      i === idx
                        ? { ...mod, price: parseFloat(e.target.value) }
                        : mod,
                    );
                    onChangeDraft({ ...dDraft, modifiers: updated });
                  }}
                  style={{ width: "80px", marginLeft: "0.25rem" }}
                />
              </div>
            ))}
            <button
              onClick={() =>
                onChangeDraft({
                  ...dDraft,
                  modifiers: [
                    ...(dDraft.modifiers || []),
                    { id: Date.now().toString(), name: "", price: 0 },
                  ],
                })
              }
            >
              + Add Modifier
            </button>
          </div>

          {/* Custom Properties editor */}
          <div style={{ marginTop: "0.5rem" }}>
            <strong>Custom Properties:</strong>
            {(dDraft.customProperties || []).map((p, idx) => (
              <div key={idx}>
                <input
                  type="text"
                  value={p.key}
                  placeholder="Property name (e.g. Filling)"
                  onChange={(e) => {
                    const updated = (dDraft.customProperties || []).map(
                      (prop, i) =>
                        i === idx ? { ...prop, key: e.target.value } : prop,
                    );
                    onChangeDraft({ ...dDraft, customProperties: updated });
                  }}
                  style={{ marginRight: "0.25rem" }}
                />
                <input
                  type="text"
                  value={p.value}
                  placeholder="Value (e.g. Chicken)"
                  onChange={(e) => {
                    const updated = (dDraft.customProperties || []).map(
                      (prop, i) =>
                        i === idx ? { ...prop, value: e.target.value } : prop,
                    );
                    onChangeDraft({ ...dDraft, customProperties: updated });
                  }}
                />
              </div>
            ))}
            <button
              onClick={() =>
                onChangeDraft({
                  ...dDraft,
                  customProperties: [
                    ...(dDraft.customProperties || []),
                    { key: "", value: "" },
                  ],
                })
              }
            >
              + Add Property
            </button>
          </div>
          <div className="modal-actions">
            <button className="btn-save" onClick={onSave}>
              Save
            </button>
            <button className="btn-cancel" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
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
              border: "1px solid red",
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

                <div style={{ marginTop: "0.5rem" }}>
                  <button onClick={() => startAddingDish(s.id)}>
                    ➕ Add Item
                  </button>
                  <button onClick={() => startAddingGroup(s.id)}>
                    ➕ Create Group
                  </button>
                </div>
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
                <button onClick={() => deleteSection(s.id)}>❌ </button>
                <button onClick={() => duplicateSection(s.id)}>📑</button>
              </>
            )}

            {/* Add Dish Form (section-level) */}
            {addingDishSectionId &&
              addingDishSectionId.sectionId === s.id &&
              addingDishSectionId.groupId == null && (
                <div className="modal-overlay">
                  <div className="modal-card">
                    {renderDishEditor(
                      dishDraft,
                      (newDraft) => setDishDraft(newDraft),
                      () => saveDish(s.id, null),
                      cancelAddDish,
                      s.id,
                      null,
                    )}
                    <div className="modal-actions">
                      <button
                        className="btn-save"
                        onClick={() => saveDish(s.id, null)}
                      >
                        Save
                      </button>
                      <button className="btn-cancel" onClick={cancelAddDish}>
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

            {/* Groups */}
            {s.groups?.map((g) => (
              <div key={g.id}>
                {editingGroup.groupId === g.id &&
                editingGroup.sectionId === s.id ? (
                  <div className="modal-overlay">
                    <div className="modal-card">
                      <input
                        type="text"
                        value={editingGroup.name}
                        onChange={(e) =>
                          setEditingGroup({
                            ...editingGroup,
                            name: e.target.value,
                          })
                        }
                      />
                      <button className="btn-save" onClick={saveEditedGroup}>
                        Save
                      </button>
                      <button className="btn-cancel" onClick={cancelEditGroup}>
                        Cancel
                      </button>

                      <div style={{ marginTop: "0.5rem" }}>
                        <button
                          className="btn-add"
                          onClick={() => startAddingDish(s.id, g.id)}
                        >
                          ➕ Add Item
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <strong>{g.groupName}</strong>
                    <button
                      style={{ marginLeft: "0.5rem" }}
                      onClick={() => editGroup(s.id, g.id, g.groupName)}
                    >
                      ✏️
                    </button>
                    <button onClick={() => deleteGroup(s.id, g.id)}>❌</button>
                    <button onClick={() => duplicateGroup(s.id, g.id)}>
                      📑
                    </button>
                  </>
                )}

                {/* Add Dish Form (group-level) */}
                {addingDishSectionId &&
                  addingDishSectionId.sectionId === s.id &&
                  addingDishSectionId.groupId === g.id && (
                    <div
                      style={{
                        marginTop: "0.5rem",
                        borderTop: "1px dashed #ccc",
                        paddingTop: "0.5rem",
                      }}
                    >
                      {renderDishEditor(
                        dishDraft,
                        (newDraft) => setDishDraft(newDraft),
                        () => saveDish(s.id, g.id),
                        cancelAddDish,
                        s.id,
                        g.id,
                      )}
                    </div>
                  )}

                <div className="dish-grid">
                  {g.items.map((d) => (
                    <li key={d.id} style={{ marginTop: "0.25rem" }}>
                      {editingDish.dishId === d.id &&
                      editingDish.sectionId === s.id &&
                      editingDish.groupId === g.id ? (
                        // Edit view for grouped item (includes move control)
                        <>
                          {renderDishEditor(
                            editingDish.draft,
                            (newDraft) =>
                              setEditingDish({
                                ...editingDish,
                                draft: newDraft,
                              }),
                            saveEditedDish,
                            cancelEditDish,
                            s.id,
                            g.id,
                          )}
                        </>
                      ) : (
                        // Display view for grouped item (full controls shown)
                        <ItemCard
                          item={d}
                          onEdit={() => editDish(s.id, d, g.id)}
                          onDelete={() => deleteDish(s.id, g.id)}
                          onDuplicate={() => duplicateDish(s.id, g.id)}
                        />
                      )}
                    </li>
                  ))}
                </div>
              </div>
            ))}

            {/* Ungrouped Items */}
            <div className="dish-grid">
              {s.items.map((d) => (
                <li key={d.id} style={{ marginTop: "0.25rem" }}>
                  {editingDish.dishId === d.id &&
                  editingDish.sectionId === s.id &&
                  !editingDish.groupId ? (
                    // Edit view for ungrouped item (includes move control)
                    <>
                      {renderDishEditor(
                        editingDish.draft,
                        (newDraft) =>
                          setEditingDish({ ...editingDish, draft: newDraft }),
                        saveEditedDish,
                        cancelEditDish,
                        s.id,
                        null,
                      )}
                    </>
                  ) : (
                    // Display view for ungrouped item
                    <ItemCard
                      item={d}
                      onEdit={() => editDish(s.id, d)}
                      onDelete={() => deleteDish(s.id, d.id)}
                      onDuplicate={() => duplicateDish(s.id, d.id)}
                    />
                  )}
                </li>
              ))}
            </div>

            {/* Add Group Form */}
            {addingGroupSectionId === s.id && (
              <div style={{ marginTop: "0.5rem" }}>
                <input
                  type="text"
                  placeholder="Group Name"
                  value={groupDraftName}
                  onChange={(e) => setGroupDraftName(e.target.value)}
                  style={{ marginRight: "0.5rem" }}
                />
                <button onClick={() => saveGroup(s.id)}>Save</button>
                <button
                  onClick={cancelAddGroup}
                  style={{ marginLeft: "0.5rem" }}
                >
                  Cancel
                </button>
              </div>
            )}
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
