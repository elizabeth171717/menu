// src/components/CustomerMenu.jsx
import React, { useEffect, useState } from "react";

const CLIENT_ID = "universalmenu"; // 👈 use your actual restaurant/client ID

export default function CustomerMenu() {
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/${CLIENT_ID}/menu`);
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
      {menu.sections.map((section) => (
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

          {/* Items inside section */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {section.items.map((item) => (
              <div
                key={item.id || item._id}
                style={{
                  border: "1px solid #ccc",
                  padding: "1rem",
                  borderRadius: "10px",
                  textAlign: "center",
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
                <p style={{ fontWeight: "bold" }}>${item.price.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
