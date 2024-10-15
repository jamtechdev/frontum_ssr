/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useRef, useState, useEffect, Fragment } from "react";
import Image from "next/image";
import { Button, Table } from "react-bootstrap";
// import QuestionIcon from "../../Svg/QuestionIcon";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import ProsConsToolTip from "../../Svg/ProsConsToolTip";
import { useRouter } from "next/navigation";
import Link from "next/link";
import formatValue from "@/_helpers/formatValue";
import Rating from "../Rating/Rating";
const ProductCompareTable = React.memo(
  ({ products, categoryAttributes, slug, productPhaseData }) => {
    const router = useRouter();
    let initialNoOfCategories = 5;

    const [pagination, setPagination] = useState({});
    const defaultNo = 5;

    const [fullTable, setFullTable] = useState(2);

    // this for function for Table product sticky (Start)
    const [winPos, setWinPos] = useState(false);
    const [stickyWith, setStickyWidth] = useState(true);
    const [afterTableSticky, setAfterTableSticky] = useState(false);
    const useDetectSticky = (ref, observerSettings = { threshold: [1] }) => {
      const [isSticky, setIsSticky] = useState(false);
      const [afterTableSticky, setAfterTableSticky] = useState(false);
      const aftertableRef = useRef();
      const newRef = useRef();
      ref ||= newRef;

      // mount
      useEffect(() => {
        const cachedRef = ref.current;
        const observer = new IntersectionObserver(([entry]) => {
          setIsSticky(entry.intersectionRatio < 1);
          if (entry.intersectionRatio === 0) {
            setAfterTableSticky(true);
          } else {
            setAfterTableSticky(false);
          }
        }, observerSettings);

        observer.observe(cachedRef);
        // // (observerSettings);
        return () => {
          observer.unobserve(cachedRef);
          // (observerSettings);
        };
      }, []);

      return [isSticky, ref, setIsSticky];
    };

    if (typeof window !== "undefined") {
      // Access the window object here
      window.onscroll = function () {
        var testDiv = document.getElementById("testone");
        testDiv?.getBoundingClientRect().top < 2
          ? setWinPos(true)
          : setWinPos(false);
        // ( testDiv.getBoundingClientRect().top);

        var tbodyDiv = document.getElementById("tbody");
        tbodyDiv?.getBoundingClientRect().top > 2
          ? setWinPos(false)
          : setWinPos(true);

        var nextHeadingDiv = document.getElementById("h2");
        nextHeadingDiv?.getBoundingClientRect().bottom > 0
          ? setStickyWidth(false)
          : setStickyWidth(true);

        // (nextHeadingDiv?.getBoundingClientRect().bottom > 0);

        setAfterTableSticky(true);
      };
    }

    const [isSticky, ref] = useDetectSticky();
    // this for function for Table product sticky (End)

    const productsWithAttributeGroup = {};
    products?.forEach((product) => {
      const productCopy = { ...product };
      const productAttributes = {};
      product?.attributes?.forEach((attribute) => {
        const categoryName = attribute.attribute_category.name;
        if (!productAttributes[categoryName]) {
          productAttributes[categoryName] = [];
        }
        productAttributes[categoryName].push(attribute);
      });
      productCopy.attributes = productAttributes;
      productsWithAttributeGroup[product.name] = productCopy;
    });
    const finalProducts = Object.values(productsWithAttributeGroup);
    const removeLastObjectFromCategory = [...categoryAttributes]; // Clone the finalProducts array
    removeLastObjectFromCategory.pop();

    const getValue = (arr, attribute) => {
      const foundElement = arr.find((obj) => obj.attribute === attribute);
      if (foundElement) {
        return foundElement.attribute_value;
      }
      return null;
    };

    const [showAllAttributes, setShowAllAttributes] = useState({});

    const initialNoOfAttributes = 5; // Number of attributes to display initially

    const handleShowAllAttributes = (categoryName) => {
      setShowAllAttributes((prev) => ({
        ...prev,
        [categoryName]: !prev[categoryName],
      }));
    };

    const handlePagination = (categoryName) => {
      let updatedPage =
        pagination[categoryName] + initialNoOfCategories ||
        initialNoOfCategories * 2;
      setPagination({ ...pagination, [categoryName]: updatedPage });
    };

    const handleTableShow = () => {
      setFullTable(categoryAttributes?.length);
    };

    // These funcation for add  Star on table value which was better than other
    // **start**
    /**
     * Generates a table cell with asterisks added to the top value of a given category and attribute.
     *
     * @param {number} defaultNo - The number of products to consider for the comparison.
     * @param {Object} category - The category object containing the name of the category.
     * @param {Object} catAttribute - The attribute object containing the name of the attribute.
     * @param {boolean} [isHiddenShow=false] - Indicates whether to show or hide the cell.
     * @return {JSX.Element} The table cell with asterisks added to the top value.
     */
    const addAsterisksToTopValue = (
      defaultNo,
      category,
      catAttribute,
      isHiddenShow = false
    ) => {
      const copiedFinalProducts = JSON.parse(JSON.stringify(finalProducts));
      const filterData = copiedFinalProducts
        .slice(0, defaultNo)
        .flatMap((product) =>
          product.attributes[category.name]?.filter(
            (obj) => obj?.attribute === catAttribute.name
          )
        );
      const arrayOfObjects = [...filterData];
      arrayOfObjects.forEach((obj) => {
        obj?.star &&
          obj.attribute_value !== "?" &&
          obj.attribute_value !== "-" &&
          (obj.attribute_value = obj?.attribute_value + "⭐");
      });
      return (
        <>
          {arrayOfObjects.map((item, attrIndex) => (
            <td
              key={attrIndex}
              className={isHiddenShow ? "display_none" : "display_block"}
            >
              {item?.attribute_value.includes("⭐") ? (
                <>
                  <div>
                    {item?.attribute_value.split("⭐")[0]}{" "}
                    {item?.unit?.split("-")[0] && item?.unit?.split("-")[0]}
                    <span className="tooltip-title-2">
                      <img
                        style={{ float: "right", paddingRight: "5px" }}
                        src="/icons/star.png"
                        alt="star"
                      />
                      <ProsConsToolTip hover_phrase={item.start_phase} />
                    </span>
                  </div>
                </>
              ) : (
                <>
                  {item?.attribute_value === "-" ||
                  item?.attribute_value === null ||
                  item?.attribute_value === "?" ? (
                    item?.attribute_value
                  ) : (
                    <>
                      {item?.attribute_value === "-" ||
                      item?.attribute_value === null ||
                      item?.attribute_value === "?" ? (
                        item?.attribute_value
                      ) : (
                        <>
                          {" "}
                          {item?.attribute_value} {item?.unit ? item?.unit : ""}
                        </>
                      )}
                    </>
                  )}
                </>
              )}
            </td>
          ))}
        </>
      );
    };
    // add startONTable
    const addStarOnTable = (defaultNo, type, values, starPhase) => {
      if (
        type === "overall_score" ||
        type === "expert_reviews" ||
        type === "technical_score" ||
        type === "user_rating" ||
        type === "ratio" ||
        type === "popularity"
      ) {
        const uniqueValues = [...new Set(values)];
        const maxValue = Math.max(...uniqueValues);
        return values.map((value) =>
          value === maxValue &&
          values.indexOf(value) === values.lastIndexOf(value) ? (
            <div>
              {formatValue(value)}
              <span key={value} className="tooltip-title-2">
                <img
                  style={{ float: "right", paddingRight: "5px" }}
                  src="/icons/star.png"
                  alt="star"
                />
                {/* {(values, "neet")} */}
                <ProsConsToolTip hover_phrase={starPhase} />
              </span>
            </div>
          ) : value === 0 ? (
            "?"
          ) : (
            formatValue(value)
          )
        );
      }
      return values;
    };
    // **End**
    const className = winPos
      ? stickyWith
        ? "isSticky widthFull" // Both winPos and stickyWith are true
        : "isSticky" // Only winPos is true
      : "nonSticky";
    return (
      <div
        className={
          fullTable == 2
            ? "compare-container-wrapper"
            : "compare-container-wrapper no-before"
        }
        ref={ref}
      >
        <Table className="compare-container">
          <thead id="testone" className={className} ref={ref}>
            <tr className="">
              <th></th>
              {finalProducts.slice(0, defaultNo).map((product, index) => {
                return (
                  <th key={index}>
                    {/* <span className="best-tag-product">Best From All</span> */}
                    {/* {(product)} */}
                    {index === 0 && (
                      <span className="best-tag-product">
                        {productPhaseData?.compared}
                        {/* {product?.assigned_title} */}
                      </span>
                    )}

                    <p className="device-name">
                      {/* <a href="">/product/${product?.permalik</a> */}
                      <a
                        href={`/${product?.category_url}/${product?.permalink}`}
                      >
                        {" "}
                      </a>
                      <small className="product-name-small">
                        {product?.name}
                      </small>

                      <img
                        className="compare_image"
                        src={
                          product?.mini_image
                            ? product?.mini_image
                            : "/images/nofound.png"
                        }
                        width={0}
                        height={0}
                        alt={`${product?.permalink}`}
                        sizes="100%"
                      />
                    </p>

                    {product.price_websites &&
                      product?.price_websites?.every(
                        (data) => data.price !== null
                      ) && (
                        <>
                          {" "}
                          <>
                            <ul className="best-list-item d-none">
                              {/* {(product?.currency)} */}
                              {product.price_websites &&
                                product?.price_websites?.every(
                                  (data) => data.price === null
                                ) && (
                                  <div className="not-availabel n-lable p-1">
                                    {/* <span className="txt">NOT AVAILABLE</span> */}
                                    <i>N/A</i>
                                    <span className="price font__16__inline">
                                      ~ {product?.price} {product?.currency}
                                    </span>
                                  </div>
                                )}
                              {product.price_websites &&
                                product.price_websites
                                  .slice(0, 1)
                                  ?.map((data, dIndex) => {
                                    return (
                                      <React.Fragment key={dIndex}>
                                        {data.price !== null && (
                                          <li>
                                            <>
                                              <Link
                                                rel="noopener noreferrer"
                                                target="_blank"
                                                href={`/link?p=${btoa(
                                                  data.url
                                                )}`}
                                              >
                                                <img
                                                  src={data?.logo}
                                                  width={0}
                                                  height={0}
                                                  sizes="100vw"
                                                  alt={data?.alt}
                                                />
                                              </Link>
                                              <span>
                                                <a
                                                  rel="noopener noreferrer"
                                                  target="_blank"
                                                  href={`/link?p=${btoa(
                                                    data.url
                                                  )}`}
                                                  className="font__16__inline"
                                                >
                                                  {data?.price}{" "}
                                                  {product?.currency}
                                                </a>
                                              </span>
                                            </>
                                          </li>
                                        )}
                                      </React.Fragment>
                                    );
                                  })}
                            </ul>
                          </>
                        </>
                      )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody id="tbody">
            <tr className="">
              <th>
                <p>{productPhaseData?.image ?? "Image"}</p>
              </th>
              {finalProducts.slice(0, defaultNo).map((product, imageIndex) => {
                return (
                  <td key={imageIndex}>
                    <img
                      className="compare_image"
                      src={
                        product?.mini_image
                          ? product?.mini_image
                          : "/images/nofound.png"
                      }
                      width={0}
                      height={0}
                      alt={`${product?.permalink}`}
                      sizes="100%"
                    />
                  </td>
                );
              })}
            </tr>
            <tr className="">
              <th>
                <p>{productPhaseData?.price}</p>
              </th>
              {finalProducts.slice(0, defaultNo).map((product, priceIndex) => {
                return (
                  <td key={priceIndex} className={`${priceIndex}-class`}>
                    <div className="best-price-section">
                      {product.price_websites &&
                        product?.price_websites?.every(
                          (data) => data.price === null
                        ) && (
                          <div className="not-availabel">
                            {/* <span className="txt">NOT AVAILABLE</span> */}
                            <i>N/A</i>

                            <span className="price font__16__inline">
                              ~ {product?.price} {product?.currency}
                            </span>
                          </div>
                        )}
                      {product.price_websites &&
                        product?.price_websites?.every(
                          (data) => data.price !== null
                        ) && (
                          <>
                            <ul className="best-list-item">
                              {product.price_websites &&
                                product.price_websites.map((data, dIndex) => {
                                  return (
                                    <React.Fragment key={dIndex}>
                                      {data.price !== null && (
                                        <li>
                                          <>
                                            <Link
                                              rel="noopener noreferrer"
                                              target="_blank"
                                              href={`/link?p=${btoa(data.url)}`}
                                            >
                                              <img
                                                src={data?.logo}
                                                width={0}
                                                height={0}
                                                sizes="100vw"
                                                alt={data?.alt}
                                              />
                                            </Link>
                                            <span>
                                              <a
                                                rel="noopener noreferrer"
                                                target="_blank"
                                                href={`/link?p=${btoa(
                                                  data.url
                                                )}`}
                                                className="font__16__inline"
                                              >
                                                {/* {(data?.currency)} */}
                                                {data?.price}{" "}
                                                {product?.currency}
                                              </a>
                                            </span>
                                          </>
                                        </li>
                                      )}
                                    </React.Fragment>
                                  );
                                })}
                            </ul>
                          </>
                        )}
                    </div>
                  </td>
                );
              })}
            </tr>

            <tr className="tr-bg-color">
              <th className="sub-inner-padding">
                <div className="tooltip-title">
                  {productPhaseData && productPhaseData?.overall_score}
                  {products &&
                    products.length > 0 &&
                    products[0]?.overall_score_descriptions && (
                      <div className="tooltip-display-content">
                        {products[0]?.overall_score_descriptions
                          ?.description && (
                          <p className="mb-2">
                            <b>{productPhaseData?.what_it_is}: </b>{" "}
                            {
                              products[0]?.overall_score_descriptions
                                ?.description
                            }
                          </p>
                        )}
                        {products[0]?.overall_score_descriptions
                          ?.when_matters && (
                          <p className="mb-2">
                            <b>When it matters: </b>{" "}
                            {
                              products[0]?.overall_score_descriptions
                                ?.when_matters
                            }
                          </p>
                        )}
                      </div>
                    )}
                </div>
              </th>
              {finalProducts
                .slice(0, defaultNo)
                .map((product, overAllIndex) => {
                  return (
                    <td key={overAllIndex}>
                      <span
                        className="count dark-color"
                        style={{
                          background:
                            product.overall_score >= 7.5
                              ? "#093673"
                              : product.overall_score >= 5 &&
                                product.overall_score < 7.5
                              ? "#437ECE"
                              : " #85B2F1",
                        }}
                      >
                        {formatValue(product.overall_score)}
                      </span>
                    </td>
                  );
                })}
            </tr>
            <tr className="">
              <th className="sub-inner-padding">
                <div className="tooltip-title">
                  {productPhaseData && productPhaseData?.technical_score}
                  {products &&
                    products.length > 0 &&
                    products[0]?.technical_score_descriptions && (
                      <div className="tooltip-display-content">
                        {products[0]?.technical_score_descriptions
                          ?.description && (
                          <p className="mb-2">
                            <b>{productPhaseData?.what_it_is}: </b>{" "}
                            {
                              products[0]?.technical_score_descriptions
                                ?.description
                            }
                          </p>
                        )}
                        {products[0]?.technical_score_descriptions
                          ?.when_matters && (
                          <p className="mb-2">
                            <b>When it matters: </b>{" "}
                            {
                              products[0]?.technical_score_descriptions
                                ?.when_matters
                            }
                          </p>
                        )}
                      </div>
                    )}
                </div>
              </th>

              {finalProducts
                .slice(0, defaultNo)
                .map((product, technicalIndex) => {
                  const values = finalProducts.map((p) => p.technical_score);
                  return (
                    <td key={technicalIndex}>
                      {
                        addStarOnTable(
                          defaultNo,
                          "technical_score",
                          values,
                          product?.technical_score_star_phrase
                        )[technicalIndex]
                      }
                    </td>
                  );
                })}
            </tr>
            <tr className="">
              <th className="sub-inner-padding">
                <div className="tooltip-title">
                  {productPhaseData && productPhaseData?.users_ratings}
                  {products &&
                    products.length > 0 &&
                    products[0]?.users_rating_descriptions && (
                      <div className="tooltip-display-content">
                        {products[0]?.users_rating_descriptions
                          ?.description && (
                          <p className="mb-2">
                            <b>{productPhaseData?.what_it_is} : </b>
                            {
                              products[0]?.users_rating_descriptions
                                ?.description
                            }
                          </p>
                        )}
                        {/* {(products[0]?.users_rating_descriptions?.when_matters)} */}
                        {/* {(productPhaseData)} */}

                        <p className="mb-2">
                          <b>{productPhaseData?.when_it_matters}: </b>
                          {products[0]?.users_rating_descriptions?.when_matters}
                        </p>
                      </div>
                    )}
                </div>
              </th>
              {finalProducts.slice(0, defaultNo).map((product, userIndex) => {
                const values = finalProducts.map((p) => p.reviews);
                return (
                  <td key={userIndex}>
                    {
                      addStarOnTable(
                        defaultNo,
                        "user_rating",
                        values,
                        product?.reviews_star_phase
                      )[userIndex]
                    }
                  </td>
                );
              })}
            </tr>
            {/* {(products,"xxx")} */}
            {products[0]?.expert_reviews_rating > 0 && (
              <tr className="">
                <th className="sub-inner-padding">
                  <div className="tooltip-title">
                    Expert Reviews
                    <div className="tooltip-display-content">
                      {products[0]?.expert_reviews_descriptions
                        ?.description && (
                        <p className="mb-2">
                          <b>{productPhaseData?.what_it_is}: </b>{" "}
                          {
                            products[0]?.expert_reviews_descriptions
                              ?.description
                          }
                        </p>
                      )}

                      <p className="mb-2">
                        <b>When it matters: </b>{" "}
                        {products[0]?.expert_reviews_descriptions?.when_matters}
                        {products[0]?.expert_reviews_websites?.map(
                          (data, index) => {
                            return (
                              <div className="user__rating__popup" key={index}>
                                <div className="user__rating__popup__list">
                                  <span
                                    className="user__rating__popup__rating"
                                    style={{
                                      background: getColorBasedOnScore(
                                        data?.evaluation
                                      ),
                                    }}
                                  >
                                    {formatValue(data?.evaluation)}
                                  </span>
                                  <div className="user__rating__popup__content">
                                    {data?.image !== null && (
                                      <a
                                        href={`/link?p=${btoa(
                                          data?.website_name
                                        )}`}
                                      >
                                        <img src={`${data?.image}`} />
                                      </a>
                                    )}

                                    <p>
                                      {" "}
                                      {data?.name !== null ? (
                                        <a
                                          href={`/link?p=${btoa(
                                            data?.website_name
                                          )}`}
                                          style={{ color: "inherit" }}
                                        >
                                          {" "}
                                          {data?.name}
                                        </a>
                                      ) : (
                                        <a
                                          href={`/link?p=${btoa(
                                            data?.website_name
                                          )}`}
                                          style={{ color: "inherit" }}
                                        >
                                          {" "}
                                          {extractDomainName(
                                            data?.website_name
                                          )}
                                        </a>
                                      )}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            );
                          }
                        )}
                      </p>
                    </div>
                  </div>
                </th>
                {finalProducts
                  .slice(0, defaultNo)
                  .map((product, expert_reviews) => {
                    const values = finalProducts.map(
                      (p) => p.expert_reviews_rating
                    );
                    return (
                      <td key={expert_reviews}>
                        {
                          addStarOnTable(
                            defaultNo,
                            "expert_reviews",
                            values,
                            product?.expert_reviews_rating_star_phase
                          )[expert_reviews]
                        }
                      </td>
                    );
                  })}
              </tr>
            )}

            <tr className="">
              <th className="sub-inner-padding">
                <div className="tooltip-title">
                  {productPhaseData && productPhaseData?.popularity}
                  {products && products[0]?.popularity_descriptions && (
                    <div className="tooltip-display-content">
                      {products[0]?.popularity_descriptions?.description && (
                        <p className="mb-2">
                          <b>{productPhaseData?.what_it_is}: </b>{" "}
                          {products[0]?.popularity_descriptions?.description}
                        </p>
                      )}

                      <p className="mb-2">
                        <b>{productPhaseData?.when_it_matters}: </b>{" "}
                        {products[0]?.popularity_descriptions?.when_matters}
                      </p>
                    </div>
                  )}
                </div>
              </th>
              {finalProducts
                .slice(0, defaultNo)
                .map((product, popularityIndex) => {
                  const values = finalProducts.map((p) => p.popularity_points);
                  return (
                    <td key={popularityIndex}>
                      {
                        addStarOnTable(
                          defaultNo,
                          "popularity",
                          values,
                          product?.popularity_points_star_phase
                        )[popularityIndex]
                      }
                    </td>
                  );
                })}
            </tr>
            <tr className="">
              <th className="sub-inner-padding">
                <div className="tooltip-title">
                  {productPhaseData &&
                    productPhaseData?.ratio_quality_price_points}
                  {products[0]?.ratio_qulitiy_points_descriptions && (
                    <div className="tooltip-display-content">
                      {products[0]?.ratio_qulitiy_points_descriptions
                        ?.description && (
                        <p className="mb-2">
                          <b>{productPhaseData?.what_it_is}: </b>{" "}
                          {
                            products[0]?.ratio_qulitiy_points_descriptions
                              ?.description
                          }
                        </p>
                      )}

                      <p className="mb-2">
                        <b>When it matters: </b>{" "}
                        {
                          products[0]?.ratio_qulitiy_points_descriptions
                            ?.when_matters
                        }
                      </p>
                    </div>
                  )}
                </div>
              </th>
              {finalProducts.slice(0, defaultNo).map((product, ratioIndex) => {
                const values = finalProducts.map(
                  (p) => p.ratio_quality_price_points
                );
                return (
                  <td key={ratioIndex}>
                    {/* {(values, "neetxy")} */}
                    {
                      addStarOnTable(
                        defaultNo,
                        "ratio",
                        values,
                        product?.ratio_quality_price_points_star_phase
                      )[ratioIndex]
                    }
                  </td>
                );
              })}
            </tr>
            {products[0]?.area_evaluation?.map((data, index) => {
              const maxValues = finalProducts.map(
                (product) => product?.area_evaluation?.[index]?.value ?? null
              );
              const max = Math.max(
                ...maxValues.filter((value) => value !== null)
              );

              // Count occurrences of each value
              const valueCounts = finalProducts.reduce((acc, product) => {
                const value = product?.area_evaluation?.[index]?.value;
                if (value !== null) {
                  acc[value] = (acc[value] || 0) + 1;
                }
                return acc;
              }, {});

              return (
                <tr className="" key={index}>
                  {" "}
                  {/* Ensure to set a unique key for each <tr> */}
                  <th className="sub-inner-padding">
                    <div className="tooltip-title">
                      {data?.title}

                      <div className="tooltip-display-content">
                        {
                          <p className="mb-2">
                            <b>
                              {products[0] && productPhaseData?.what_it_is} :{" "}
                            </b>
                            {data?.hover_phase?.what_is_it}
                          </p>
                        }

                        {/* {(product)} */}
                      </div>
                    </div>
                  </th>
                  {finalProducts.slice(0, defaultNo).map((product, idx) => {
                    const value =
                      product?.area_evaluation?.[index]?.value ?? null;
                    return (
                      <td key={idx}>
                        {formatValue(value)}
                        {value === max && valueCounts[value] <= 1 && (
                          <span key={value} className="tooltip-title-2">
                            <img
                              style={{ float: "right", paddingRight: "5px" }}
                              src="/icons/star.png"
                              alt="star"
                            />
                            <ProsConsToolTip hover_phrase={data?.star_text} />
                          </span>
                        )}
                        {/* Add star if the value is the maximum for this index and count is less than or equal to 2 */}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
            {removeLastObjectFromCategory.map((category, categoryIndex) => {
              const isHiddenTop = fullTable === 2 && categoryIndex >= 2;
              let isHiddenShow = true;
              return (
                <Fragment key={categoryIndex}>
                  <tr
                    className={`tr-bg-color ${
                      isHiddenTop ? "display_none" : "display_block"
                    }`}
                  >
                    <th>
                      <div className="tooltip-title">
                        {category.name}
                        {(category.description || category.when_matters) && (
                          <div className="tooltip-display-content">
                            {category?.description && (
                              <p className="mb-2">
                                <b>
                                  {productPhaseData &&
                                    productPhaseData?.what_it_is}
                                  :{" "}
                                </b>
                                {category?.description}
                              </p>
                            )}

                            {category?.when_matters && (
                              <p className="mb-2">
                                <b>
                                  {productPhaseData &&
                                    productPhaseData?.when_it_matters}
                                  :{" "}
                                </b>{" "}
                                {category?.when_matters}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </th>
                    {finalProducts
                      .slice(0, defaultNo)
                      .map((product, productIndex) => {
                        return (
                          <td key={productIndex}>
                            <span
                              className="count"
                              style={{
                                background:
                                  product.attributes[
                                    category?.name
                                  ]?.[0]?.attribute_evaluation?.toFixed(1) >=
                                  7.5
                                    ? "#093673"
                                    : product.attributes[
                                        category?.name
                                      ]?.[0]?.attribute_evaluation?.toFixed(
                                        1
                                      ) >= 5 &&
                                      product.attributes[
                                        category?.name
                                      ]?.[0]?.attribute_evaluation?.toFixed(1) <
                                        7.5
                                    ? "#437ECE"
                                    : "#85B2F1",
                              }}
                            >
                              {/* {(product.attributes[category.name].unit && product.attributes[category.name].unit )} */}
                              {product.attributes[
                                category.name
                              ]?.[0].attribute_evaluation?.toFixed(1)}{" "}
                            </span>
                          </td>
                        );
                      })}
                  </tr>

                  {/* here cat start  */}

                  {category.attributes
                    ?.sort((a, b) => a.position - b.position)
                    .map((catAttribute, catAttributeIndex) => {
                      isHiddenShow =
                        !showAllAttributes[category.name] &&
                        catAttributeIndex >= initialNoOfAttributes;
                      return (
                        <tr
                          key={catAttributeIndex}
                          className={
                            isHiddenTop ? "display_none" : "display_block"
                          }
                        >
                          <th
                            className={
                              isHiddenShow
                                ? "display_none sub-inner-padding "
                                : "display_block sub-inner-padding"
                            }
                          >
                            <div className="tooltip-title">
                              {catAttribute.name}
                              {(catAttribute.description ||
                                catAttribute.when_matters) && (
                                <div className="tooltip-display-content">
                                  {catAttribute?.description && (
                                    <p className="mb-2">
                                      <b>
                                        {productPhaseData &&
                                          productPhaseData?.what_it_is}
                                        :{" "}
                                      </b>
                                      {catAttribute?.description}
                                    </p>
                                  )}

                                  {catAttribute?.when_matters && (
                                    <p className="mb-2">
                                      <b>
                                        {productPhaseData &&
                                          productPhaseData?.when_it_matters}
                                        :{" "}
                                      </b>{" "}
                                      {catAttribute?.when_matters}
                                    </p>
                                  )}

                                  {catAttribute?.importance && (
                                    <p className="mb-2">
                                      <b>
                                        {productPhaseData &&
                                          productPhaseData?.importance_text}
                                        :{" "}
                                      </b>{" "}
                                      {catAttribute?.importance}
                                    </p>
                                  )}

                                  {catAttribute?.good_value && (
                                    <p className="mb-2">
                                      <b>
                                        {productPhaseData &&
                                          productPhaseData?.good_value_text}
                                        :{" "}
                                      </b>{" "}
                                      {catAttribute?.good_value}
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                          </th>
                          {addAsterisksToTopValue(
                            defaultNo,
                            category,
                            catAttribute,
                            isHiddenShow
                          )}
                        </tr>
                      );
                    })}

                  {!isHiddenTop &&
                    isHiddenShow &&
                    category.attributes.length > initialNoOfAttributes && (
                      <tr className="text-center show_more_row">
                        <td colSpan="6">
                          <span
                            className="show_more"
                            onClick={() =>
                              handleShowAllAttributes(category.name)
                            }
                          >
                            {productPhaseData && productPhaseData?.show_all}{" "}
                            <i className="ri-add-line"></i>{" "}
                          </span>
                        </td>
                      </tr>
                    )}

                  {/* shpow more end  */}
                </Fragment>
              );
            })}
          </tbody>
        </Table>

        {fullTable == 2 && (
          <div className="text-center">
            <Button className="see_all_btn_outline" onClick={handleTableShow}>
              {/* {(productPhaseData)} */}
              {productPhaseData && productPhaseData?.see_full_table}{" "}
              <i className="ri-arrow-down-s-line"></i>
            </Button>
          </div>
        )}

        <span id="h2"></span>
      </div>
    );
  }
);
//check
ProductCompareTable.displayName = "CompareTable";
export default ProductCompareTable;
