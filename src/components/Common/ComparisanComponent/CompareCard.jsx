import React from "react";
import Image from "next/image";
import Link from "next/link";
const CompareCard = ({
  compareProduct,
  productPhaseData,
  products,
  productIndex,
  setIsOpen,
  handelRemoveProductFormComparison,
}) => {
  // console.log(productPhaseData)
  const handelRemoveProduct = (index) => {
    handelRemoveProductFormComparison(index);
  };

  /**
   * Finds the index of the product with the highest overall score in the given array of products.
   *
   * @param {Array} products - An array of product objects with overall_score property.
   * @return {number} The index of the product with the highest overall score, or -1000 if no unique max score.
   */
  const findProductsScoreLabelIndex = (products) => {
    if (products.length === 0) {
      return "";
    }
    const maxScore = Math.max(...products.map((obj) => obj?.overall_score));
    const winningProductIndex = products
      .map((obj, index) =>
        obj?.overall_score === maxScore ? index : undefined
      )
      .filter((index) => index !== undefined);
    return winningProductIndex.length === 1 ? winningProductIndex[0] : -1000;
  };
  const productScoreLabelIndex = findProductsScoreLabelIndex(products);
  // format overallScore Value to decimal
  const formatValue = (value) => {
    if (value % 1 === 0 && value !== 10) {
      return `${value}.0`;
    }
    return value;
  };
  // console.log(productPhaseData && productPhaseData);
  const urlChange = (i) => {
    let x = window.location.pathname.split("/")[2].split("-vs-");
    // Create a new array without the element at the specified index
    const newArray = [...x.slice(0, i), ...x.slice(i + 1)];
    if (newArray.length > 1) {
      let newUrl = newArray.join("-vs-");
      let path = `${window.location.origin}/${
        window.location.pathname.split("/")[1]
      }/${newUrl}`;
      window.location.href = path;
    }

    newArray.length <= 1 && handelRemoveProduct(i);
  };

  return (
    <div className="comparison-wrapper">
      {compareProduct.length <= 0 ? (
        <div className="add-product" onClick={() => setIsOpen(true)}>
          <div className="add-product-inner-content">
            <img
              src="/images/add_icon.svg"
              width={50}
              height={50}
              alt="compare product"
            />
            <p>
              {productPhaseData && productPhaseData?.add_product_to_comparison}
            </p>
          </div>
        </div>
      ) : (
        <>
          {productScoreLabelIndex !== "" &&
            productScoreLabelIndex === productIndex && (
              <div className="comparison-tag">
                {productPhaseData && productPhaseData?.winner}
              </div>
            )}
          {productScoreLabelIndex === -1000 && productIndex === 0 && (
            <div className="comparison-tag">
              {productPhaseData && productPhaseData?.draw_text}
            </div>
          )}
          <div className="comparison-card">
            <img
              src={
                compareProduct?.main_image
                  ? compareProduct?.main_image
                  : "/images/nofound.png"
              }
              width={0}
              height={0}
              alt=""
              sizes="100%"
            />
            <div className="comparison-card-footer">
              <h2 className="product-title">{compareProduct.name}</h2>
            </div>
            <span
              className="count"
              style={{
                background:
                  compareProduct.overall_score >= 7.5
                    ? "#093673"
                    : compareProduct.overall_score >= 5 &&
                      compareProduct.overall_score < 7.5
                    ? "#437ECE"
                    : "#85B2F1",
              }}
            >
              {formatValue(compareProduct?.overall_score)}
            </span>
            <i
              className="ri-close-circle-line close_icon"
              onClick={
                () => urlChange(productIndex)
                //
              }
            ></i>
          </div>
          <div className="comparison-product-spec">
            {/* {console.log(compareProduct?.price_websites)} */}
            {compareProduct?.price_websites?.length > 0 ? (
              <>
                <div className="comparison-product-item">
                  <img
                    src={
                      compareProduct?.price_websites[0]?.price != null &&
                      compareProduct?.price_websites[0]?.logo === null
                        ? "/images/No-Image.png"
                        : compareProduct?.price_websites[0]?.logo
                    }
                    width={0}
                    height={0}
                    sizes="100%"
                    alt="price"
                  />
                  {compareProduct?.price_websites[0]?.price != null && (
                    <span>
                      <a
                        target="_blank"
                        href={`/link?p=${btoa(
                          compareProduct?.price_websites[0]?.url
                        )}`}
                        style={{ color: "#fff" }}
                      >
                        {/* {console.log(compareProduct?.currency)} */}
                        {compareProduct?.price_websites[0]?.price}{" "}
                        {compareProduct?.currency}{" "}
                      </a>
                    </span>
                  )}
                </div>
                {compareProduct?.price_websites[1] && (
                  <div className="comparison-product-item">
                    <img
                      src={
                        compareProduct?.price_websites[1]?.logo === null
                          ? "/images/No-Image.png"
                          : compareProduct?.price_websites[1]?.logo
                      }
                      width={0}
                      height={0}
                      sizes="100%"
                      alt="price"
                    />
                    {compareProduct?.price_websites[1]?.price != null && (
                      <span>
                        {" "}
                        <a
                          href={`/link?p=${btoa(
                            compareProduct?.price_websites[1]?.url
                          )}`}
                          style={{ color: "#fff" }}
                        >
                          {" "}
                          {compareProduct?.price_websites[1]?.price}{" "}
                          {compareProduct?.currency}{" "}
                        </a>
                      </span>
                    )}
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="not-availabel">
                  {/* <span className="txt">NOT AVAILABLE</span> */}
                  <i>N/A</i>
                  <span className="price">
                    ~ {compareProduct?.price} {compareProduct?.currency}
                  </span>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default CompareCard;
