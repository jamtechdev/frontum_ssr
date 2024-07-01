"use client";
import React, { useState } from "react";
import CompareModal from "../Comparison/CompareModal";

function ProductBottomBar({ favSlider ,productPhase}) {
  const [isOpen, setIsOpen] = useState(false);
  const openCompareModel = () => {
    setIsOpen(true);

    document.body.style.overflow = "hidden";
  };

  return (
    <>
      <div onClick={openCompareModel} className="product-bottom-bar">
        <i className="ri-add-circle-fill"></i>
        <p>{productPhase?.page_phases?.comparison_on_bottom}</p>
      </div>
      {isOpen && (
        <CompareModal
          favSlider={favSlider && favSlider}
          setIsOpen={setIsOpen}
        />
      )}
    </>
  );
}

export default ProductBottomBar;
