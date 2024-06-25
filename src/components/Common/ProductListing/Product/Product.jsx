/* eslint-disable @next/next/no-img-element */
import React, { useState, Fragment, useEffect, useRef, version } from "react";
import {
  Accordion,
  Col,
  Row,
  Button,
  Form,
  Container,
  useAccordionButton,
} from "react-bootstrap";
import QuestionIcon from "../../../Svg/QuestionIcon";
import Questiontool from "../../../Svg/Questiontool";
import ProsConsToolTip from "../../../Svg/ProsConsToolTip";
import RightPointingArrow from "../../../Svg/RightPointingArrow";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {
  removeDecimalAboveNine,
  capitalize,
  getAttributeHalf,
} from "@/_helpers/filter";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import {
  addCompareProduct,
  addCompareProductForGuide,
  updateCompareProduct,
} from "@/redux/features/compareProduct/compareProSlice";
import toast, { Toaster } from "react-hot-toast";
import Rating from "../../Rating/Rating";
import Tested from "../../Tested/Tested";
import useScreenSize from "@/_helpers/useScreenSize";
import axios from "axios";
import Loader from "@/app/_components/Loader";
import ProductSkeleton from "../ProductSkeleton";
export default function Product({
  position,
  incomingProduct,
  handleToggleCollapse,
  handleManageCollapsedDiv,
  guidePhraseData,
  KeyIndex,
  text_before_listing,
  slug,
  order,
  searchParams,
  productPagination,
  productPhaseData,
}) {
  const dispatch = useDispatch();
  const [isHovered, setIsHovered] = useState(false);
  const { isMobile } = useScreenSize();
  const product = incomingProduct;
  let initialDisplay = 5;
  const [displayedAttributesCount, setDisplayedAttributesCount] = useState({});
  const [loading, setloading] = useState(false);
  const [showFullSummary, setShowFullSummary] = useState(false);
  const toggleSummary = () => {
    setShowFullSummary(!showFullSummary);
  };
  const [showFullData, setShowFullData] = useState(false);
  const toggleShowFullData = () => {
    setShowFullData(!showFullData);
  };
  const [bar, setBar] = useState({ isHidden: false });
  function toggleHidden() {
    setBar({ isHidden: !bar.isHidden });
  }

  const handleDisplayedAttributesCount = (productName, attrName) => {
    let obj = { ...displayedAttributesCount };
    if (!obj[productName]) {
      obj[productName] = {};
    }
    if (!obj[productName][attrName]) {
      obj[productName][attrName] = 5;
    }
    let updatedPage =
      obj[productName][attrName] + initialDisplay || initialDisplay * 2;

    setDisplayedAttributesCount({
      [productName]: { [attrName]: updatedPage },
    });
  };
  // max-cahcaracter
  // overallScore color by its number of scores
  const getColorBasedOnScore = (score) => {
    if (score >= 7.5) {
      return "#093673";
    } else if (score >= 5 && score < 7.5) {
      return "#437ECE";
    } else {
      return "#85B2F1";
    }
  };
  const overallScoreColor = getColorBasedOnScore(
    removeDecimalAboveNine(incomingProduct?.overall_score)
  );
  const technicalScoreColor = getColorBasedOnScore(
    incomingProduct?.technical_score
  );
  const userRatingColor = getColorBasedOnScore(incomingProduct?.reviews);
  const popularityColor = getColorBasedOnScore(
    incomingProduct?.ratio_quality_price_points
  );

  const ratioQualityColor = getColorBasedOnScore(
    incomingProduct?.ratio_quality_price_points
  );

  // filter a value which numeric or string
  const renderValue = (item) => {
    const numericValue = parseFloat(item?.value);
    // console.log(numericValue)

    if (!isNaN(numericValue)) {
      return `(${numericValue}${item.unit ? " " + item.unit : ""})`;
    } else {
      return item?.value === undefined ||
        item?.value === "" ||
        item?.value === null
        ? ""
        : `(${item?.value})`;
    }
  };

  const getColorAttr = (attributeValues) => {
    if (
      attributeValues.attribute_value == guidePhraseData?.yes ||
      attributeValues.attribute_value == guidePhraseData?.no
    ) {
      if (attributeValues?.is_worse_than?.toFixed(1) >= 0.6) {
        return "#ce434b";
      } else if (attributeValues?.is_better_than?.toFixed(1) >= 0.6) {
        return "#0066b2";
      } else {
        return "#000";
      }
    } else {
      return "#000";
    }
  };
  const reduxData = useSelector((state) => state.comparePro.compareProduct)[0];
  // (guideComparePro?.length, "checkRedux");
  const handleComparedProduct = (product, position) => {
    if (
      reduxData === undefined ||
      reduxData === null ||
      reduxData?.productFirst === null
    ) {
      let productData = {
        id: position,
        name: product.name,
        delete_key: "productFirst",
        category: product.category_id,
        category_url: product.category_url,
        permalink: product.permalink,
        image: product.main_image ? product.main_image : "/images/nofound.png",
      };
      dispatch(
        addCompareProduct({
          productFirst: productData,
          productSecond: null,
          productThird: null,
          category: product.category_id,
          location: "ON_GUIDE",
        })
      );
      return;
    }
    if (
      reduxData?.productFirst !== null &&
      reduxData?.productSecond === null &&
      reduxData?.productThird === null
    ) {
      if (reduxData?.productFirst?.permalink === product.permalink) {
        toast.error("This product has already been added to compare list.");
        return;
      }
      let productData = {
        id: position,
        name: product.name,
        delete_key: "productSecond",
        category: product.category_id,
        category_url: product.category_url,
        permalink: product.permalink,
        image: product.main_image ? product.main_image : "/images/nofound.png",
      };
      dispatch(
        updateCompareProduct({
          key: "productSecond",
          data: productData,
        })
      );
      return;
    }
    if (
      reduxData?.productThird === null &&
      reduxData?.productFirst !== null &&
      reduxData?.productSecond !== null
    ) {
      if (
        reduxData?.productFirst?.permalink === product.permalink ||
        reduxData?.productSecond?.permalink === product.permalink
      ) {
        toast.error("This product has already been added to compare list.");
        return;
      }
      let productData = {
        id: position,
        name: product.name,
        delete_key: "productThird",
        category_id: product.category_id,
        category_url: product.category_url,
        permalink: product.permalink,
        image: product.main_image ? product.main_image : "/images/nofound.png",
      };
      dispatch(
        updateCompareProduct({
          key: "productThird",
          data: productData,
        })
      );
      return;
    }
    if (
      reduxData?.productFirst !== null &&
      reduxData?.productSecond !== null &&
      reduxData?.productThird !== null
    ) {
      return toast.error("Maximum 3 products can be compared.");
    }
  };

  //if value is an integer and not equal to 10, add decimal that value
  const formatValue = (value) => {
    if (value % 1 === 0 && value !== 10) {
      return `${value}.0`;
    }
    return value;
  };
  // (product)
  const filteredTech_data = incomingProduct?.tech_data?.filter(
    (item) => item?.permalink === slug
  );

  //
  const [splitData, setSplitData] = useState([]);

  useEffect(() => {
    const currentUrl = new URL(window.location.href);
    const searchParam = new URLSearchParams(currentUrl.search);
    const variantValue = searchParam.get("variant");
    const sortValue = searchParam.get("sort");

    setSplitData(sortValue?.split(","));
  }, [order]);

  const [width, setWidth] = useState(0);
  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  let result = width - 250;
  let finalvalue = result / 2 - 250;
  // (finalvalue, "test")

  // useEffect(() => {
  //   const currentUrl = new URL(window.location.href);
  //   const searchParam = new URLSearchParams(currentUrl.search);
  //   const variantValue = searchParam.get("variant");
  //   const sortValue = searchParam.get("sort");

  //   // (splitData);
  // });
  // (splitData);
  // (text_before_listing, "neet");
  const extractDomainName = (url) => {
    const domain = url
      .replace("https://", "")
      .replace("http://", "")
      .replace("www.", "")
      .split(/[/?#]/)[0];
    return domain;
  };

  // There I use show all button to show all product attributes and hide all button to hide all product attributes by hit API call

  const [productData, setProductData] = useState(null);
  const [productID, setProductID] = useState(null);
  const [categoryID, setCategoryID] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  // (productData, "neet");

  const generateProductsWithAttributes = () => {
    const productAttributes = {};
    if (productData && productData.attributes) {
      productData.attributes
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
      // Update the original product object
      productData.attributes_new = productAttributes;

      return productData;
    }
  };

  const attributesClearly = generateProductsWithAttributes();
  // (attributesClearly, "neet");
  const fetchProductData = async (productId, productCategory) => {
    // (producnctId, productCategory);
    setIsLoading(true);
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/guide/attributes-data/${productCategory}/${productId}`,
        {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
          },
        }
      );

      if (res.status === 200) {
        const data = res.data?.data;
        setProductData(data);
      } else {
        console.error("Failed to fetch product data");
      }
    } catch (error) {
      console.error("Error fetching product data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowAllClick = async (productId, productCategory) => {
    // (productId, productCategory, "dataID");

    await fetchProductData(productId, productCategory);
  };
  // const decoratedOnClick = useAccordionButton(1, () =>
  //   ('totally custom!'),
  // );
  // (productData, "neet");
  // useEffect(() => {
  //   // (searchParams, "change alert");
  //   setProductData(null);
  //   document
  //     .querySelectorAll(".accordion-button:not(.collapsed)")
  //     .forEach((button) => {
  //       button.click(); // Simulate a click on non-collapsed buttons to collapse them
  //     });
  //   // document.querySelectorAll(".accordion-button").forEach((button) => {
  //   //   button.classList.add("collapsed");
  //   // });
  // }, [searchParams]);

  // (productPhaseData,"check");
  // (productPagination)
  return (
    <Fragment>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="best-product-listing">
        <div className="flex-box">
          <div className="left_box">
            <span className="ribbon-number">
              {/* {(product?.price_websites?.length)} */}
              {/* {product?.price_websites?.length > 0 ? <p>{KeyIndex + 1}</p> : ""} */}
              {splitData?.[0] === "available" ||
              (product?.price_websites?.length > 0 && KeyIndex !== null) ? (
                <p>
                  {(productPagination?.current_page - 1) *
                    productPagination?.per_page +
                    KeyIndex +
                    1}
                </p>
              ) : null}

              {/* <p>{position}</p> */}

              <RightPointingArrow />
            </span>
            <h2 className="box_content light-bg-color">
              <a
                href={`/${product?.category_url}/${product?.permalink}`}
                style={{ color: "#27304E" }}
              >
                {splitData?.[0] === "available" ||
                (product?.price_websites?.length > 0 && KeyIndex !== null) ? (
                  <span className="d-none">
                    {(productPagination?.current_page - 1) *
                      productPagination?.per_page +
                      KeyIndex +
                      1}
                    .
                  </span>
                ) : null}{" "}
                {product?.name}
              </a>
            </h2>
          </div>
          {/* {(product?.assigned_title)} */}
          {product?.assigned_title && (
            <span className="best-tag-product">{product?.assigned_title}</span>
          )}
        </div>
        {/* {console.log(guidePhraseData?.yes)} */}
        <Row className="m-0">
          <Col
            md={12}
            lg={3}
            xl={2}
            className="border-right p-0 product-listing-width-20"
          >
            <span
              className="compare-section-plus"
              onClick={(e) => {
                // handleToggleCollapse(e);
                handleManageCollapsedDiv(e);
                handleComparedProduct(product, position);
              }}
            >
              <i className="ri-add-fill"></i>
              <p className="compare-text">
                {guidePhraseData && guidePhraseData?.add_to_comparison}
              </p>
            </span>
            <img
              className="compare_image"
              src={
                product?.main_image
                  ? product?.main_image
                  : "/images/nofound.png"
              }
              alt={`${product?.permalink}`}
              sizes="100%"
            />
            {product?.is_tested && (
              <div className="guide-page-tested">
                <Tested />
              </div>
            )}
          </Col>
          <Col md={12} lg={9} xl={10} className="p-0 product-listing-width-80">
            <div className="product-listing-inner-content">
              <div className="col light-bg-color">
                <div className="product-score-container">
                  <div className="score-section">
                    <span
                      className="count"
                      style={{ background: overallScoreColor }}
                    >
                      {formatValue(product.overall_score)}
                    </span>
                    {product?.overall_score_descriptions && (
                      <div className="score-detail tooltip-title">
                        <span
                          className="overall"
                          style={{ color: "rgb(39 48 78 / 90%)" }}
                        >
                          {/* {(guidePhraseData)} */}
                          {guidePhraseData && guidePhraseData?.overall_score}
                        </span>
                        <div
                          className="tooltip-display-content"
                          style={{
                            left: isMobile ? "50%" : 0,
                            // transform: isMobile
                            //   ? "translateX(-40%)"
                            //   : "translateX(-10%)",
                            width: isMobile ? "250px" : "250px",
                          }}
                        >
                          {product?.overall_score_descriptions.description && (
                            <p className="mb-2">
                              <b>
                                {guidePhraseData && guidePhraseData?.what_it_is}
                                :{" "}
                              </b>
                              {product?.overall_score_descriptions?.description}
                            </p>
                          )}
                          {product?.overall_score_descriptions.when_matters && (
                            <p className="mb-2">
                              <b>
                                {guidePhraseData &&
                                  guidePhraseData?.when_it_matters}
                                :{" "}
                              </b>
                              {
                                product?.overall_score_descriptions
                                  ?.when_matters
                              }
                            </p>
                          )}
                          {/* {product?.overall_score_descriptions.good_value && (
                            <p className="mb-2">
                              <b>
                                {guidePhraseData &&
                                  guidePhraseData?.when_it_matters}
                                :{" "}
                              </b>
                              {
                                product?.overall_score_descriptions
                                  ?.when_matters
                              }
                            </p>
                          )} */}
                          <p>
                            <b>
                              {guidePhraseData &&
                                guidePhraseData?.score_components}
                              :
                            </b>
                          </p>
                          {product.overall_score_descriptions
                            .score_components &&
                            product.overall_score_descriptions.score_components?.map(
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
                                          ? formatValue(
                                              Math.trunc(
                                                data?.attribute_evaluation
                                              )
                                            )
                                          : data?.attribute_evaluation.toFixed(
                                              1
                                            )
                                        : "0.0"}
                                    </div>
                                    <p>{data?.attribute_category}</p>
                                  </div>
                                );
                              }
                            )}
                        </div>
                      </div>
                    )}
                  </div>
                  {/* Technical Score start*/}
                  <div className="score-section">
                    <span
                      className="count"
                      style={{ background: technicalScoreColor }}
                    >
                      {product.technical_score != null
                        ? product.technical_score >= 10
                          ? Math.trunc(product.technical_score)
                          : product.technical_score.toFixed(1)
                        : "0.0"}
                    </span>
                    {product?.technical_score_descriptions && (
                      <div className="score-detail tooltip-title">
                        <span>
                          {guidePhraseData && guidePhraseData?.technical_score}
                        </span>
                        <div
                          className="tooltip-display-content"
                          style={{
                            left: isMobile ? "50%" : 0,
                            // transform: isMobile
                            //   ? "translateX(-40%)"
                            //   : "translateX(-10%)",
                            width: isMobile ? "250px" : "250px",
                          }}
                        >
                          {product?.technical_score_descriptions
                            .description && (
                            <p className="mb-2">
                              <b>
                                {guidePhraseData && guidePhraseData?.what_it_is}
                                :{" "}
                              </b>
                              {
                                product?.technical_score_descriptions
                                  ?.description
                              }
                            </p>
                          )}
                          {product?.technical_score_descriptions
                            .when_matters && (
                            <p className="mb-2">
                              <b>
                                {guidePhraseData &&
                                  guidePhraseData?.when_it_matters}
                                :{" "}
                              </b>
                              {
                                product?.technical_score_descriptions
                                  ?.when_matters
                              }
                            </p>
                          )}
                          <p>
                            <b>
                              {guidePhraseData &&
                                guidePhraseData?.score_components}
                              :
                            </b>
                          </p>
                          {product?.technical_score_descriptions
                            .score_components &&
                            product?.technical_score_descriptions?.score_components?.map(
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
                                          ? formatValue(
                                              Math.trunc(
                                                data?.attribute_evaluation
                                              )
                                            )
                                          : data?.attribute_evaluation.toFixed(
                                              1
                                            )
                                        : "0.0"}
                                    </div>
                                    <p>{data?.attribute_category}</p>
                                  </div>
                                );
                              }
                            )}
                        </div>
                      </div>
                    )}
                  </div>
                  {/* Technical Score end*/}
                  {/* User's Rating start*/}
                  <div className="score-section">
                    <span
                      className="count"
                      style={{ background: userRatingColor }}
                    >
                      {product.reviews != null
                        ? product.reviews >= 10
                          ? Math.trunc(product.reviews)
                          : product.reviews.toFixed(1)
                        : "0.0"}
                    </span>
                    {product?.users_rating_descriptions && (
                      <div className="score-detail tooltip-title">
                        <span>
                          {" "}
                          {guidePhraseData && guidePhraseData?.users_ratings}
                        </span>

                        <div
                          className="tooltip-display-content"
                          style={{
                            left: isMobile ? "50%" : 0,
                            // transform: isMobile
                            //   ? "translateX(-40%)"
                            //   : "translateX(-10%)",
                            width: isMobile ? "250px" : "250px",
                          }}
                        >
                          {product?.users_rating_descriptions?.description && (
                            <p className="mb-2">
                              <b>
                                {guidePhraseData && guidePhraseData?.what_it_is}
                                :{" "}
                              </b>
                              {product?.users_rating_descriptions?.description}
                            </p>
                          )}
                          {product?.users_rating_descriptions.when_matters && (
                            <p className="mb-2">
                              <b>
                                {guidePhraseData &&
                                  guidePhraseData?.when_it_matters}
                                :{" "}
                              </b>
                              {product?.users_rating_descriptions?.when_matters}
                            </p>
                          )}
                          <p>
                            <b>
                              {guidePhraseData &&
                                guidePhraseData?.score_components}
                              :
                            </b>
                          </p>
                          {product?.users_rating_descriptions
                            .score_components &&
                            product?.users_rating_descriptions.score_components?.map(
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
                                          ? formatValue(
                                              data?.attribute_evaluation
                                            )
                                          : data?.attribute_evaluation.toFixed(
                                              1
                                            )
                                        : "0.0"}
                                    </div>
                                    <p>{data?.attribute_category}</p>
                                  </div>
                                );
                              }
                            )}
                          {/* {(product)} */}
                          {product?.users_rating_descriptions?.reviews_websites
                            ?.length > 0 && (
                            <p>
                              <b>{guidePhraseData?.users_ratings}:</b>
                            </p>
                          )}

                          {product?.users_rating_descriptions
                            ?.reviews_websites &&
                            product?.users_rating_descriptions?.reviews_websites?.map(
                              (data, index) => {
                                return (
                                  <Fragment key={index}>
                                    <div className="rating__section">
                                      <img src={`${data?.logo}`} />
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
                                  </Fragment>
                                );
                              }
                            )}
                        </div>
                      </div>
                    )}
                  </div>
                  {/* User's Rating end*/}
                  {/* Popularity start */}
                  <div className="score-section">
                    <span
                      className="count"
                      style={{ background: popularityColor }}
                    >
                      {product?.ratio_quality_price_points != null
                        ? product?.ratio_quality_price_points >= 10
                          ? Math.trunc(product?.ratio_quality_price_points)
                          : formatValue(product?.ratio_quality_price_points)
                        : "0.0"}
                    </span>
                    {product?.ratio_qulitiy_points_descriptions && (
                      <div className="score-detail tooltip-title">
                        <span>
                          {guidePhraseData &&
                            guidePhraseData?.ratio_quality_price_points}
                        </span>
                        <div
                          className="tooltip-display-content"
                          style={{
                            left: isMobile ? "50%" : 0,
                            // transform: isMobile
                            //   ? "translateX(-40%)"
                            //   : "translateX(-10%)",
                            width: isMobile ? "250px" : "250px",
                          }}
                        >
                          {product?.ratio_qulitiy_points_descriptions
                            .description && (
                            <p className="mb-2">
                              <b>
                                {guidePhraseData && guidePhraseData?.what_it_is}
                                :{" "}
                              </b>
                              {
                                product?.ratio_qulitiy_points_descriptions
                                  ?.description
                              }
                            </p>
                          )}
                          {product?.ratio_qulitiy_points_descriptions
                            .when_matters && (
                            <p className="mb-2">
                              <b>
                                {guidePhraseData &&
                                  guidePhraseData?.when_it_matters}
                                :{" "}
                              </b>
                              {
                                product?.ratio_qulitiy_points_descriptions
                                  ?.when_matters
                              }
                            </p>
                          )}
                          <p>
                            <b>
                              {guidePhraseData &&
                                guidePhraseData?.score_components}
                              :
                            </b>
                          </p>
                          {product?.ratio_qulitiy_points_descriptions
                            .score_components &&
                            product?.ratio_qulitiy_points_descriptions?.score_components?.map(
                              (data, index) => {
                                return (
                                  <React.Fragment key={index}>
                                    <div className="scroe_section" key={index}>
                                      <p className="text-end">
                                        {`${parseFloat(
                                          data?.importance
                                        ).toFixed(1)}%`}
                                      </p>
                                      <div
                                        className="score-count"
                                        style={{
                                          background:
                                            data?.attribute_evaluation >= 7.5
                                              ? "#093673"
                                              : data?.attribute_evaluation >=
                                                  5 &&
                                                data?.attribute_evaluation < 7.5
                                              ? "#437ECE"
                                              : "#85B2F1",
                                        }}
                                      >
                                        {formatValue(
                                          data?.attribute_evaluation
                                        )}
                                        {/* {`${parseFloat(
                                                        data?.attribute_evaluation
                                                      ).toFixed(1)}`} */}
                                      </div>
                                      <p>{data?.attribute_category}</p>
                                    </div>
                                  </React.Fragment>
                                );
                              }
                            )}
                        </div>
                      </div>
                    )}
                  </div>
                  {/* Popularity Ends Here */}
                </div>
              </div>
              <div className="col">
                <div className="best-price-section">
                  {product.price_websites &&
                    product?.price_websites?.every(
                      (data) => data.price === null
                    ) && (
                      <div className="not-availabel-wrapper">
                        <div className="not-availabel">
                          <span className="txt">N/A</span>
                          <span className="guide">
                            ~ {product?.price} {product?.currency}
                          </span>
                        </div>
                      </div>
                    )}
                  {product?.price_websites &&
                    product?.price_websites?.some(
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
                                        <a
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
                                        </a>
                                        <span>
                                          <a
                                            rel="noopener noreferrer"
                                            target="_blank"
                                            href={`/link?p=${btoa(data.url)}`}
                                          >
                                            {Number(data?.price).toFixed(2)}{" "}
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
              </div>
              <div className="listing-container">
                <div id="pros" className="col light-bg-color guide">
                  <div className="pros-corns-section guide_pros_cons pros">
                    <p className="buy-avoid">
                      {guidePhraseData && guidePhraseData?.why_to_buy}
                    </p>
                    <ul
                      className={`pros-list ${showFullData ? "show-all" : ""}`}
                    >
                      {product &&
                        product?.top_pros?.map((data, index) => {
                          // (data, "show data")
                          return (
                            <React.Fragment key={index}>
                              <li
                                className={`${
                                  data?.hover_phrase !== "" && "tooltip-title"
                                }`}
                              >
                                {/* {(data?.comment)} */}
                                <span className="pros-crons-text">
                                  {data?.name} {renderValue(data)}
                                </span>
                                <ProsConsToolTip
                                  comment={data.comment}
                                  hover_phrase={data.hover_phrase}
                                  info_not_verified={data.info_not_verified}
                                  data={data}
                                  typeComp={`pros`}
                                />
                              </li>
                            </React.Fragment>
                          );
                        })}
                      {product?.top_pros?.length > 0 && !showFullData && "..."}
                    </ul>
                  </div>
                </div>
                <div id="cons" className="col guide">
                  <div className="pros-corns-section guide_pros_cons corns">
                    <p className="buy-avoid">
                      {" "}
                      {guidePhraseData && guidePhraseData?.why_to_avoid}
                    </p>
                    <ul
                      className={`pros-list ${showFullData ? "show-all" : ""}`}
                    >
                      {product &&
                        product?.top_cons?.map((data, index) => {
                          return (
                            <React.Fragment key={index}>
                              <li
                                className={`${
                                  data?.hover_phrase !== "" && "tooltip-title"
                                }`}
                              >
                                <span className="pros-crons-text">
                                  {/* {console.log(data?.name)} */}
                                  {data?.name} {renderValue(data).trim()}
                                </span>
                                <ProsConsToolTip
                                  comment={data.comment}
                                  hover_phrase={data.hover_phrase}
                                  info_not_verified={data.info_not_verified}
                                  data={data}
                                  typeComp={`cons`}
                                  finalvalue={finalvalue}
                                />
                              </li>
                            </React.Fragment>
                          );
                        })}
                      {product?.top_pros?.length > 0 && !showFullData && "..."}
                    </ul>
                  </div>
                </div>
                <Button className="hide-show-btn" onClick={toggleShowFullData}>
                  <i
                    className={
                      showFullData
                        ? "ri-arrow-up-s-line"
                        : "ri-arrow-down-s-line"
                    }
                  ></i>
                </Button>
              </div>
            </div>
          </Col>

          <Col md={12} className="p-0">
            <Row className="w-100 m-0 alternatives-border-top">
              <Col md={12}>
                <div className="inline-power-section w-100">
                  {/* <img
                    src="/images/double-arrow.png"
                    width={0}
                    height={0}
                    sizes="100%"
                    alt="double-arrow"
                  /> */}
                  {/* {(filteredTech_data[0]?.data)} */}

                  <ul className="badge-list-section">
                    {product?.area_evaluation?.map((data) => {
                      return (
                        <li>
                          <span
                            style={{
                              background:
                                data?.value >= 7.5
                                  ? "#093673"
                                  : data?.value >= 5 && data?.value < 7.5
                                  ? "#437ECE"
                                  : "#85B2F1",
                            }}
                          >
                            {parseFloat(data?.value).toFixed(1)}
                          </span>
                          <div className="tooltip-title">
                            {" "}
                            <div
                              className=""
                              style={{
                                fontWeight: "400",
                                color: "rgb(39 48 78 / 90%)",
                              }}
                            >
                              {data?.title}
                            </div>
                            {/*                             
                            <div
      className="tooltip-display-content why-tooltip"
      style={{ left: isMobile ? "50%" : "calc(50% - 128px)", transform: isMobile ? "translateX(-60%)" : "none" ,width:"190px"}}
    > */}
                            <div
                              className="tooltip-display-content why-tooltip"
                              style={{
                                left: isMobile ? "50%" : 0,
                                transform: isMobile
                                  ? "translateX(20%)"
                                  : "translateX(-10%)",
                                width: isMobile ? "190px" : "250px",
                              }}
                            >
                              {/* Tooltip content */}
                              {/* Tooltip content */}
                              {
                                <p className="mb-2">
                                  <b>
                                    {guidePhraseData &&
                                      guidePhraseData?.what_it_is}
                                    :{" "}
                                  </b>
                                  {data?.hover_phase?.what_is_it}
                                </p>
                              }

                              <p>
                                <b>
                                  {guidePhraseData &&
                                    guidePhraseData?.score_components}
                                  :
                                </b>
                              </p>
                              {data?.hover_phase.attributes?.map(
                                (hoverPhaseData, index) => {
                                  return (
                                    <div className="scroe_section" key={index}>
                                      <p className="text-end">
                                        {`${parseFloat(
                                          hoverPhaseData?.percentage
                                        ).toFixed(1)}%`}
                                      </p>
                                      <div
                                        className="score-count"
                                        style={{
                                          background:
                                            hoverPhaseData?.attribute_value >=
                                            7.5
                                              ? "#093673"
                                              : hoverPhaseData?.attribute_value >=
                                                  5 &&
                                                hoverPhaseData?.attribute_value <
                                                  7.5
                                              ? "#437ECE"
                                              : "#85B2F1",
                                        }}
                                      >
                                        {hoverPhaseData?.attribute_value != null
                                          ? hoverPhaseData?.attribute_value >=
                                            10
                                            ? formatValue(
                                                Math.trunc(
                                                  hoverPhaseData?.attribute_value
                                                )
                                              )
                                            : hoverPhaseData?.attribute_value
                                          : "0.0"}
                                      </div>
                                      <p>{hoverPhaseData?.attribute_name}</p>
                                    </div>
                                  );
                                }
                              )}
                              {/* {(product)} */}
                            </div>
                          </div>
                        </li>
                      );
                    })}

                    {/* <li>
                          <span>9.7</span>
                          <b>For soups</b>
                        </li> */}
                  </ul>
                </div>
              </Col>
            </Row>

            {filteredTech_data?.[0]?.data !== undefined && (
              <Row className="w-100 m-0 alternatives-border-top">
                <Col md={12}>
                  <div className="inline-power-section w-100">
                    <img
                      src="/images/double-arrow.png"
                      width={0}
                      height={0}
                      sizes="100%"
                      alt="double-arrow"
                    />
                    {/* {(filteredTech_data[0]?.data)} */}

                    <ul>
                      {filteredTech_data[0]?.data.map((data, key) => {
                        return (
                          <li key={key}>
                            {/* {(data[0])} */}
                            {data && data?.name}:
                            <i>
                              {" "}
                              {data?.value}{" "}
                              {data?.value !== "-" &&
                                data?.value !== "?" &&
                                data?.unit !== null && <>{data.unit}</>}
                            </i>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </Col>
              </Row>
            )}

            {product?.available_colors?.length !== 0 && (
              <Row className="w-100 m-0 alternatives-border-top">
                <Col lg={12} md={12} xl={12}>
                  <div className="alternatives mt-2">
                    <span>
                      {guidePhraseData && guidePhraseData?.colors_available}:
                    </span>
                    <div className="color-section">
                      {product?.available_colors?.map((data, key) => {
                        // (data);
                        // const isCurrentVersion = data.permalink === slug;
                        return (
                          <>
                            <div className="color-item" key={key}>
                              <li
                                style={{
                                  listStyleType: "none",
                                  width: "auto",
                                  padding: "0px 5px",
                                  borderRadius: "5px",
                                  cursor:
                                    data.color === product?.color
                                      ? "default"
                                      : "pointer",

                                  outline:
                                    data.color === product?.color
                                      ? "1px solid #437ed0"
                                      : "none",
                                }}
                                className="current_version_not_found"
                              >
                                {data.color === product?.color ? (
                                  <span
                                    className="color-check"
                                    style={{
                                      color: "#437ed0",
                                      padding: "0px 5px",
                                      cursor:
                                        data.color === product?.color
                                          ? "default"
                                          : "pointer",
                                    }}
                                  >
                                    {data.color}
                                  </span>
                                ) : (
                                  <a
                                    href={`/link?p=${btoa(data.url)}`}
                                    style={{
                                      color: "#437ed0",
                                      padding: "0px 5px",
                                      cursor:
                                        data.color === product?.color
                                          ? "default"
                                          : "pointer",
                                    }}
                                    className={`color-item `}
                                    // onClick={(e) => handleItemClick(key)}
                                  >
                                    {data.color}
                                  </a>
                                )}
                              </li>

                              {/* <Form.Check
                                inline
                                label={data?.short_name}
                                name="color"
                                type="radio"
                                defaultChecked={key === 0}
                                id={`inline-${data?.color}-${key}`}
                              /> */}
                            </div>
                          </>
                        );
                      })}
                    </div>
                  </div>
                </Col>
              </Row>
            )}

            {product?.available_versions &&
              product?.available_versions?.length !== 0 && (
                <Row className="w-100 m-0 alternatives-border-top">
                  <Col lg={12} md={12} xl={12}>
                    {/* {(guidePhraseData)} */}
                    <div className="alternatives mt-2">
                      <span>
                        {guidePhraseData && guidePhraseData?.versions_available}
                        :
                      </span>
                      <div className="color-section">
                        {product?.available_versions
                          ?.sort((a, b) =>
                            a.permalink === product?.permalink ? -1 : 1
                          )
                          .map((data, key) => {
                            // (data);
                            return (
                              <>
                                {data?.short_name !== null && (
                                  <div className="color-item" key={key}>
                                    <li
                                      style={{
                                        listStyleType: "none",
                                        width: "auto",
                                        padding: "0px 5px",
                                        borderRadius: "5px",
                                        cursor:
                                          data.permalink === product?.permalink
                                            ? "default"
                                            : "pointer",

                                        outline:
                                          data.permalink === product?.permalink
                                            ? "1px solid #437ed0"
                                            : "none",
                                      }}
                                      className="current_version_not_found"
                                    >
                                      {data.permalink === product?.permalink ? (
                                        <span
                                          style={{
                                            color: "#437ed0",
                                            padding: "0px 5px",
                                            borderRadius: "5px",
                                            cursor:
                                              data.permalink ===
                                              product?.permalink
                                                ? "default"
                                                : "pointer",
                                          }}
                                          className={`color-item `}
                                          // onClick={(e) => handleItemClick(key)}
                                          // onClick={(e) => handleItemClick(key)}
                                          dangerouslySetInnerHTML={{
                                            __html: data?.short_name,
                                          }}
                                        ></span>
                                      ) : (
                                        <a
                                          href={`/${data?.category_url}/${data?.permalink}`}
                                          style={{
                                            color: "#437ed0",
                                            padding: "0px 5px",
                                            borderRadius: "5px",
                                            cursor:
                                              data.permalink ===
                                              product?.permalink
                                                ? "default"
                                                : "pointer",
                                          }}
                                          className={`color-item `}
                                          // onClick={(e) => handleItemClick(key)}
                                          dangerouslySetInnerHTML={{
                                            __html: data?.short_name,
                                          }}
                                        >
                                          {/* {data?.short_name} */}
                                        </a>
                                      )}
                                    </li>
                                  </div>
                                )}
                              </>
                            );
                          })}
                      </div>
                    </div>
                  </Col>
                </Row>
              )}
            {product?.summary && product?.summary.length !== 0 && (
              <>
                <div className="w-100">
                  <p className="best-product-content border-top p-2 _html">
                    {showFullSummary ? (
                      <>
                        {product?.summary}
                        <span
                          className="read-less-more-btn"
                          style={{ paddingLeft: "5px" }}
                          onClick={toggleSummary}
                        >
                          read less
                        </span>
                      </>
                    ) : product?.summary && product?.summary?.length > 200 ? (
                      <>
                        {product?.summary?.substring(0, 200)}...
                        <span
                          className="read-less-more-btn pl-1"
                          style={{ paddingLeft: "5px" }}
                          onClick={toggleSummary}
                        >
                          read more
                        </span>
                      </>
                    ) : (
                      <>{product?.summary}</>
                    )}
                  </p>
                </div>
              </>
            )}
            <Row className="m-0">
              <Accordion className="table-accordion product-listing-inner-content-table-accordion p-0 ">
                <Accordion.Item eventKey="1" className="inner-accordion">
                  <Accordion.Header
                    as="div"
                    className="product-listing-inner-content-table-accordion-btn"
                    onClick={toggleHidden}
                  >
                    <div
                      className="show-btn"
                      onClick={() =>
                        handleShowAllClick(product?.id, product?.category_id)
                      }
                    >
                      {guidePhraseData?.show_all}{" "}
                      <i className="ri-arrow-down-s-line"></i>
                    </div>
                    <div className="hide-btn">
                      {guidePhraseData?.hide_all}{" "}
                      <i className="ri-arrow-up-s-line"></i>
                    </div>
                  </Accordion.Header>
                  {isLoading && (
                    <Skeleton
                      height={35}
                      count={
                        displayedAttributesCount[product.name] &&
                        displayedAttributesCount[product.name][attribute]
                          ? displayedAttributesCount[product.name][attribute]
                          : initialDisplay
                      }
                    />
                  )}
                  {!isLoading && productData && (
                    <Row className="m-0">
                      <Col md={12} className="p-0">
                        <Accordion.Body className="d-flex inner-accordion flex-wrap">
                          <div className="inline-ranking-section w-100">
                            <span className="ranking-heading">
                              {guidePhraseData && guidePhraseData?.in_rankings}
                            </span>
                            <img
                              src="/images/double-arrow.png"
                              width={0}
                              height={0}
                              sizes="100%"
                              alt="double-arrow"
                            />
                            <div className="ranking-item-list-sec">
                              {attributesClearly?.guide_ratings
                                .slice(0, 5)
                                ?.map((data, key) => {
                                  return (
                                    <a
                                      href={`/${data?.category_url}/${data.permalink}`}
                                      key={key}
                                    >
                                      <p>
                                        <span>
                                          #{data?.position}{" "}
                                          {guidePhraseData &&
                                            guidePhraseData?.in_text}{" "}
                                        </span>
                                        {data?.guide_short_name}
                                      </p>
                                    </a>
                                  );
                                })}
                            </div>
                          </div>
                          {/* Left According start*/}
                          <Accordion className="table-accordion w-50 p-0 left-accordion">
                            <Accordion.Item eventKey="4">
                              <Accordion.Header as="div">
                                <div className="table-accordion-header">
                                  {guidePhraseData && guidePhraseData?.overall}
                                  <Questiontool
                                    attributes={
                                      product?.overall_score_descriptions
                                    }
                                    guidePhraseData={guidePhraseData}
                                  />
                                </div>
                                <span
                                  className="count"
                                  style={{ background: overallScoreColor }}
                                >
                                  {formatValue(product?.overall_score)}
                                </span>
                                <div className="show-btn">
                                  {guidePhraseData?.show_all}{" "}
                                  <i className="ri-arrow-down-s-line"></i>
                                </div>
                                <div className="hide-btn">
                                  {guidePhraseData?.hide_all}{" "}
                                  <i className="ri-arrow-up-s-line"></i>
                                </div>
                              </Accordion.Header>
                              <Accordion.Body>
                                <div className="spec-section">
                                  <div className="spec-item">
                                    <div className="spec-col">
                                      <div className="query ranking-tooltip-title">
                                        {guidePhraseData?.technical_score}
                                        <span className="">
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                          >
                                            <path d="M12 19C12.8284 19 13.5 19.6716 13.5 20.5C13.5 21.3284 12.8284 22 12 22C11.1716 22 10.5 21.3284 10.5 20.5C10.5 19.6716 11.1716 19 12 19ZM12 2C15.3137 2 18 4.68629 18 8C18 10.1646 17.2474 11.2907 15.3259 12.9231C13.3986 14.5604 13 15.2969 13 17H11C11 14.526 11.787 13.3052 14.031 11.3989C15.5479 10.1102 16 9.43374 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8V9H6V8C6 4.68629 8.68629 2 12 2Z"></path>
                                          </svg>
                                        </span>
                                        <div className="tooltip-display-content">
                                          {product?.technical_score_descriptions
                                            .description && (
                                            <p className="mb-2">
                                              <b>
                                                {guidePhraseData &&
                                                  guidePhraseData?.what_it_is}
                                                :{" "}
                                              </b>
                                              {
                                                product
                                                  ?.technical_score_descriptions
                                                  ?.description
                                              }
                                            </p>
                                          )}
                                          {product?.technical_score_descriptions
                                            .when_matters && (
                                            <p className="mb-2">
                                              <b>
                                                {guidePhraseData &&
                                                  guidePhraseData?.when_it_matters}
                                                :{" "}
                                              </b>
                                              {
                                                product
                                                  ?.technical_score_descriptions
                                                  ?.when_matters
                                              }
                                            </p>
                                          )}
                                          <p>
                                            <b>
                                              {guidePhraseData &&
                                                guidePhraseData?.score_components}
                                              :
                                            </b>
                                          </p>
                                          {product?.technical_score_descriptions
                                            .score_components &&
                                            product?.technical_score_descriptions?.score_components?.map(
                                              (data, index) => {
                                                return (
                                                  <React.Fragment key={index}>
                                                    <div
                                                      className="scroe_section"
                                                      key={index}
                                                    >
                                                      <p className="text-end">
                                                        {`${parseFloat(
                                                          data?.importance
                                                        ).toFixed(1)}%`}
                                                      </p>
                                                      <div
                                                        className="score-count"
                                                        style={{
                                                          background:
                                                            data?.attribute_evaluation >=
                                                            7.5
                                                              ? "#093673"
                                                              : data?.attribute_evaluation >=
                                                                  5 &&
                                                                data?.attribute_evaluation <
                                                                  7.5
                                                              ? "#437ECE"
                                                              : "#85B2F1",
                                                        }}
                                                      >
                                                        {formatValue(
                                                          data?.attribute_evaluation
                                                        )}
                                                        {/* {`${parseFloat(
                                                         data?.attribute_evaluation
                                                       ).toFixed(1)}`} */}
                                                      </div>
                                                      <p>
                                                        {
                                                          data?.attribute_category
                                                        }
                                                      </p>
                                                    </div>
                                                  </React.Fragment>
                                                );
                                              }
                                            )}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="spec-col">
                                      <span
                                        className={`${
                                          product.technical_score_phase !== ""
                                            ? "tooltip-title"
                                            : ""
                                        }`}
                                        style={{
                                          color:
                                            product.technical_score_is_better_than *
                                              100 >=
                                            70
                                              ? "#437ece"
                                              : product.technical_score_is_worse_than *
                                                  100 >
                                                70
                                              ? "#ce434b"
                                              : "#27304e",
                                          fontSize: "15px",
                                          textDecoration:
                                            product.technical_score_phase !== ""
                                              ? "underline"
                                              : "",
                                          textDecorationStyle:
                                            product.technical_score_phase !== ""
                                              ? "dotted"
                                              : "",
                                          textDecorationThickness: "1.5px",
                                          textDecorationColor:
                                            product.technical_score_is_better_than *
                                              100 >=
                                            70
                                              ? "#437ece"
                                              : product.technical_score_is_worse_than *
                                                  100 >
                                                70
                                              ? "#ce434b"
                                              : "#27304e",
                                          textUnderlineOffset: "5px",
                                        }}
                                      >
                                        {formatValue(product.technical_score)}
                                        <ProsConsToolTip
                                          hover_phrase={
                                            product.technical_score_phase
                                          }
                                        />
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="spec-section">
                                  <div className="spec-item">
                                    <div className="spec-col">
                                      <div className="query ranking-tooltip-title">
                                        {guidePhraseData &&
                                          guidePhraseData?.users_ratings}
                                        <span className="">
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                          >
                                            <path d="M12 19C12.8284 19 13.5 19.6716 13.5 20.5C13.5 21.3284 12.8284 22 12 22C11.1716 22 10.5 21.3284 10.5 20.5C10.5 19.6716 11.1716 19 12 19ZM12 2C15.3137 2 18 4.68629 18 8C18 10.1646 17.2474 11.2907 15.3259 12.9231C13.3986 14.5604 13 15.2969 13 17H11C11 14.526 11.787 13.3052 14.031 11.3989C15.5479 10.1102 16 9.43374 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8V9H6V8C6 4.68629 8.68629 2 12 2Z"></path>
                                          </svg>
                                        </span>
                                        <div className="tooltip-display-content">
                                          {product?.users_rating_descriptions
                                            .description && (
                                            <p className="mb-2">
                                              <b>
                                                {guidePhraseData &&
                                                  guidePhraseData?.what_it_is}
                                                :{" "}
                                              </b>
                                              {
                                                product
                                                  ?.users_rating_descriptions
                                                  ?.description
                                              }
                                            </p>
                                          )}
                                          {product?.users_rating_descriptions
                                            .when_matters && (
                                            <p className="mb-2">
                                              <b>
                                                {guidePhraseData &&
                                                  guidePhraseData?.when_it_matters}
                                                :{" "}
                                              </b>
                                              {
                                                product
                                                  ?.users_rating_descriptions
                                                  ?.when_matters
                                              }
                                            </p>
                                          )}
                                          <p>
                                            <b>
                                              {guidePhraseData &&
                                                guidePhraseData?.score_components}
                                              :
                                            </b>
                                          </p>
                                          {product?.users_rating_descriptions
                                            .score_components &&
                                            product?.users_rating_descriptions.score_components?.map(
                                              (data, index) => {
                                                return (
                                                  <React.Fragment key={index}>
                                                    <div
                                                      className="scroe_section"
                                                      key={index}
                                                    >
                                                      <p className="text-end">
                                                        {`${parseFloat(
                                                          data?.importance
                                                        ).toFixed(1)}%`}
                                                      </p>
                                                      <div
                                                        className="score-count"
                                                        style={{
                                                          background:
                                                            data?.attribute_evaluation >=
                                                            7.5
                                                              ? "#093673"
                                                              : data?.attribute_evaluation >=
                                                                  5 &&
                                                                data?.attribute_evaluation <
                                                                  7.5
                                                              ? "#437ECE"
                                                              : "#85B2F1",
                                                        }}
                                                      >
                                                        {formatValue(
                                                          data?.attribute_evaluation
                                                        )}

                                                        {/* {`${parseFloat(
                                                         data?.attribute_evaluation
                                                       ).toFixed(1)}`} */}
                                                      </div>
                                                      <p>
                                                        {
                                                          data?.attribute_category
                                                        }
                                                      </p>
                                                    </div>
                                                  </React.Fragment>
                                                );
                                              }
                                            )}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="spec-col">
                                      <span
                                        className={`${
                                          product?.reviews_phase !== ""
                                            ? "tooltip-title"
                                            : ""
                                        }`}
                                        style={{
                                          color:
                                            product.reviews_is_better_than *
                                              100 >=
                                            70
                                              ? "#437ece"
                                              : product.reviews_is_worse_than *
                                                  100 >
                                                70
                                              ? "#ce434b"
                                              : "#27304e",
                                          fontSize: "15px",
                                          textDecoration:
                                            product.reviews_phase !== ""
                                              ? "underline"
                                              : "",
                                          textDecorationStyle:
                                            product.reviews_phase !== ""
                                              ? "dotted"
                                              : "",
                                          textDecorationThickness: "1.5px",
                                          textDecorationColor:
                                            product.reviews_is_better_than *
                                              100 >=
                                            70
                                              ? "#437ece"
                                              : product.reviews_is_worse_than *
                                                  100 >
                                                70
                                              ? "#ce434b"
                                              : "#27304e",
                                          textUnderlineOffset: "5px",
                                        }}
                                      >
                                        {formatValue(product.reviews)}
                                        <ProsConsToolTip
                                          hover_phrase={product.reviews_phase}
                                        />
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                {product.expert_reviews_rating > 0 && (
                                  <div className="spec-section">
                                    <div className="spec-item">
                                      <div className="spec-col">
                                        <div className="query text-ellipse ranking-tooltip-title">
                                          Expert reviews
                                          <QuestionIcon
                                            attributes={
                                              product?.expert_reviews_descriptions
                                            }
                                            guidePhraseData={guidePhraseData}
                                          />
                                        </div>
                                      </div>
                                      <div className="spec-col">
                                        <div
                                          className={`${
                                            product?.expert_reviews_rating_phase !==
                                            ""
                                              ? "tooltip-title"
                                              : ""
                                          }`}
                                          style={{
                                            color:
                                              product.expert_reviews_is_better_than *
                                                100 >=
                                              70
                                                ? "#437ece"
                                                : product.expert_reviews_is_worse_than *
                                                    100 >
                                                  70
                                                ? "#ce434b"
                                                : "#27304e",
                                            fontSize: "15px",

                                            textDecoration:
                                              product?.expert_reviews_rating_phase !==
                                              ""
                                                ? "underline"
                                                : "",
                                            textDecorationStyle:
                                              product?.expert_reviews_rating_phase !==
                                              ""
                                                ? "dotted"
                                                : "",
                                            textDecorationThickness: "1.5px",
                                            textDecorationColor:
                                              product.expert_reviews_is_better_than *
                                                100 >=
                                              70
                                                ? "#437ece"
                                                : product.expert_reviews_is_worse_than *
                                                    100 >
                                                  70
                                                ? "#ce434b"
                                                : "#27304e",
                                            textUnderlineOffset: "5px",
                                          }}
                                        >
                                          {formatValue(
                                            product.expert_reviews_rating
                                          )}
                                          <div className="tooltip-display-content why-tooltip">
                                            <div
                                              className=" prosconsColor"
                                              dangerouslySetInnerHTML={{
                                                __html:
                                                  product.expert_reviews_rating_phase,
                                              }}
                                            ></div>
                                            {/* {(
                                             product?.expert_reviews_websites
                                           )} */}

                                            {/* for expert review  now I comment this code */}
                                            {product?.expert_reviews_websites &&
                                              product?.expert_reviews_websites?.map(
                                                (data, index) => {
                                                  return (
                                                    <div
                                                      className="user__rating__popup"
                                                      key={index}
                                                    >
                                                      <div className="user__rating__popup__list">
                                                        <span
                                                          className="user__rating__popup__rating"
                                                          style={{
                                                            background:
                                                              getColorBasedOnScore(
                                                                data?.evaluation
                                                              ),
                                                          }}
                                                        >
                                                          {formatValue(
                                                            data?.evaluation
                                                          )}
                                                        </span>
                                                        <div className="user__rating__popup__content">
                                                          {data?.image !==
                                                            null && (
                                                            <a
                                                              href={`/link?p=${btoa(
                                                                data?.website_name
                                                              )}`}
                                                            >
                                                              <img
                                                                src={`${data?.image}`}
                                                              />
                                                            </a>
                                                          )}

                                                          <p>
                                                            {" "}
                                                            {data?.name !==
                                                            null ? (
                                                              <a
                                                                href={`/link?p=${btoa(
                                                                  data?.website_name
                                                                )}`}
                                                                style={{
                                                                  color:
                                                                    "inherit",
                                                                }}
                                                              >
                                                                {" "}
                                                                {data?.name}
                                                              </a>
                                                            ) : (
                                                              <a
                                                                href={`/link?p=${btoa(
                                                                  data?.website_name
                                                                )}`}
                                                                style={{
                                                                  color:
                                                                    "inherit",
                                                                }}
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
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                                <div className="spec-section">
                                  <div className="spec-item">
                                    <div className="spec-col">
                                      <div className="query text-ellipse">
                                        {guidePhraseData &&
                                          guidePhraseData?.popularity}
                                        <QuestionIcon
                                          attributes={
                                            product?.popularity_descriptions
                                          }
                                          guidePhraseData={guidePhraseData}
                                        />
                                      </div>
                                    </div>
                                    <div className="spec-col">
                                      <div
                                        className={`${
                                          product?.popularity_points_phase !==
                                          ""
                                            ? "tooltip-title"
                                            : ""
                                        }`}
                                        style={{
                                          color:
                                            product.popularity_points_better_then *
                                              100 >=
                                            70
                                              ? "#437ece"
                                              : product.popularity_points_worse_then *
                                                  100 >
                                                70
                                              ? "#ce434b"
                                              : "#27304e",
                                          fontSize: "15px",
                                          textDecoration:
                                            product.popularity_points_phase !==
                                            ""
                                              ? "underline"
                                              : "",
                                          textDecorationStyle:
                                            product.popularity_points_phase !==
                                            ""
                                              ? "dotted"
                                              : "",
                                          textDecorationThickness: "1.5px",
                                          textDecorationColor:
                                            product.popularity_points_better_then *
                                              100 >=
                                            70
                                              ? "#437ece"
                                              : product.popularity_points_worse_then *
                                                  100 >
                                                70
                                              ? "#ce434b"
                                              : "#27304e",
                                          textUnderlineOffset: "5px",
                                        }}
                                      >
                                        {formatValue(product.popularity_points)}
                                        <ProsConsToolTip
                                          hover_phrase={
                                            product.popularity_points_phase
                                          }
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="spec-section">
                                  <div className="spec-item">
                                    <div className="spec-col">
                                      <div className="query ranking-tooltip-title">
                                        {guidePhraseData &&
                                          guidePhraseData?.ratio_quality_price_points}
                                        <span className="">
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                          >
                                            <path d="M12 19C12.8284 19 13.5 19.6716 13.5 20.5C13.5 21.3284 12.8284 22 12 22C11.1716 22 10.5 21.3284 10.5 20.5C10.5 19.6716 11.1716 19 12 19ZM12 2C15.3137 2 18 4.68629 18 8C18 10.1646 17.2474 11.2907 15.3259 12.9231C13.3986 14.5604 13 15.2969 13 17H11C11 14.526 11.787 13.3052 14.031 11.3989C15.5479 10.1102 16 9.43374 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8V9H6V8C6 4.68629 8.68629 2 12 2Z"></path>
                                          </svg>
                                        </span>
                                        <div
                                          className="tooltip-display-content"
                                          // ref={tooltipRef}
                                          style={{
                                            left: isMobile ? "50%" : 0,
                                            transform: isMobile
                                              ? "translateX(-20%)"
                                              : "translateX(-10%)",
                                            width: isMobile ? "200px" : "250px",
                                          }}
                                        >
                                          {product
                                            ?.ratio_qulitiy_points_descriptions
                                            .description && (
                                            <p className="mb-2">
                                              <b>
                                                {guidePhraseData &&
                                                  guidePhraseData?.what_it_is}
                                                : :{" "}
                                              </b>
                                              {
                                                product
                                                  ?.ratio_qulitiy_points_descriptions
                                                  ?.description
                                              }
                                            </p>
                                          )}
                                          {product
                                            ?.ratio_qulitiy_points_descriptions
                                            .when_matters && (
                                            <p className="mb-2">
                                              <b>
                                                {guidePhraseData &&
                                                  guidePhraseData?.when_it_matters}
                                                :{" "}
                                              </b>
                                              {
                                                product
                                                  ?.ratio_qulitiy_points_descriptions
                                                  ?.when_matters
                                              }
                                            </p>
                                          )}
                                          <p>
                                            <b>
                                              {guidePhraseData &&
                                                guidePhraseData?.score_components}
                                              :
                                            </b>
                                          </p>
                                          {product
                                            ?.ratio_qulitiy_points_descriptions
                                            .score_components &&
                                            product?.ratio_qulitiy_points_descriptions.score_components?.map(
                                              (data, index) => {
                                                return (
                                                  <React.Fragment key={index}>
                                                    <div
                                                      className="scroe_section"
                                                      key={index}
                                                    >
                                                      <p className="text-end">
                                                        {`${parseFloat(
                                                          data?.importance
                                                        ).toFixed(1)}%`}
                                                      </p>
                                                      <div
                                                        className="score-count"
                                                        style={{
                                                          background:
                                                            data?.attribute_evaluation >=
                                                            7.5
                                                              ? "#093673"
                                                              : data?.attribute_evaluation >=
                                                                  5 &&
                                                                data?.attribute_evaluation <
                                                                  7.5
                                                              ? "#437ECE"
                                                              : "#85B2F1",
                                                        }}
                                                      >
                                                        {`${
                                                          parseFloat(
                                                            data?.attribute_evaluation
                                                          ) === 10
                                                            ? parseInt(
                                                                data?.attribute_evaluation
                                                              )
                                                            : parseFloat(
                                                                data?.attribute_evaluation
                                                              ).toFixed(1)
                                                        }`}
                                                      </div>
                                                      <p>
                                                        {
                                                          data?.attribute_category
                                                        }
                                                      </p>
                                                    </div>
                                                  </React.Fragment>
                                                );
                                              }
                                            )}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="spec-col">
                                      <span
                                        className={`${
                                          product?.reviews_phase !== ""
                                            ? "tooltip-title"
                                            : ""
                                        }`}
                                        style={{
                                          color:
                                            product.reviews_is_better_than *
                                              100 >=
                                            70
                                              ? "#437ece"
                                              : product.reviews_is_worse_than *
                                                  100 >
                                                70
                                              ? "#ce434b"
                                              : "#27304e",
                                          fontSize: "15px",
                                          textDecoration:
                                            product.reviews_phase !== ""
                                              ? "underline"
                                              : "",
                                          textDecorationStyle:
                                            product.reviews_phase !== ""
                                              ? "dotted"
                                              : "",
                                          textDecorationThickness: "1.5px",
                                          textDecorationColor:
                                            product.reviews_is_better_than *
                                              100 >=
                                            70
                                              ? "#437ece"
                                              : product.reviews_is_worse_than *
                                                  100 >
                                                70
                                              ? "#ce434b"
                                              : "#27304e",
                                          textUnderlineOffset: "5px",
                                        }}
                                      >
                                        {formatValue(
                                          product?.ratio_quality_price_points
                                        )}
                                        <ProsConsToolTip
                                          hover_phrase={
                                            product?.ratio_quality_price_points_phase
                                          }
                                        />
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </Accordion.Body>
                            </Accordion.Item>
                            {/* Dynaic accordian items of first accordin */}
                            {attributesClearly?.attributes_new &&
                              Object.keys(
                                getAttributeHalf(attributesClearly, "first")
                              ).map((attribute, index) => {
                                return (
                                  <Fragment key={index}>
                                    <Accordion.Item
                                      eventKey={index}
                                      key={index}
                                    >
                                      <Accordion.Header as="div">
                                        <div className="table-accordion-header">
                                          {attribute}
                                          {/* {(attribute,"hellow")} */}
                                          {/* {(
                                           product.attributes_new[attribute][0]
                                             ?.attribute_evaluation,
                                           product.attributes_new[attribute][0]
                                         )} */}
                                          <Questiontool
                                            attributes={
                                              attributesClearly.attributes_new[
                                                attribute
                                              ][0]?.attribute_category
                                            }
                                            guidePhraseData={guidePhraseData}
                                          />
                                        </div>
                                        <span
                                          className="count dark-color"
                                          style={{
                                            background:
                                              attributesClearly.attributes_new[
                                                attribute
                                              ][0].attribute_evaluation >= 7.5
                                                ? "#093673"
                                                : attributesClearly
                                                    .attributes_new[
                                                    attribute
                                                  ][0].attribute_evaluation >=
                                                    5 &&
                                                  attributesClearly
                                                    .attributes_new[
                                                    attribute
                                                  ][0].attribute_evaluation <
                                                    7.5
                                                ? "#437ECE"
                                                : "#85B2F1",
                                          }}
                                        >
                                          {formatValue(
                                            attributesClearly.attributes_new[
                                              attribute
                                            ][0]?.attribute_evaluation
                                          )}
                                        </span>
                                        <div className="show-btn">
                                          {guidePhraseData?.show_all}{" "}
                                          <i className="ri-arrow-down-s-line"></i>
                                        </div>
                                        <div className="hide-btn">
                                          {guidePhraseData?.hide_all}{" "}
                                          <i className="ri-arrow-up-s-line"></i>
                                        </div>
                                      </Accordion.Header>
                                      {/* {(
                                        attributesClearly?.attributes_new[
                                          attribute
                                        ].sort(
                                          (a, b) => 
                                            a.attribute_position -
                                            b.attribute_position
                                        )
                                      )} */}

                                      <Accordion.Body>
                                        {loading == false ? (
                                          attributesClearly?.attributes_new[
                                            attribute
                                          ]
                                            .sort(
                                              (a, b) =>
                                                a.attribute_position -
                                                b.attribute_position
                                            )
                                            .slice(
                                              0,
                                              displayedAttributesCount[
                                                product.name
                                              ] &&
                                                displayedAttributesCount[
                                                  product.name
                                                ][attribute]
                                                ? displayedAttributesCount[
                                                    product.name
                                                  ][attribute]
                                                : initialDisplay
                                            )
                                            .map(
                                              (attributeValues, valueIndex) => {
                                                return (
                                                  <Fragment key={valueIndex}>
                                                    <div
                                                      className="spec-section"
                                                      key={valueIndex}
                                                    >
                                                      <div className="spec-item">
                                                        <div className="spec-col">
                                                          <div className="query">
                                                            {
                                                              attributeValues.attribute
                                                            }
                                                            <QuestionIcon
                                                              attributes={
                                                                attributeValues &&
                                                                attributeValues
                                                              }
                                                              guidePhraseData={
                                                                guidePhraseData
                                                              }
                                                            />
                                                          </div>
                                                        </div>
                                                        <div className="spec-col">
                                                          {attributeValues.attribute_value !=
                                                            guidePhraseData?.yes &&
                                                            attributeValues.attribute_value !=
                                                              guidePhraseData?.no && (
                                                              <>
                                                                {/* {(attributeValues.hover_phase,"neets")} */}
                                                                <div
                                                                  className={`${
                                                                    attributeValues.hover_phase !==
                                                                      "" &&
                                                                    "tooltip-title"
                                                                  }`}
                                                                  style={{
                                                                    color:
                                                                      attributeValues.is_better_than *
                                                                        100 >=
                                                                      70
                                                                        ? "#437ece"
                                                                        : attributeValues.is_worse_than *
                                                                            100 >
                                                                          70
                                                                        ? "#ce434b"
                                                                        : "#27304e",
                                                                    fontSize:
                                                                      "15px",
                                                                    textDecoration:
                                                                      attributeValues?.hover_phase !==
                                                                      ""
                                                                        ? "underline"
                                                                        : "",
                                                                    textDecorationStyle:
                                                                      attributeValues?.hover_phase !==
                                                                      ""
                                                                        ? "dotted"
                                                                        : "",
                                                                    textDecorationThickness:
                                                                      "1.5px",
                                                                    textDecorationColor:
                                                                      attributeValues.is_better_than *
                                                                        100 >=
                                                                      70
                                                                        ? "#437ece"
                                                                        : attributeValues.is_worse_than *
                                                                            100 >
                                                                          70
                                                                        ? "#ce434b"
                                                                        : "#27304e",
                                                                    textUnderlineOffset:
                                                                      "5px",
                                                                  }}
                                                                >
                                                                  {
                                                                    <span
                                                                      style={{
                                                                        color:
                                                                          attributeValues.is_better_than *
                                                                            100 >=
                                                                          70
                                                                            ? "#437ece"
                                                                            : attributeValues.is_worse_than *
                                                                                100 >
                                                                              70
                                                                            ? "#ce434b"
                                                                            : "#27304e",
                                                                        fontSize:
                                                                          "15px",
                                                                      }}
                                                                    >
                                                                      {(attributeValues.attribute_value !=
                                                                      null
                                                                        ? attributeValues.attribute_value
                                                                        : "") +
                                                                        " " +
                                                                        (attributeValues.attribute_value ===
                                                                          "?" ||
                                                                        attributeValues.attribute_value ===
                                                                          "-"
                                                                          ? ""
                                                                          : attributeValues.unit !=
                                                                            null
                                                                          ? attributeValues.unit
                                                                          : "")}
                                                                    </span>
                                                                  }
                                                                  {/* {(attributeValues)} */}

                                                                  {attributeValues.attribute_value !==
                                                                    "?" && (
                                                                    <ProsConsToolTip
                                                                      comment={
                                                                        attributeValues?.comment
                                                                      }
                                                                      hover_phrase={
                                                                        attributeValues &&
                                                                        attributeValues.hover_phase
                                                                      }
                                                                    />
                                                                  )}
                                                                </div>{" "}
                                                                {attributeValues?.info_not_verified && (
                                                                  <div
                                                                    className="tooltip-title"
                                                                    style={{
                                                                      textDecoration:
                                                                        "none",
                                                                      textDecorationLine:
                                                                        "none",
                                                                      textDecorationStyle:
                                                                        "none",
                                                                    }}
                                                                  >
                                                                    {" "}
                                                                    <i
                                                                      style={{
                                                                        opacity:
                                                                          "70%",
                                                                      }}
                                                                    >
                                                                      {" "}
                                                                      (?){" "}
                                                                    </i>
                                                                    <div
                                                                      className="tooltip-display-content"
                                                                      style={{
                                                                        opacity:
                                                                          "100%",
                                                                      }}
                                                                    >
                                                                      Information
                                                                      is not
                                                                      verified.
                                                                      If you
                                                                      believe
                                                                      this is a
                                                                      mistake,
                                                                      please,
                                                                      contact
                                                                      our team
                                                                    </div>
                                                                  </div>
                                                                )}
                                                              </>
                                                            )}
                                                          {/* newww */}
                                                          {(attributeValues.attribute_value ==
                                                            guidePhraseData?.yes ||
                                                            attributeValues.attribute_value ==
                                                              guidePhraseData?.no) && (
                                                            <div
                                                              className={`${
                                                                attributeValues?.hover_phase !==
                                                                ""
                                                                  ? "tooltip-title"
                                                                  : ""
                                                              }`}
                                                              style={{
                                                                color:
                                                                  attributeValues.attribute_value ==
                                                                    guidePhraseData?.yes &&
                                                                  attributeValues.attribute_is_better_than *
                                                                    100 <
                                                                    40
                                                                    ? "#0066b2"
                                                                    : attributeValues.attribute_value ==
                                                                        "no" &&
                                                                      attributeValues.attribute_is_worse_than *
                                                                        100 >
                                                                        60
                                                                    ? "#ce434b"
                                                                    : "#27304e",
                                                                fontSize:
                                                                  "15px",
                                                                textDecoration:
                                                                  attributeValues?.hover_phase !==
                                                                  ""
                                                                    ? "underline"
                                                                    : "",
                                                                textDecorationStyle:
                                                                  attributeValues?.hover_phase !==
                                                                  ""
                                                                    ? "dotted"
                                                                    : "",
                                                                textDecorationThickness:
                                                                  "1.5px",
                                                                textDecorationColor:
                                                                  getColorAttr(
                                                                    attributeValues
                                                                  ),
                                                                textUnderlineOffset:
                                                                  "5px",
                                                              }}
                                                            >
                                                              {/* {(
                                                               attributeValues
                                                             )} */}
                                                              {/* here we use attribute_is_same_as and attribute_is_worse_than  */}
                                                              {
                                                                <span
                                                                  style={{
                                                                    color:
                                                                      getColorAttr(
                                                                        attributeValues
                                                                      ),
                                                                  }}
                                                                >
                                                                  {(attributeValues.attribute_value !=
                                                                  null
                                                                    ? attributeValues.attribute_value
                                                                    : "") +
                                                                    " " +
                                                                    (attributeValues.unit !=
                                                                    null
                                                                      ? attributeValues.unit
                                                                      : "")}
                                                                </span>
                                                              }
                                                              {/* here we use attributeValues.is_better_than and  attributeValues.is_worse_than  */}
                                                              <ProsConsToolTip
                                                                comment={
                                                                  attributeValues?.comment
                                                                }
                                                                hover_phrase={
                                                                  attributeValues &&
                                                                  attributeValues.hover_phase
                                                                }
                                                                info_not_verified={
                                                                  attributeValues &&
                                                                  attributeValues
                                                                }
                                                              />
                                                            </div>
                                                          )}
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </Fragment>
                                                );
                                              }
                                            )
                                        ) : (
                                          <Skeleton
                                            height={35}
                                            count={
                                              displayedAttributesCount[
                                                product.name
                                              ] &&
                                              displayedAttributesCount[
                                                product.name
                                              ][attribute]
                                                ? displayedAttributesCount[
                                                    product.name
                                                  ][attribute]
                                                : initialDisplay
                                            }
                                          />
                                        )}

                                        {loading == false
                                          ? attributesClearly.attributes_new[
                                              attribute
                                            ].length >
                                              (displayedAttributesCount[
                                                product.name
                                              ] &&
                                              displayedAttributesCount[
                                                product.name
                                              ][attribute]
                                                ? displayedAttributesCount[
                                                    product.name
                                                  ][attribute]
                                                : initialDisplay) && (
                                              <span
                                                className="show_more"
                                                onClick={() => {
                                                  setloading(true),
                                                    handleDisplayedAttributesCount(
                                                      product.name,
                                                      attribute
                                                    );
                                                  setTimeout(() => {
                                                    setloading(false);
                                                  }, 600);
                                                }}
                                              >
                                                {/* {"SHOW MORE "} */}
                                                {guidePhraseData &&
                                                  guidePhraseData?.show_all}
                                                <i
                                                  className={`ri-${
                                                    initialDisplay <
                                                    attributesClearly
                                                      .attributes_new[attribute]
                                                      .length
                                                      ? "add"
                                                      : "subtract"
                                                  }-line`}
                                                ></i>
                                              </span>
                                            )
                                          : ""}
                                      </Accordion.Body>
                                    </Accordion.Item>
                                  </Fragment>
                                );
                              })}
                          </Accordion>
                          {/* Left According end*/}

                          {/* Right */}
                          <Accordion className="table-accordion w-50 p-0 right-accordion">
                            {attributesClearly?.attributes_new &&
                              Object.keys(
                                getAttributeHalf(attributesClearly, "second")
                              ).map((attribute, index) => {
                                return (
                                  <Fragment key={index}>
                                    <Accordion.Item
                                      eventKey={index}
                                      key={index}
                                    >
                                      <Accordion.Header as="div">
                                        <div className="table-accordion-header">
                                          {attribute}
                                          {/* {(attribute,"hellow")} */}
                                          {/* {(
                                           product.attributes_new[attribute][0]
                                             ?.attribute_evaluation,
                                           product.attributes_new[attribute][0]
                                         )} */}
                                          <Questiontool
                                            attributes={
                                              attributesClearly.attributes_new[
                                                attribute
                                              ][0]?.attribute_category
                                            }
                                            guidePhraseData={guidePhraseData}
                                          />
                                        </div>
                                        <span
                                          className="count dark-color"
                                          style={{
                                            background:
                                              attributesClearly.attributes_new[
                                                attribute
                                              ][0].attribute_evaluation >= 7.5
                                                ? "#093673"
                                                : attributesClearly
                                                    .attributes_new[
                                                    attribute
                                                  ][0].attribute_evaluation >=
                                                    5 &&
                                                  attributesClearly
                                                    .attributes_new[
                                                    attribute
                                                  ][0].attribute_evaluation <
                                                    7.5
                                                ? "#437ECE"
                                                : "#85B2F1",
                                          }}
                                        >
                                          {formatValue(
                                            attributesClearly.attributes_new[
                                              attribute
                                            ][0]?.attribute_evaluation
                                          )}
                                        </span>
                                        <div className="show-btn">
                                          {guidePhraseData?.show_all}
                                          <i className="ri-arrow-down-s-line"></i>
                                        </div>
                                        <div className="hide-btn">
                                          {guidePhraseData?.hide_all}
                                          <i className="ri-arrow-up-s-line"></i>
                                        </div>
                                      </Accordion.Header>
                                      <Accordion.Body>
                                        {loading == false ? (
                                          attributesClearly?.attributes_new[
                                            attribute
                                          ]
                                            .sort(
                                              (a, b) =>
                                                a.attribute_position -
                                                b.attribute_position
                                            )
                                            .slice(
                                              0,
                                              displayedAttributesCount[
                                                product.name
                                              ] &&
                                                displayedAttributesCount[
                                                  product.name
                                                ][attribute]
                                                ? displayedAttributesCount[
                                                    product.name
                                                  ][attribute]
                                                : initialDisplay
                                            )
                                            .map(
                                              (attributeValues, valueIndex) => {
                                                return (
                                                  <Fragment key={valueIndex}>
                                                    <div
                                                      className="spec-section"
                                                      key={valueIndex}
                                                    >
                                                      <div className="spec-item">
                                                        <div className="spec-col">
                                                          <div className="query">
                                                            {
                                                              attributeValues.attribute
                                                            }
                                                            <QuestionIcon
                                                              attributes={
                                                                attributeValues &&
                                                                attributeValues
                                                              }
                                                              guidePhraseData={
                                                                guidePhraseData
                                                              }
                                                            />
                                                          </div>
                                                        </div>
                                                        <div className="spec-col">
                                                          {attributeValues.attribute_value !=
                                                            guidePhraseData?.yes &&
                                                            attributeValues.attribute_value !=
                                                              guidePhraseData?.no && (
                                                              <>
                                                                {/* {(attributeValues.hover_phase,"neets")} */}
                                                                <div
                                                                  className={`${
                                                                    attributeValues.hover_phase !==
                                                                      "" &&
                                                                    "tooltip-title"
                                                                  }`}
                                                                  style={{
                                                                    color:
                                                                      attributeValues.is_better_than *
                                                                        100 >=
                                                                      70
                                                                        ? "#437ece"
                                                                        : attributeValues.is_worse_than *
                                                                            100 >
                                                                          70
                                                                        ? "#ce434b"
                                                                        : "#27304e",
                                                                    fontSize:
                                                                      "15px",
                                                                    textDecoration:
                                                                      attributeValues?.hover_phase !==
                                                                      ""
                                                                        ? "underline"
                                                                        : "",
                                                                    textDecorationStyle:
                                                                      attributeValues?.hover_phase !==
                                                                      ""
                                                                        ? "dotted"
                                                                        : "",
                                                                    textDecorationThickness:
                                                                      "1.5px",
                                                                    textDecorationColor:
                                                                      attributeValues.is_better_than *
                                                                        100 >=
                                                                      70
                                                                        ? "#437ece"
                                                                        : attributeValues.is_worse_than *
                                                                            100 >
                                                                          70
                                                                        ? "#ce434b"
                                                                        : "#27304e",
                                                                    textUnderlineOffset:
                                                                      "5px",
                                                                  }}
                                                                >
                                                                  {
                                                                    <span
                                                                      style={{
                                                                        color:
                                                                          attributeValues.is_better_than *
                                                                            100 >=
                                                                          70
                                                                            ? "#437ece"
                                                                            : attributeValues.is_worse_than *
                                                                                100 >
                                                                              70
                                                                            ? "#ce434b"
                                                                            : "#27304e",
                                                                        fontSize:
                                                                          "15px",
                                                                      }}
                                                                    >
                                                                      {(attributeValues.attribute_value !=
                                                                      null
                                                                        ? attributeValues.attribute_value
                                                                        : "") +
                                                                        " " +
                                                                        (attributeValues.attribute_value ===
                                                                          "?" ||
                                                                        attributeValues.attribute_value ===
                                                                          "-"
                                                                          ? ""
                                                                          : attributeValues.unit !=
                                                                            null
                                                                          ? attributeValues.unit
                                                                          : "")}
                                                                    </span>
                                                                  }
                                                                  {/* {(
                                                                    attributeValues?.comment
                                                                  )} */}

                                                                  {attributeValues.attribute_value !==
                                                                    "?" && (
                                                                    <ProsConsToolTip
                                                                      comment={
                                                                        attributeValues?.comment
                                                                      }
                                                                      hover_phrase={
                                                                        attributeValues &&
                                                                        attributeValues.hover_phase
                                                                      }
                                                                      info_not_verified={
                                                                        attributeValues &&
                                                                        attributeValues?.info_not_verified
                                                                      }
                                                                      info_not_verified_text={
                                                                        attributeValues &&
                                                                        attributeValues?.info_not_verified_text
                                                                      }
                                                                    />
                                                                  )}
                                                                </div>{" "}
                                                                {/* {(attributeValues?.info_not_verified)} */}
                                                                {attributeValues?.info_not_verified && (
                                                                  <div
                                                                    className="tooltip-title"
                                                                    style={{
                                                                      textDecoration:
                                                                        "none",
                                                                      textDecorationLine:
                                                                        "none",
                                                                      textDecorationStyle:
                                                                        "none",
                                                                    }}
                                                                  >
                                                                    {" "}
                                                                    <i
                                                                      style={{
                                                                        opacity:
                                                                          "70%",
                                                                      }}
                                                                    >
                                                                      {" "}
                                                                      (?){" "}
                                                                    </i>
                                                                    <div
                                                                      className="tooltip-display-content"
                                                                      style={{
                                                                        left: isMobile
                                                                          ? "50%"
                                                                          : 0,
                                                                        transform:
                                                                          isMobile
                                                                            ? "translateX(-20%)"
                                                                            : "translateX(-10%)",
                                                                        width:
                                                                          isMobile
                                                                            ? "200px"
                                                                            : "250px",
                                                                        opacity:
                                                                          "100%",
                                                                      }}
                                                                    >
                                                                      {
                                                                        attributeValues?.info_not_verified_text
                                                                      }
                                                                    </div>
                                                                  </div>
                                                                )}
                                                              </>
                                                            )}
                                                          {/* newww */}
                                                          {(attributeValues.attribute_value ==
                                                            guidePhraseData?.yes ||
                                                            attributeValues.attribute_value ==
                                                              guidePhraseData?.no) && (
                                                            <div
                                                              className={`${
                                                                attributeValues?.hover_phase !==
                                                                ""
                                                                  ? "tooltip-title"
                                                                  : ""
                                                              }`}
                                                              style={{
                                                                color:
                                                                  attributeValues.attribute_value ==
                                                                    guidePhraseData?.yes &&
                                                                  attributeValues.attribute_is_better_than *
                                                                    100 <
                                                                    40
                                                                    ? "#0066b2"
                                                                    : attributeValues.attribute_value ==
                                                                        "no" &&
                                                                      attributeValues.attribute_is_worse_than *
                                                                        100 >
                                                                        60
                                                                    ? "#ce434b"
                                                                    : "#27304e",
                                                                fontSize:
                                                                  "15px",
                                                                textDecoration:
                                                                  attributeValues?.hover_phase !==
                                                                  ""
                                                                    ? "underline"
                                                                    : "",
                                                                textDecorationStyle:
                                                                  attributeValues?.hover_phase !==
                                                                  ""
                                                                    ? "dotted"
                                                                    : "",
                                                                textDecorationThickness:
                                                                  "1.5px",
                                                                textDecorationColor:
                                                                  getColorAttr(
                                                                    attributeValues
                                                                  ),
                                                                textUnderlineOffset:
                                                                  "5px",
                                                              }}
                                                            >
                                                              {/* {(
                                                               attributeValues
                                                             )} */}
                                                              {/* here we use attribute_is_same_as and attribute_is_worse_than  */}
                                                              {
                                                                <span
                                                                  style={{
                                                                    color:
                                                                      getColorAttr(
                                                                        attributeValues
                                                                      ),
                                                                  }}
                                                                >
                                                                  {(attributeValues.attribute_value !=
                                                                  null
                                                                    ? attributeValues.attribute_value
                                                                    : "") +
                                                                    " " +
                                                                    (attributeValues.unit !=
                                                                    null
                                                                      ? attributeValues.unit
                                                                      : "")}
                                                                </span>
                                                              }
                                                              {/* here we use attributeValues.is_better_than and  attributeValues.is_worse_than  */}
                                                              <ProsConsToolTip
                                                                hover_phrase={
                                                                  attributeValues &&
                                                                  attributeValues.hover_phase
                                                                }
                                                              />
                                                            </div>
                                                          )}
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </Fragment>
                                                );
                                              }
                                            )
                                        ) : (
                                          <Skeleton
                                            height={35}
                                            count={
                                              displayedAttributesCount[
                                                product.name
                                              ] &&
                                              displayedAttributesCount[
                                                product.name
                                              ][attribute]
                                                ? displayedAttributesCount[
                                                    product.name
                                                  ][attribute]
                                                : initialDisplay
                                            }
                                          />
                                        )}

                                        {loading == false
                                          ? attributesClearly.attributes_new[
                                              attribute
                                            ].length >
                                              (displayedAttributesCount[
                                                product.name
                                              ] &&
                                              displayedAttributesCount[
                                                product.name
                                              ][attribute]
                                                ? displayedAttributesCount[
                                                    product.name
                                                  ][attribute]
                                                : initialDisplay) && (
                                              <span
                                                className="show_more"
                                                onClick={() => {
                                                  setloading(true),
                                                    handleDisplayedAttributesCount(
                                                      product.name,
                                                      attribute
                                                    );
                                                  setTimeout(() => {
                                                    setloading(false);
                                                  }, 600);
                                                }}
                                              >
                                                {/* {"SHOW MORE "} */}
                                                {guidePhraseData &&
                                                  guidePhraseData?.show_all}
                                                <i
                                                  className={`ri-${
                                                    initialDisplay <
                                                    attributesClearly
                                                      .attributes_new[attribute]
                                                      .length
                                                      ? "add"
                                                      : "subtract"
                                                  }-line`}
                                                ></i>
                                              </span>
                                            )
                                          : ""}
                                      </Accordion.Body>
                                    </Accordion.Item>
                                  </Fragment>
                                );
                              })}
                          </Accordion>
                        </Accordion.Body>
                      </Col>
                    </Row>
                  )}
                </Accordion.Item>
              </Accordion>
            </Row>
          </Col>
        </Row>
      </div>
    </Fragment>
  );
}
("");
