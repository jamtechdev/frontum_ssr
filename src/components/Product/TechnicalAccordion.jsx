"use client";
import React, { useRef, useState } from "react";
import { Accordion } from "react-bootstrap";
import QuestionIcon from "@/components/Svg/QuestionIcon";
import {
  capitalize,
  getAttributeProductHalf,
  removeDecimalAboveNine,
} from "../../_helpers";
import Questiontool from "../Svg/Questiontool";
import ProsConsToolTip from "../Svg/ProsConsToolTip";
import Skeleton from "react-loading-skeleton";
import Rating from "../Common/Rating/Rating";
import formatValue from "@/_helpers/formatValue";
import useScreenSize from "@/_helpers/useScreenSize";

const TechnicalAccordion = React.memo(
  ({ productPhaseData, product, overallScoreColor, initialDisplay }) => {
    // ... existing functions ...

    const { isMobile } = useScreenSize();

    const [loading, setloading] = useState(false);
    const [tooltipPosition, setTooltipPosition] = useState({
      top: 0,
      left: 0,
    });
    const tooltipRef = useRef(null);
    const [displayedAttributesCount, setDisplayedAttributesCount] = useState(
      {}
    );
    const [expandedAttributes, setExpandedAttributes] = useState({}); // State to manage expanded attributes

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

    // Function to adjust the position of the tooltip to ensure it stays within the screen boundaries and is horizontally centered
    function adjustTooltipPosition() {
      const tooltip = tooltipRef.current;
      if (!tooltip) return;

      const tooltipRect = tooltip.getBoundingClientRect();

      const viewportWidth = document.documentElement.clientWidth;

      const tooltipWidth = tooltipRect.width;
      // (viewportWidth - tooltipWidth / 2 - tooltipWidth);

      // Calculate ideal left position for centered alignment
      const idealLeft = (viewportWidth - tooltipWidth) / 2;

      // Calculate the final left position to ensure the tooltip stays within the screen boundaries
      const left = Math.min(
        Math.max(0, idealLeft),
        viewportWidth - tooltipWidth / 2 - tooltipWidth
      );

      setTooltipPosition({ ...tooltipPosition, left });
    }

    /**
     * Returns a color based on the given score.
     *
     * @param {number} score - The score to determine the color for.
     * @return {string} The color corresponding to the score. Possible values are "#093673", "#437ECE", or "#85B2F1".
     */

    const getColorBasedOnScore = (score) => {
      if (score >= 7.5) {
        return "#093673";
      } else if (score >= 5 && score < 7.5) {
        return "#437ECE";
      } else {
        return "#85B2F1";
      }
    };

    // rating texr
    const getEvaluation = (score) => {
      if (score >= 9) {
        return "Outstanding";
      } else if (score >= 8) {
        return "Excellent";
      } else if (score >= 7) {
        return "Very good";
      } else if (score >= 5) {
        return "Good";
      } else if (score >= 3) {
        return "Fair";
      } else if (score >= 1) {
        return "Poor";
      }
      return "Poor"; // Handle other cases as needed
    };

    /**
     * Extracts the domain name from a given URL.
     *
     * @param {string} url - The URL from which to extract the domain name.
     * @return {string} The extracted domain name.
     */

    const extractDomainName = (url) => {
      const domain = url
        .replace("https://", "")
        .replace("http://", "")
        .replace("www.", "")
        .split(/[/?#]/)[0];
      return domain;
    };

    const [showFullData, setShowFullData] = useState(false);
    const toggleShowFullData = () => {
      setShowFullData(!showFullData);
    };
    /**
     * A description of the entire function.
     *
     * @param {type} attribute - description of parameter
     * @return {type} description of return value
     */
    const handleShowMore = (attribute) => {
      setExpandedAttributes((prev) => ({
        ...prev,
        [attribute]: !prev[attribute],
      }));
    };

    return (
      <>
        <Accordion className="table-accordion w-50 p-0 left-accordion">
          <Accordion.Item eventKey="4">
            <Accordion.Header as="div">
              <div className="table-accordion-header">
                {productPhaseData && productPhaseData?.overall}
              </div>
              <span className="count" style={{ background: overallScoreColor }}>
                {formatValue(product?.overall_score)}
              </span>
              <div className="show-btn">
                {productPhaseData && productPhaseData?.show_all}{" "}
                <i className="ri-arrow-down-s-line"></i>
              </div>
              <div className="hide-btn">
                {productPhaseData && productPhaseData?.hide_all}{" "}
                <i className="ri-arrow-up-s-line"></i>
              </div>
            </Accordion.Header>
            <Accordion.Body>
              <div className="spec-section">
                <div className="spec-item">
                  <div className="spec-col">
                    <div
                      className="query ranking-tooltip-title"
                      onMouseOver={adjustTooltipPosition}
                    >
                      {productPhaseData && productPhaseData?.technical_score}
                      <span className="query ranking-tooltip-title">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 19C12.8284 19 13.5 19.6716 13.5 20.5C13.5 21.3284 12.8284 22 12 22C11.1716 22 10.5 21.3284 10.5 20.5C10.5 19.6716 11.1716 19 12 19ZM12 2C15.3137 2 18 4.68629 18 8C18 10.1646 17.2474 11.2907 15.3259 12.9231C13.3986 14.5604 13 15.2969 13 17H11C11 14.526 11.787 13.3052 14.031 11.3989C15.5479 10.1102 16 9.43374 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8V9H6V8C6 4.68629 8.68629 2 12 2Z"></path>
                        </svg>
                      </span>
                      <div
                        className="tooltip-display-content"
                        ref={tooltipRef}
                        style={{
                          left: isMobile ? "50%" : 0,
                          transform: isMobile
                            ? "translateX(-20%)"
                            : "translateX(-10%)",
                          width: isMobile ? "250px" : "250px",
                        }}
                      >
                        <p className="mb-2">
                          <b>{product && product?.page_phases?.what_it_is}: </b>
                          {product?.technical_score_descriptions?.description}
                        </p>

                        <p className="mb-2">
                          <b>
                            {product && product?.page_phases?.when_it_matters}:{" "}
                          </b>
                          {product?.technical_score_descriptions?.when_matters}
                        </p>

                        <p>
                          <b>
                            {product && product?.page_phases?.score_components}:
                          </b>
                        </p>
                        {product?.technical_score_descriptions
                          .score_components &&
                          product?.technical_score_descriptions?.score_components?.map(
                            (data, index) => {
                              return (
                                <React.Fragment key={index}>
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
                                      {`${
                                        parseFloat(
                                          data?.attribute_evaluation
                                        ) === 10
                                          ? parseInt(data?.attribute_evaluation)
                                          : parseFloat(
                                              data?.attribute_evaluation
                                            ).toFixed(1)
                                      }`}
                                    </div>
                                    <p>{data?.attribute_category}</p>
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
                          product.technical_score_is_better_than * 100 >= 70
                            ? "#437ece"
                            : product.technical_score_is_worse_than * 100 > 70
                            ? "#ce434b"
                            : "#27304e",
                        fontSize: "15px",
                        textDecoration:
                          product.technical_score_phase !== ""
                            ? "underline"
                            : "",
                        textDecorationStyle:
                          product.technical_score_phase !== "" ? "dotted" : "",
                        textDecorationThickness: "1.5px",
                        textDecorationColor:
                          product.technical_score_is_better_than * 100 >= 70
                            ? "#437ece"
                            : product.technical_score_is_worse_than * 100 > 70
                            ? "#ce434b"
                            : "#27304e",
                        textUnderlineOffset: "5px",
                      }}
                    >
                      {formatValue(product.technical_score)}
                      <ProsConsToolTip
                        hover_phrase={product.technical_score_phase}
                      />
                    </span>
                  </div>
                </div>
              </div>
              <div className="spec-section">
                <div className="spec-item">
                  <div className="spec-col">
                    <div
                      className="query ranking-tooltip-title"
                      onMouseOver={adjustTooltipPosition}
                    >
                      {productPhaseData && productPhaseData?.users_ratings}
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
                        ref={tooltipRef}
                        style={{
                          left: isMobile ? "50%" : 0,
                          transform: isMobile
                            ? "translateX(-20%)"
                            : "translateX(-10%)",
                          width: isMobile ? "200px" : "250px",
                        }}
                      >
                        {product?.users_rating_descriptions.description && (
                          <p className="mb-2">
                            <b>
                              {product && product?.page_phases?.what_it_is}:{" "}
                            </b>
                            {product?.users_rating_descriptions?.description}
                          </p>
                        )}
                        {product?.users_rating_descriptions.when_matters && (
                          <p className="mb-2">
                            <b>
                              {product && product?.page_phases?.when_it_matters}
                              :{" "}
                            </b>
                            {product?.users_rating_descriptions?.when_matters}
                          </p>
                        )}
                        <p>
                          <b>
                            {product && product?.page_phases?.score_components}:
                          </b>
                        </p>
                        {product?.users_rating_descriptions.score_components &&
                          product?.users_rating_descriptions.score_components?.map(
                            (data, index) => {
                              return (
                                <React.Fragment key={index}>
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
                                      {`${
                                        parseFloat(
                                          data?.attribute_evaluation
                                        ) === 10
                                          ? parseInt(data?.attribute_evaluation)
                                          : parseFloat(
                                              data?.attribute_evaluation
                                            ).toFixed(1)
                                      }`}
                                    </div>
                                    <p>{data?.attribute_category}</p>
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
                        product?.reviews_phase !== "" ? "tooltip-title" : ""
                      }`}
                      style={{
                        color:
                          product.reviews_is_better_than * 100 >= 70
                            ? "#437ece"
                            : product.reviews_is_worse_than * 100 > 70
                            ? "#ce434b"
                            : "#27304e",
                        fontSize: "15px",
                        textDecoration:
                          product.reviews_phase !== "" ? "underline" : "",
                        textDecorationStyle:
                          product.reviews_phase !== "" ? "dotted" : "",
                        textDecorationThickness: "1.5px",
                        textDecorationColor:
                          product.reviews_is_better_than * 100 >= 70
                            ? "#437ece"
                            : product.reviews_is_worse_than * 100 > 70
                            ? "#ce434b"
                            : "#27304e",
                        textUnderlineOffset: "5px",
                      }}
                    >
                      {formatValue(product.reviews)}
                      <ProsConsToolTip hover_phrase={product.reviews_phase} />
                    </span>
                  </div>
                </div>
              </div>
              {/* { (product.expert_reviews_rating)} */}

              {product.expert_reviews_rating > 0 && (
                <div className="spec-section">
                  <div className="spec-item">
                    <div className="spec-col">
                      <div className="query text-ellipse ranking-tooltip-title">
                        Expert reviews
                        <QuestionIcon
                          attributes={product?.expert_reviews_descriptions}
                          productPhaseData={productPhaseData}
                        />
                      </div>
                    </div>
                    <div className="spec-col">
                      <div
                        className={`${
                          product?.expert_reviews_rating_phase !== ""
                            ? "tooltip-title"
                            : ""
                        }`}
                        style={{
                          color:
                            product.expert_reviews_is_better_than * 100 >= 70
                              ? "#437ece"
                              : product.expert_reviews_is_worse_than * 100 > 70
                              ? "#ce434b"
                              : "#27304e",
                          fontSize: "15px",

                          textDecoration:
                            product?.expert_reviews_rating_phase !== ""
                              ? "underline"
                              : "",
                          textDecorationStyle:
                            product?.expert_reviews_rating_phase !== ""
                              ? "dotted"
                              : "",
                          textDecorationThickness: "1.5px",
                          textDecorationColor:
                            product.expert_reviews_is_better_than * 100 >= 70
                              ? "#437ece"
                              : product.expert_reviews_is_worse_than * 100 > 70
                              ? "#ce434b"
                              : "#27304e",
                          textUnderlineOffset: "5px",
                        }}
                      >
                        {formatValue(product.expert_reviews_rating)}

                        <div className="tooltip-display-content why-tooltip">
                          <div
                            className=" prosconsColor"
                            dangerouslySetInnerHTML={{
                              __html: product.expert_reviews_rating_phase,
                            }}
                          ></div>
                          {/* {(product?.expert_reviews_websites)} */}

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
                                            <img
                                              src={`${data?.image}`}
                                              alt={data?.name}
                                            />
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
                        </div>
                        {/* {product?.expert_reviews_websites && (
                          <ProsConsToolTip
                            hover_phrase={product.expert_reviews_rating_phase}
                            expert_reviews={product?.expert_reviews_websites}
                          />
                        )} */}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="spec-section">
                <div className="spec-item">
                  <div className="spec-col">
                    <div className="query text-ellipse">
                      {productPhaseData && productPhaseData?.popularity}
                      <QuestionIcon
                        attributes={product?.popularity_descriptions}
                        productPhaseData={productPhaseData}
                      />
                    </div>
                  </div>
                  <div className="spec-col">
                    <div
                      className={`${
                        product?.popularity_points_phase !== ""
                          ? "tooltip-title"
                          : ""
                      }`}
                      style={{
                        color:
                          product.popularity_points_better_then * 100 >= 70
                            ? "#437ece"
                            : product.popularity_points_worse_then * 100 > 70
                            ? "#ce434b"
                            : "#27304e",
                        fontSize: "15px",
                        textDecoration:
                          product.popularity_points_phase !== ""
                            ? "underline"
                            : "",
                        textDecorationStyle:
                          product.popularity_points_phase !== ""
                            ? "dotted"
                            : "",
                        textDecorationThickness: "1.5px",
                        textDecorationColor:
                          product.popularity_points_better_then * 100 >= 70
                            ? "#437ece"
                            : product.popularity_points_worse_then * 100 > 70
                            ? "#ce434b"
                            : "#27304e",
                        textUnderlineOffset: "5px",
                      }}
                    >
                      {formatValue(product.popularity_points)}
                      <ProsConsToolTip
                        hover_phrase={product.popularity_points_phase}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="spec-section">
                <div className="spec-item">
                  <div className="spec-col">
                    <div
                      className="query ranking-tooltip-title"
                      onMouseOver={adjustTooltipPosition}
                    >
                      {productPhaseData &&
                        productPhaseData?.ratio_quality_price_points}
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
                        ref={tooltipRef}
                        style={{
                          left: isMobile ? "50%" : 0,
                          transform: isMobile
                            ? "translateX(-20%)"
                            : "translateX(-10%)",
                          width: isMobile ? "200px" : "250px",
                        }}
                      >
                        {product?.ratio_qulitiy_points_descriptions
                          .description && (
                          <p className="mb-2">
                            <b>
                              {product && product?.page_phases?.what_it_is}:{" "}
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
                              {product && product?.page_phases?.when_it_matters}
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
                            {product && product?.page_phases?.score_components}:
                          </b>
                        </p>
                        {product?.ratio_qulitiy_points_descriptions
                          .score_components &&
                          product?.ratio_qulitiy_points_descriptions.score_components?.map(
                            (data, index) => {
                              return (
                                <React.Fragment key={index}>
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
                                      {`${
                                        parseFloat(
                                          data?.attribute_evaluation
                                        ) === 10
                                          ? parseInt(data?.attribute_evaluation)
                                          : parseFloat(
                                              data?.attribute_evaluation
                                            ).toFixed(1)
                                      }`}
                                    </div>
                                    <p>{data?.attribute_category}</p>
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
                        product?.reviews_phase !== "" ? "tooltip-title" : ""
                      }`}
                      style={{
                        color:
                          product.reviews_is_better_than * 100 >= 70
                            ? "#437ece"
                            : product.reviews_is_worse_than * 100 > 70
                            ? "#ce434b"
                            : "#27304e",
                        fontSize: "15px",
                        textDecoration:
                          product.reviews_phase !== "" ? "underline" : "",
                        textDecorationStyle:
                          product.reviews_phase !== "" ? "dotted" : "",
                        textDecorationThickness: "1.5px",
                        textDecorationColor:
                          product.reviews_is_better_than * 100 >= 70
                            ? "#437ece"
                            : product.reviews_is_worse_than * 100 > 70
                            ? "#ce434b"
                            : "#27304e",
                        textUnderlineOffset: "5px",
                      }}
                    >
                      {formatValue(product.reviews)}
                      <ProsConsToolTip hover_phrase={product.ratio_quality_price_points_phase} />
                    </span>
                  </div>
                </div>
              </div>
            </Accordion.Body>
          </Accordion.Item>
          {product &&
            getAttributeProductHalf(product, "first") &&
            Object.keys(getAttributeProductHalf(product, "first")).map(
              (attribute, index) => {
                return (
                  <div key={index}>
                    <Accordion.Item eventKey={index} key={index}>
                      <Accordion.Header as="div">
                        <div className="table-accordion-header">
                          {attribute}
                          <Questiontool
                            attributes={
                              product.attributes[attribute][0]
                                ?.attribute_category
                            }
                            productPhaseData={productPhaseData}
                          />
                        </div>
                        <span
                          className="count dark-color"
                          style={{
                            background:
                              product?.attributes[attribute][0]
                                .attribute_evaluation >= 7.5
                                ? "#093673"
                                : product?.attributes[attribute][0]
                                    .attribute_evaluation >= 5 &&
                                  product?.attributes[attribute][0]
                                    .attribute_evaluation < 7.5
                                ? "#437ECE"
                                : "#85B2F1",
                          }}
                        >
                          {product?.attributes[attribute][0]
                            .attribute_evaluation === 10
                            ? 10
                            : product?.attributes[
                                attribute
                              ][0].attribute_evaluation.toFixed(1)}
                        </span>
                        <div className="show-btn" onClick={() => {}}>
                          {productPhaseData && productPhaseData?.show_all}{" "}
                          <i className="ri-arrow-down-s-line"></i>
                        </div>
                        <div className="hide-btn" onClick={() => {}}>
                          {productPhaseData && productPhaseData?.hide_all}{" "}
                          <i className="ri-arrow-up-s-line"></i>
                        </div>
                      </Accordion.Header>
                      <Accordion.Body>
                        {loading == false ? (
                          product.attributes[attribute].map(
                            (attributeValues, valueIndex) => (
                              <React.Fragment key={valueIndex}>
                                <div
                                  className="spec-section"
                                  style={{
                                    display:
                                      expandedAttributes[attribute] ||
                                      valueIndex < 5
                                        ? "block"
                                        : "none",
                                  }}
                                >
                                  <div className="spec-item">
                                    <div className="spec-col">
                                      <div className="query">
                                        {attributeValues?.attribute}
                                        <QuestionIcon
                                          attributes={
                                            attributeValues && attributeValues
                                          }
                                          productPhaseData={productPhaseData}
                                        />
                                      </div>
                                    </div>
                                    {/* {console.log(productPhaseData?.yes)} */}

                                    <div className="spec-col">
                                      <div className="spec-col d-flex gap-1">
                                        {attributeValues.attribute_value !=
                                          productPhaseData?.yes &&
                                          attributeValues.attribute_value !=
                                            productPhaseData?.no && (
                                            <>
                                              <div
                                                className={`${
                                                  attributeValues?.hover_phase !==
                                                  ""
                                                    ? "tooltip-title"
                                                    : ""
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
                                                  fontSize: "15px",
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
                                                  textUnderlineOffset: "5px",
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
                                                      fontSize: "15px",
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

                                                {attributeValues.attribute_value !==
                                                  "?" && (
                                                  <ProsConsToolTip
                                                    comment={
                                                      attributeValues?.commnet
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
                                                    textDecoration: "none",
                                                    textDecorationLine: "none",
                                                    textDecorationStyle: "none",
                                                  }}
                                                >
                                                  {" "}
                                                  <i style={{ opacity: "70%" }}>
                                                    {" "}
                                                    (?){" "}
                                                  </i>
                                                  <div className="tooltip-display-content">
                                                    Information is not verified.
                                                    If you believe this is a
                                                    mistake, please, contact our
                                                    team
                                                  </div>
                                                </div>
                                              )}
                                            </>
                                          )}

                                        {/* newww */}
                                        {(attributeValues.attribute_value ==
                                          productPhaseData?.yes ||
                                          attributeValues.attribute_value ==
                                            productPhaseData?.no) && (
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
                                                  productPhaseData?.yes &&
                                                attributeValues.attribute_is_same_as *
                                                  100 <
                                                  40
                                                  ? "#0066b2"
                                                  : attributeValues.attribute_value ==
                                                      productPhaseData?.no &&
                                                    attributeValues.attribute_is_worse_than *
                                                      100 >
                                                      60
                                                  ? "red"
                                                  : "#27304e",
                                              fontSize: "15px",
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
                                              textDecorationThickness: "1.5px",
                                              textDecorationColor:
                                                attributeValues.attribute_value ==
                                                  productPhaseData?.yes &&
                                                // here I change attribute_is_better_than to attribute_is_same_as
                                                attributeValues.attribute_is_same_as *
                                                  100 <
                                                  40
                                                  ? "#0066b2"
                                                  : attributeValues.attribute_value ==
                                                      productPhaseData?.no &&
                                                    attributeValues.attribute_is_worse_than *
                                                      100 >
                                                      60
                                                  ? "red"
                                                  : "#27304e",
                                              textUnderlineOffset: "5px",
                                            }}
                                          >
                                            {/* here we use attribute_is_same_as and attribute_is_worse_than  */}
                                            {
                                              <span
                                                style={{
                                                  color:
                                                    attributeValues.attribute_value ==
                                                      productPhaseData?.yes &&
                                                    attributeValues.attribute_is_same_as *
                                                      100 <
                                                      40
                                                      ? "#0066b2"
                                                      : attributeValues.attribute_value ==
                                                          productPhaseData?.no &&
                                                        attributeValues.attribute_is_worse_than *
                                                          100 >
                                                          60
                                                      ? "red"
                                                      : "#27304e",
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
                                </div>
                              </React.Fragment>
                            )
                          )
                        ) : (
                          <Skeleton
                            height={35}
                            count={
                              displayedAttributesCount[product.name] &&
                              displayedAttributesCount[product.name][attribute]
                                ? displayedAttributesCount[product.name][
                                    attribute
                                  ]
                                : initialDisplay
                            }
                          />
                        )}
                        {loading == false
                          ? product.attributes[attribute].length >
                              (displayedAttributesCount[product.name] &&
                              displayedAttributesCount[product.name][attribute]
                                ? displayedAttributesCount[product.name][
                                    attribute
                                  ]
                                : initialDisplay) &&
                            !expandedAttributes[attribute] && (
                              <span
                                className="show_more"
                                onClick={() => handleShowMore(attribute)}
                              >
                                {productPhaseData && productPhaseData?.show_all}
                                <i
                                  className={`ri-${
                                    expandedAttributes[attribute]
                                      ? "subtract"
                                      : "add"
                                  }-line`}
                                ></i>
                              </span>
                            )
                          : ""}
                      </Accordion.Body>
                    </Accordion.Item>
                  </div>
                );
              }
            )}
        </Accordion>
        <Accordion className="table-accordion w-50 p-0 right-accordion">
          {Object.keys(getAttributeProductHalf(product, "second")).map(
            (attribute, index) => {
              return (
                <React.Fragment key={index}>
                  <Accordion.Item eventKey={index} key={index}>
                    <Accordion.Header as="div">
                      <div className="table-accordion-header">
                        {attribute}
                        <Questiontool
                          attributes={
                            product.attributes[attribute][0]?.attribute_category
                          }
                          productPhaseData={productPhaseData}
                        />
                      </div>
                      <span
                        className="count"
                        style={{
                          background:
                            product.attributes[attribute][0]
                              .attribute_evaluation >= 7.5
                              ? "#093673"
                              : product.attributes[attribute][0]
                                  .attribute_evaluation >= 5 &&
                                product.attributes[attribute][0]
                                  .attribute_evaluation < 7.5
                              ? "#437ECE"
                              : "#85B2F1",
                        }}
                      >
                        {product?.attributes[attribute][0]
                          .attribute_evaluation === 10
                          ? 10
                          : product?.attributes[
                              attribute
                            ][0].attribute_evaluation.toFixed(1)}
                      </span>
                      <div className="show-btn">
                        {productPhaseData && productPhaseData?.show_all}{" "}
                        <i className="ri-arrow-down-s-line"></i>
                      </div>
                      <div className="hide-btn">
                        {productPhaseData && productPhaseData?.hide_all}{" "}
                        <i className="ri-arrow-up-s-line"></i>
                      </div>
                    </Accordion.Header>
                    <Accordion.Body>
                      {loading == false ? (
                        product.attributes[attribute].map(
                          (attributeValues, valueIndex) => (
                            <React.Fragment key={valueIndex}>
                              <div
                                className="spec-section"
                                key={valueIndex}
                                style={{
                                  display:
                                    expandedAttributes[attribute] ||
                                    valueIndex < 5
                                      ? "block"
                                      : "none",
                                }}
                              >
                                <div className="spec-item">
                                  <div className="spec-col">
                                    <div className="query">
                                      {attributeValues?.attribute}

                                      <QuestionIcon
                                        attributes={
                                          attributeValues && attributeValues
                                        }
                                        productPhaseData={productPhaseData}
                                      />
                                    </div>
                                  </div>
                                  <div className="spec-col ">
                                    <div className="spec-col">
                                      {attributeValues.attribute_value !=
                                        productPhaseData?.yes &&
                                        attributeValues.attribute_value !=
                                          productPhaseData?.no && (
                                          <>
                                            <div
                                              className={`${
                                                attributeValues.attribute_value !==
                                                  "?" &&
                                                !attributeValues.attribute_value.includes(
                                                  "-"
                                                ) &&
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
                                                fontSize: "15px",
                                                textDecoration:
                                                  attributeValues.attribute_value !==
                                                    "?" &&
                                                  attributeValues?.hover_phase !==
                                                    ""
                                                    ? "underline"
                                                    : "",
                                                textDecorationStyle:
                                                  attributeValues.attribute_value !==
                                                    "?" &&
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
                                                textUnderlineOffset: "5px",
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
                                                    fontSize: "15px",
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
                                            {attributeValues?.info_not_verified && (
                                              <div
                                                className="tooltip-title"
                                                style={{
                                                  textDecoration: "none",
                                                  textDecorationLine: "none",
                                                  textDecorationStyle: "none",
                                                }}
                                              >
                                                {" "}
                                                <i style={{ opacity: "70%" }}>
                                                  {" "}
                                                  (?){" "}
                                                </i>
                                                <div
                                                  className="tooltip-display-content"
                                                  style={{
                                                    left: isMobile ? "50%" : 0,
                                                    transform: isMobile
                                                      ? "translateX(-20%)"
                                                      : "translateX(-10%)",
                                                    width: isMobile
                                                      ? "200px"
                                                      : "250px",
                                                    opacity: "100%",
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
                                        productPhaseData?.yes ||
                                        attributeValues.attribute_value ==
                                          productPhaseData?.no) && (
                                        <div
                                          className={`${
                                            attributeValues?.hover_phase !== ""
                                              ? "tooltip-title"
                                              : ""
                                          }`}
                                          style={{
                                            color:
                                              attributeValues.attribute_value ==
                                                productPhaseData?.yes &&
                                              attributeValues.attribute_is_same_as *
                                                100 <
                                                40
                                                ? "#0066b2"
                                                : attributeValues.attribute_value ==
                                                    productPhaseData?.no &&
                                                  attributeValues.attribute_is_worse_than *
                                                    100 >
                                                    60
                                                ? "red"
                                                : "#27304e",
                                            fontSize: "15px",
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
                                            textDecorationThickness: "1.5px",
                                            textDecorationColor:
                                              attributeValues.attribute_value ==
                                                productPhaseData?.yes &&
                                              // here I change attribute_is_better_than to attribute_is_same_as
                                              attributeValues.attribute_is_same_as *
                                                100 <
                                                40
                                                ? "#0066b2"
                                                : attributeValues.attribute_value ==
                                                    productPhaseData?.no &&
                                                  attributeValues.attribute_is_worse_than *
                                                    100 >
                                                    60
                                                ? "red"
                                                : "#27304e",
                                            textUnderlineOffset: "5px",
                                          }}
                                        >
                                          {/* here we use attribute_is_same_as and attribute_is_worse_than  */}
                                          {
                                            <span
                                              style={{
                                                color:
                                                  attributeValues.attribute_value ==
                                                    productPhaseData?.yes &&
                                                  attributeValues.attribute_is_same_as *
                                                    100 <
                                                    40
                                                    ? "#0066b2"
                                                    : attributeValues.attribute_value ==
                                                        productPhaseData?.no &&
                                                      attributeValues.attribute_is_worse_than *
                                                        100 >
                                                        60
                                                    ? "red"
                                                    : "#27304e",
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
                                                  : attributeValues.unit != null
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
                              </div>
                            </React.Fragment>
                          )
                        )
                      ) : (
                        <Skeleton
                          height={35}
                          count={
                            displayedAttributesCount[product.name] &&
                            displayedAttributesCount[product.name][attribute]
                              ? displayedAttributesCount[product.name][
                                  attribute
                                ]
                              : initialDisplay
                          }
                        />
                      )}
                      {loading == false
                        ? product.attributes[attribute].length >
                            (displayedAttributesCount[product.name] &&
                            displayedAttributesCount[product.name][attribute]
                              ? displayedAttributesCount[product.name][
                                  attribute
                                ]
                              : initialDisplay) &&
                          !expandedAttributes[attribute] && (
                            <span
                              className="show_more"
                              onClick={() => handleShowMore(attribute)}
                            >
                              {productPhaseData && productPhaseData?.show_all}
                              <i
                                className={`ri-${
                                  expandedAttributes[attribute]
                                    ? "subtract"
                                    : "add"
                                }-line`}
                              ></i>
                            </span>
                          )
                        : ""}
                    </Accordion.Body>
                  </Accordion.Item>
                </React.Fragment>
              );
            }
          )}
        </Accordion>
      </>
    );
  }
);

export default TechnicalAccordion;
