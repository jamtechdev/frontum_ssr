import React from "react";
import ProductPage from "./ProductPage";

function ProductPageSSR({
  slug,
  categorySlug,
  productData,
  productCatAttributes,
  compareByCatID,
  prosConsAccordion,
}) {
  return (
    <>
      <ProductPage
        slug={slug}
        categorySlug={categorySlug}
        productData={productData}
        productCatAttributes={productCatAttributes}
        compareByCatID={compareByCatID}
        prosConsAccordion={prosConsAccordion}
      />
    </>
  );
}

export default ProductPageSSR;
