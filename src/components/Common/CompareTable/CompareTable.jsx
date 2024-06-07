/* eslint-disable @next/next/no-img-element */
import React, { useRef, useState, useEffect, Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button, Table } from "react-bootstrap";
import QuestionIcon from "../../Svg/QuestionIcon";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import ProsConsToolTip from "../../Svg/ProsConsToolTip";
import { useRouter } from "next/navigation";
import Rating from "../Rating/Rating";

const CompareTable = React.memo(
  ({ products, categoryAttributes, slug, guidePhraseData }) => {
    const router = useRouter();
    let initialNoOfCategories = 5;
    const [pagination, setPagination] = useState({});
    const defaultNo = 5;
    const [fullTable, setFullTable] = useState(2);

    // this for function for Table product sticky (Start)
    const [winPos, setWinPos] = useState(false);
    const [stickyWith, setStickyWidth] = useState(true);
    const useDetectSticky = (ref, observerSettings = { threshold: [1] }) => {
      const [isSticky, setIsSticky] = useState(false);
      const newRef = useRef();
      ref ||= newRef;

      //  (guidePhraseData,"check guide")
      // mount

      useEffect(() => {
        const cachedRef = ref.current,
          observer = new IntersectionObserver(
            ([e]) => setIsSticky(e.intersectionRatio < 1),
            observerSettings
          );
        observer.observe(cachedRef);
        return () => {
          observer.unobserve(cachedRef);
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
      };
    }
    const [isSticky, ref] = useDetectSticky();
    // this for function for Table product sticky (End)

    const productsWithAttributeGroup = {};
    products?.forEach((product) => {
      const productCopy = { ...product };
      const productAttributes = {};
      product?.attributes
        ?.sort(
          (a, b) =>
            a?.attribute_category_position - b?.attribute_category_position
        )
        ?.forEach((attribute) => {
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
    // (finalProducts);

    const getValue = (arr, attribute) => {
      const foundElement = arr.find((obj) => obj.attribute === attribute);
      if (foundElement) {
        return foundElement.attribute_value;
      }
      return null;
    };
    const [showAllAttributes, setShowAllAttributes] = useState({});

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
            (obj) => obj.attribute === catAttribute.name
          )
        );
      const arrayOfObjects = [...filterData];
      let numericValues = [];

      numericValues = arrayOfObjects
        .map((obj) => {
          if (!isNaN(parseFloat(obj?.attribute_value))) {
            return parseFloat(obj?.attribute_value);
          } else {
            return obj?.attribute_value;
          }
        })
        .filter((value) => !isNaN(value));

      if (arrayOfObjects?.[0]?.algorithm == "highest_to_lowest") {
        numericValues.sort((a, b) => b - a);
      } else if (arrayOfObjects?.[0]?.algorithm == "absolute_value") {
        numericValues.sort((a, b) => b - a);
      } else {
        numericValues.sort((a, b) => a - b);
      }
      // (numericValues, arrayOfObjects[0]?.attribute, "numericValues");
      // Adding logic for String case
      if (numericValues.length === 0) {
        // const stringArray = arrayOfObjects.map((obj) => obj?.attribute_value);
        const starValue = arrayOfObjects.filter((obj) => obj?.star === true);
        const stringArray = arrayOfObjects.map((obj) => {
          if (obj?.star && obj?.attribute_value !== "no") {
            return obj?.attribute_value + "*";
          } else {
            return obj?.attribute_value;
          }
        });
        // (stringArray, "hello");
        // (
        //   stringArray,
        //   arrayOfObjects,
        //   arrayOfObjects[0]?.attribute,
        //   "neetx"
        // );

        if (arrayOfObjects?.[0]?.algorithm === "absolute_value") {
          // (stringArray[0], "neetx", "");
          // const targetString =
          //   stringArray[0] === "yes"
          //     ? "yes"
          //     : "no" || stringArray[0] === "no"
          //     ? " "
          //     : starValue[0]?.attribute_value;
          // // (targetString, "neet");
          // (targetString);
          numericValues = stringArray;
          // numericValues = stringArray.filter((value, index) => index === 0);
          // (numericValues, "neetx");

          // (numericValues, arrayOfObjects[0]?.attribute, "neet");
        }
      }
      const topValue = numericValues[0];
      // (topValue, typeof topValue === "string", arrayOfObjects[0]?.attribute,"neet");
      const occurrences = numericValues?.filter(
        (value) => value === topValue
      ).length;

      //  if (occurrences === 1 || occurrences === 2)
      arrayOfObjects.forEach((obj) => {
        obj?.star &&
          obj.attribute_value !== "?" &&
          obj.attribute_value !== "-" &&
          (obj.attribute_value = obj?.attribute_value + "⭐");
      });
      // if (occurrences === 1) {
      //   arrayOfObjects.forEach((obj) => {
      //     const numericValue =
      //       typeof topValue === "string"
      //         ? obj.attribute_value
      //         : parseFloat(obj.attribute_value);
      //     // (numericValue, "neet");
      //     if (
      //       numericValue === topValue &&
      //       !obj.attribute_value?.includes("⭐")
      //     ) {
      //       obj.attribute_value += "⭐";
      //     }
      //   });
      // }
      // (arrayOfObjects,"neet")

      // Adjust this function according to your context as I don't have the complete code
      // It would be good to ensure that you have the required variables (finalProducts) in scope.

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
                      {" "}
                      {item?.attribute_value} {item?.unit ? item?.unit : ""}
                    </>
                  )}
                </>
              )}
            </td>
          ))}
        </>
      );
    };

    //if value is an integer and not equal to 10, add decimal that value
    const formatValue = (value) => {
      if (value % 1 === 0 && value !== 10) {
        return `${value}.0`;
      }
      return value;
    };

    // add start on Table
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

    const conditionClassName = winPos
      ? stickyWith
        ? "isSticky widthFull" // Both winPos and stickyWith are true
        : "isSticky" // Only winPos is true
      : "nonSticky";
    const EvalutionalTitle = finalProducts?.area_evaluation?.map((p) =>
      p?.area_evaluation?.map((d) => d.value)
    );

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
          <thead id="testone" className={conditionClassName} ref={ref}>
            <tr className="">
              <th></th>
              {finalProducts.slice(0, defaultNo).map((product, index) => {
                return (
                  <th key={index}>
                    {/* {(product)} */}
                    {product?.assigned_title && (
                      <span className="best-tag-product">
                        {product?.assigned_title}
                      </span>
                    )}

                    <p className="device-name">
                      {/* {  ((product))} */}
                      <span>{index + 1}</span>
                      <a
                        href={`/${product?.category_url}/${product?.permalink}`}
                      ></a>
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
                          <ul className="best-list-item d-none">
                            {" "}
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
                                ?.slice(0, 1)
                                ?.map((data, dIndex) => {
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
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody id="tbody">
            <tr className="">
              <th>
                <p>{(guidePhraseData && guidePhraseData?.image) || "Image"}</p>
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
                <p>{guidePhraseData && guidePhraseData?.price}</p>
              </th>
              {finalProducts.slice(0, defaultNo).map((product, priceIndex) => {
                return (
                  <td
                    key={priceIndex}
                    className={`${priceIndex}-class table-amazon-section`}
                  >
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
                                            onClick={() =>
                                              window.open(
                                                `/link?p=${btoa(data.url)}`,
                                                "_blank"
                                              )
                                            }
                                            href="#"
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
                                            <Link
                                              rel="noopener noreferrer"
                                              target="_blank"
                                              href={`/link?p=${btoa(data.url)}`}
                                              className="font__16__inline"
                                            >
                                              {data?.price} {product?.currency}
                                            </Link>
                                          </span>
                                        </>
                                      </li>
                                    )}
                                  </React.Fragment>
                                );
                              })}
                          </ul>
                        )}
                    </div>
                  </td>
                );
              })}
            </tr>

            <tr className="tr-bg-color">
              <th className="sub-inner-padding">
                <div className="tooltip-title">
                  {guidePhraseData && guidePhraseData?.overall_score}
                  {products &&
                    products.length > 0 &&
                    products[0]?.overall_score_descriptions && (
                      <div className="tooltip-display-content">
                        {products[0]?.overall_score_descriptions
                          ?.description && (
                          <p className="mb-2">
                            <b>
                              {guidePhraseData && guidePhraseData?.what_it_is}:{" "}
                            </b>{" "}
                            {
                              products[0]?.overall_score_descriptions
                                ?.description
                            }
                          </p>
                        )}
                        {products[0]?.overall_score_descriptions
                          ?.when_matters && (
                          <p className="mb-2">
                            <b>
                              {guidePhraseData &&
                                guidePhraseData?.when_it_matters}
                              :{" "}
                            </b>{" "}
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
                  {guidePhraseData && guidePhraseData?.technical_score}
                  {products &&
                    products.length > 0 &&
                    products[0]?.technical_score_descriptions && (
                      <div className="tooltip-display-content">
                        {products[0]?.technical_score_descriptions
                          ?.description && (
                          <p className="mb-2">
                            <b>
                              {guidePhraseData && guidePhraseData?.what_it_is}:{" "}
                            </b>{" "}
                            {
                              products[0]?.technical_score_descriptions
                                ?.description
                            }
                          </p>
                        )}
                        {products[0]?.technical_score_descriptions
                          ?.when_matters && (
                          <p className="mb-2">
                            <b>
                              {guidePhraseData &&
                                guidePhraseData?.when_it_matters}
                              :{" "}
                            </b>{" "}
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
                  {guidePhraseData && guidePhraseData?.users_ratings}
                  {products &&
                    products.length > 0 &&
                    products[0]?.users_rating_descriptions && (
                      <div className="tooltip-display-content">
                        {products[0]?.users_rating_descriptions
                          ?.description && (
                          <p className="mb-2">
                            <b>
                              {guidePhraseData && guidePhraseData?.what_it_is}:{" "}
                            </b>
                            {
                              products[0]?.users_rating_descriptions
                                ?.description
                            }
                          </p>
                        )}
                        <p className="mb-2">
                          <b>{guidePhraseData?.when_it_matters}: </b>
                          {products[0]?.users_rating_descriptions?.when_matters}
                        </p>

                        {/* <p>
                          <b>
                            {products[0] && guidePhraseData?.score_components}:
                          </b>
                        </p>
                        {products[0]?.users_rating_descriptions
                          ?.score_components &&
                          products[0]?.users_rating_descriptions?.score_components?.map(
                            (data, index) => {
                              return (
                                <div className="scroe_section" key={index}>
                                  <p className="text-end">
                                    {`${parseFloat(data?.importance).toFixed(
                                      1
                                    )}%`}
                                  </p>
                                  <div
                                    className="score-count"
                                    style={{
                                      background:
                                        data?.attribute_evaluation >= 7.5
                                          ? "#093673"
                                          : data?.attribute_evaluation >= 5 &&
                                            data?.attribute_evaluation < 7.5
                                          ? "#437ECE"
                                          : "#85B2F1",
                                    }}
                                  >
                                    {data?.attribute_evaluation != null
                                      ? data?.attribute_evaluation >= 10
                                        ? Math.trunc(data?.attribute_evaluation)
                                        : data?.attribute_evaluation.toFixed(1)
                                      : "0.0"}
                                  </div>
                                  <p>{data?.attribute_category}</p>
                                </div>
                              );
                            }
                          )} */}

                        {/* <b>{guidePhraseData?.users_ratings}</b>
                        {products[0]?.users_rating_descriptions
                          ?.reviews_websites &&
                          products[0]?.users_rating_descriptions?.reviews_websites?.map(
                            (data, index) => {
                              return (
                                <>
                                  <div className="rating__section">
                                    <img
                                      src={`${data?.logo}`}
                                      alt={data?.alt}
                                    />
                                    <div className="rating__content">
                                      <b>{formatValue(data?.rating)}</b>
                                      <Rating value={data?.rating} />
                                      <small>
                                        {" "}
                                        <a href={`/link?p=${btoa(data.url)}`}>
                                          ({data?.reviews})
                                        </a>{" "}
                                      </small>
                                    </div>
                                  </div>
                                </>
                              );
                            }
                          )} */}
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

            {finalProducts.some(
              (product) => product.expert_reviews_rating !== 0
            ) && (
              <tr className="">
                <th className="sub-inner-padding">
                  <div className="tooltip-title">
                    Expert Reviews
                    <div className="tooltip-display-content">
                      {products[0]?.expert_reviews_descriptions
                        ?.description && (
                        <p className="mb-2">
                          <b>
                            {guidePhraseData && guidePhraseData?.what_it_is}:{" "}
                          </b>{" "}
                          {
                            products[0]?.expert_reviews_descriptions
                              ?.description
                          }
                        </p>
                      )}

                      <p className="mb-2">
                        <b>
                          {guidePhraseData && guidePhraseData?.when_it_matters}:{" "}
                        </b>{" "}
                        {products[0]?.expert_reviews_descriptions?.when_matters}
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
                  {guidePhraseData && guidePhraseData?.popularity}
                  {products && products[0]?.popularity_descriptions && (
                    <div className="tooltip-display-content">
                      {products[0]?.popularity_descriptions?.description && (
                        <p className="mb-2">
                          <b>
                            {guidePhraseData && guidePhraseData?.what_it_is}:{" "}
                          </b>{" "}
                          {products[0]?.popularity_descriptions?.description}
                        </p>
                      )}

                      <p className="mb-2">
                        <b>
                          {guidePhraseData && guidePhraseData?.when_it_matters}:{" "}
                        </b>{" "}
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
                  {guidePhraseData &&
                    guidePhraseData?.ratio_quality_price_points}
                  {products?.[0]?.ratio_qulitiy_points_descriptions && (
                    <div className="tooltip-display-content">
                      {products?.[0]?.ratio_qulitiy_points_descriptions
                        ?.description && (
                        <p className="mb-2">
                          <b>
                            {guidePhraseData &&
                              guidePhraseData?.when_it_matters}
                            :{" "}
                          </b>{" "}
                          {
                            products[0]?.ratio_qulitiy_points_descriptions
                              ?.description
                          }
                        </p>
                      )}
                      {products[0]?.ratio_qulitiy_points_descriptions
                        ?.when_matters && (
                        <p className="mb-2">
                          <b>
                            {guidePhraseData &&
                              guidePhraseData?.when_it_matters}
                            :{" "}
                          </b>{" "}
                          {
                            products[0]?.ratio_qulitiy_points_descriptions
                              ?.when_matters
                          }
                        </p>
                      )}
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
            {products?.[0]?.area_evaluation?.map((data, index) => {
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
                  {/* { (data)} */}
                  <th className="sub-inner-padding">
                    <div className="tooltip-title">
                      {data?.title}
                      <div className="tooltip-display-content">
                        {
                          <p className="mb-2">
                            <b>
                              {products[0] && guidePhraseData?.what_it_is} :{" "}
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
                        {value}
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
            {/* {(categoryAttributes)} */}

            {categoryAttributes?.map((category, categoryIndex) => {
              const isHiddenTop = fullTable === 2 && categoryIndex >= 2;
              let isHiddenShow = true;
              return (
                <Fragment key={categoryIndex}>
                  {/* ${
                      isHiddenTop ? "display_none" : "display_block"
                    }`*/}
                  <tr
                    className={`tr-bg-color  ${
                      isHiddenTop ? "display_none" : "display_block"
                    } `}
                  >
                    <th>
                      <div className="tooltip-title">
                        {category.name}
                        {(category.description || category.when_matters) && (
                          <div className="tooltip-display-content">
                            {category?.description && (
                              <p className="mb-2">
                                <b>
                                  {guidePhraseData &&
                                    guidePhraseData?.when_it_matters}
                                  :{" "}
                                </b>
                                {category?.description}
                              </p>
                            )}

                            {category?.when_matters && (
                              <p className="mb-2">
                                <b>
                                  {guidePhraseData &&
                                    guidePhraseData?.when_it_matters}
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
                                  product.attributes[category.name] &&
                                  product.attributes[category.name].length >
                                    0 &&
                                  product.attributes[
                                    category.name
                                  ]?.[0].attribute_evaluation?.toFixed(1) >= 7.5
                                    ? "#093673"
                                    : product.attributes[
                                        category.name
                                      ]?.[0].attribute_evaluation?.toFixed(1) >=
                                        5 &&
                                      product.attributes[
                                        category.name
                                      ]?.[0].attribute_evaluation?.toFixed(1) <
                                        7.5
                                    ? "#437ECE"
                                    : " #85B2F1",
                              }}
                            >
                              {/* {(product.attributes[category.name].unit && product.attributes[category.name].unit )} */}
                              {product.attributes[
                                category.name
                              ]?.[0]?.attribute_evaluation?.toFixed(1)}{" "}
                            </span>
                          </td>
                        );
                      })}
                  </tr>
                  {/* {(category.attributes)} */}
                  {category.attributes
                    ?.sort((a, b) => a.position - b.position)
                    ?.map((catAttribute, catAttributeIndex) => {
                      isHiddenShow =
                        !showAllAttributes[category.name] &&
                        catAttributeIndex >= initialNoOfCategories;
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
                                        {guidePhraseData &&
                                          guidePhraseData?.what_it_is}
                                        :{" "}
                                      </b>
                                      {catAttribute?.description}
                                    </p>
                                  )}

                                  {catAttribute?.when_matters && (
                                    <p className="mb-2">
                                      <b>
                                        {guidePhraseData &&
                                          guidePhraseData?.when_it_matters}
                                        :{" "}
                                      </b>{" "}
                                      {catAttribute?.when_matters}
                                    </p>
                                  )}

                                  {catAttribute?.importance && (
                                    <p className="mb-2">
                                      <b>
                                        {guidePhraseData &&
                                          guidePhraseData?.importance_text}
                                        :{" "}
                                      </b>{" "}
                                      {catAttribute?.importance}
                                    </p>
                                  )}

                                  {catAttribute?.good_value && (
                                    <p className="mb-2">
                                      <b>
                                        {guidePhraseData &&
                                          guidePhraseData?.good_value_text}
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
                    category.attributes.length > initialNoOfCategories && (
                      <tr className="text-center show_more_row">
                        <td colSpan="6">
                          <span
                            className="show_more"
                            onClick={() =>
                              handleShowAllAttributes(category.name)
                            }
                          >
                            {guidePhraseData && guidePhraseData?.show_all}{" "}
                            <i className="ri-add-line"></i>{" "}
                          </span>
                        </td>
                      </tr>
                    )}
                </Fragment>
              );
            })}
          </tbody>
        </Table>
        {fullTable == 2 && (
          <div className="text-center">
            <Button className="see_all_btn_outline" onClick={handleTableShow}>
              {guidePhraseData && guidePhraseData?.see_full_table}{" "}
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
CompareTable.displayName = "CompareTable";
export default CompareTable;
