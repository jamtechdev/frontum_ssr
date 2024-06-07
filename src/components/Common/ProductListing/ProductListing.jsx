// ProductListing.jsx

import React, { useEffect, useRef } from "react";
import "react-loading-skeleton/dist/skeleton.css";
import Product from "./Product/Product";

export default React.forwardRef(function ProductListing(
  {
    products,
    productPositionArray,
    handleToggleCollapse,
    handleManageCollapsedDiv,
    text_before_listing,
    text_after_listing,
    guidePhraseData,
    slug,
    order,
    searchParams,
    productPagination,
  },
  ref
) {
  const productListRef = ref || useRef(null);

  useEffect(() => {
    if (productListRef.current) {
      productListRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [products]); // Scroll when products change
  // (productPagination);
  function findProductPosition(name) {
    const index = Object.values(productPositionArray).indexOf(name);

    if (index !== -1) {
      return index + 1;
    } else {
      return null;
    }
  }

  return (
    <div className="best-product-wrapper" id="scroll__top">
      <span className="testing__text">
        <i>{text_before_listing}</i>
      </span>
      {products?.map((product, index) => (
        <Product
          guidePhraseData={guidePhraseData}
          incomingProduct={product}
          KeyIndex={index}
          position={findProductPosition(product.name)}
          handleToggleCollapse={handleToggleCollapse}
          handleManageCollapsedDiv={handleManageCollapsedDiv}
          slug={slug}
          order={order}
          searchParams={searchParams}
          productPagination={productPagination}
        />
      ))}
      <span className="testing__text">
        <i>{text_after_listing}</i>
      </span>
    </div>
  );
});
