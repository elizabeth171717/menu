// src/components/DishForm.jsx
import React, { useState } from "react";

const DishForm = ({ dishes, onAdd, onUpdate, onDelete, onDuplicate }) => {
  const [showForm, setShowForm] = useState(false);
  const [draft, setDraft] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
  });
  const [editingDishId, setEditingDishId] = useState(null);

  // Add new dish
  const handleAdd = () => {
    if (!draft.name.trim() || !draft.price) return;
    onAdd({
      id: "dish-" + Date.now(),
      name: draft.name,
      description: draft.description,
      price: parseFloat(draft.price),
      image: draft.image,
    });
    setDraft({ name: "", description: "", price: "", image: "" });
    setShowForm(false);
  };

  // Save edited dish
  const handleUpdate = (id) => {
    if (!draft.name.trim() || !draft.price) return;
    onUpdate(id, {
      ...draft,
      price: parseFloat(draft.price),
    });
    setEditingDishId(null);
    setDraft({ name: "", description: "", price: "", image: "" });
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setDraft({ ...draft, image: reader.result });
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      {/* Existing Dishes */}
      {dishes.map((dish) => (
        <div
          key={dish.id}
          style={{
            border: "1px solid #ccc",
            padding: "0.5rem",
            borderRadius: "8px",
            marginBottom: "0.5rem",
          }}
        >
          {editingDishId === dish.id ? (
            <>
              <input
                type="text"
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              />
              <input
                type="text"
                value={draft.description}
                onChange={(e) =>
                  setDraft({ ...draft, description: e.target.value })
                }
              />
              <input
                type="number"
                value={draft.price}
                onChange={(e) => setDraft({ ...draft, price: e.target.value })}
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {draft.image && (
                <img
                  src={draft.image}
                  alt="Preview"
                  style={{
                    width: "100px",
                    borderRadius: "8px",
                    marginTop: "0.5rem",
                  }}
                />
              )}
              <button onClick={() => handleUpdate(dish.id)}>Save</button>
              <button onClick={() => setEditingDishId(null)}>Cancel</button>
            </>
          ) : (
            <>
              <h3>
                {dish.name}{" "}
                <button
                  onClick={() => {
                    setEditingDishId(dish.id);
                    setDraft(dish);
                  }}
                >
                  ✏️
                </button>{" "}
                <button onClick={() => onDelete(dish.id)}>❌</button>{" "}
                <button onClick={() => onDuplicate(dish)}>📑</button>
              </h3>
              {dish.image && (
                <img src={dish.image} alt={dish.name} width="100" />
              )}
              <p>{dish.description}</p>
              <p>${dish.price.toFixed(2)}</p>
            </>
          )}
        </div>
      ))}

      {/* Add Dish Form */}
      {showForm ? (
        <div style={{ marginTop: "1rem" }}>
          <input
            type="text"
            placeholder="Dish Name"
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Description"
            value={draft.description}
            onChange={(e) =>
              setDraft({ ...draft, description: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Price"
            value={draft.price}
            onChange={(e) => setDraft({ ...draft, price: e.target.value })}
          />
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {draft.image && (
            <img
              src={draft.image}
              alt="Preview"
              style={{
                width: "100px",
                borderRadius: "8px",
                marginTop: "0.5rem",
              }}
            />
          )}
          <button onClick={handleAdd}>Add Dish</button>
          <button onClick={() => setShowForm(false)}>Cancel</button>
        </div>
      ) : (
        <button style={{ marginTop: "1rem" }} onClick={() => setShowForm(true)}>
          ➕ Add Dish
        </button>
      )}
    </div>
  );
};

export default DishForm;
