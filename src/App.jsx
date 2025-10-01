// src/App.jsx
import React, { useState } from "react";
import { sampleMenu } from "./data/sampleMenu";
import UniversalMenuForm from "./components/UniversalMenuForm";
import CustomerMenu from "./components/CustomerMenu";

function App() {
  const [menu, setMenu] = useState(sampleMenu);
  const [ownerView, setOwnerView] = useState(true);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Universal Menu System</h1>
      <button onClick={() => setOwnerView(!ownerView)}>
        Switch to {ownerView ? "Customer View" : "Owner View"}
      </button>

      {ownerView ? (
        <UniversalMenuForm menu={menu} setMenu={setMenu} />
      ) : (
        <CustomerMenu menu={menu} />
      )}
    </div>
  );
}

export default App;
