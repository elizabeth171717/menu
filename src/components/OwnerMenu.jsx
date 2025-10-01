// src/pages/OwnerView.jsx

import RestaurantForm from "./UniversalMenuForm";
import SectionForm from "../components/SectionForm";
import DishForm from "../components/DishForm";

const OwnerView = () => {
  return (
    <div style={{ padding: "1rem" }}>
      <h2>Owner View – Build Your Menu</h2>

      {/* Restaurant name form */}
      <RestaurantForm />

      {/* Sections + dishes */}
      <SectionForm />

      {/* Sections + dishes */}
      <DishForm />
    </div>
  );
};

export default OwnerView;
