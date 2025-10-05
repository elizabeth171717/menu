import React, { useEffect, useState } from "react";

// Use environment variables instead of hardcoding
const BACKEND_URL =
  import.meta.env.MODE === "production"
    ? import.meta.env.VITE_BACKEND_URL_PRODUCTION
    : import.meta.env.VITE_BACKEND_URL_DEVELOPMENT;

const CLIENT_ID = import.meta.env.VITE_CLIENT; // 👈 pulled from .env

export default function CustomerMenu() {
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/${CLIENT_ID}/menu`);
        const data = await res.json();
        setMenu(data);
      } catch (err) {
        console.error("Failed to fetch menu:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  if (loading) {
    return <p style={{ textAlign: "center" }}>Loading menu...</p>;
  }

  if (!menu || !menu.sections) {
    return <p style={{ textAlign: "center" }}>No menu available</p>;
  }

  return (
    <div style={{ marginTop: "2rem", padding: "1rem" }}>
      {/* Restaurant Name */}
      <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>
        {menu.restaurantName}
      </h1>

      {/* Sections */}
      {menu.sections.map((section) => {
        const visibleItems = (section.items || []).filter(
          (item) => item.visible !== false // 👈 still hide if "hidden"
        );

        if (visibleItems.length === 0) return null;

        return (
          <div key={section.id || section._id} style={{ marginBottom: "3rem" }}>
            <h2
              style={{
                fontSize: "1.5rem",
                borderBottom: "2px solid #ddd",
                marginBottom: "1rem",
                paddingBottom: "0.5rem",
                textTransform: "capitalize",
              }}
            >
              {section.section}
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                gap: "1.5rem",
              }}
            >
              {visibleItems.map((item) => (
                <div
                  key={item.id || item._id}
                  style={{
                    border: "1px solid #ccc",
                    padding: "1rem",
                    borderRadius: "10px",
                    textAlign: "center",
                    opacity: item.available ? 1 : 0.6, // dim unavailable items
                  }}
                >
                  {/* Dish image */}
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{
                        width: "100%",
                        height: "150px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        marginBottom: "0.8rem",
                      }}
                    />
                  )}

                  <h3 style={{ marginBottom: "0.5rem" }}>{item.name}</h3>
                  <p style={{ marginBottom: "0.5rem" }}>{item.description}</p>

                  <p style={{ fontWeight: "bold" }}>
                    ${Number(item.price || 0).toFixed(2)}
                  </p>

                  {/* 👇 If unavailable, show message */}
                  {!item.available && (
                    <p style={{ color: "red", fontWeight: "bold" }}>
                      ❌ Unavailable
                    </p>
                  )}

                  {/* Modifiers */}
                  {item.modifiers && item.modifiers.length > 0 && (
                    <div style={{ marginTop: "0.5rem", textAlign: "left" }}>
                      <p style={{ fontWeight: "bold", marginBottom: "0.3rem" }}>
                        Options:
                      </p>
                      <ul style={{ paddingLeft: "1rem", margin: 0 }}>
                        {item.modifiers.map((mod) => (
                          <li key={mod.id}>
                            {mod.name}

                            {mod.price > 0 &&
                              ` ($${Number(mod.price || 0).toFixed(2)})`}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
