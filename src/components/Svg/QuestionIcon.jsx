import { useRef, useState } from "react";
import useScreenSize from "@/_helpers/useScreenSize";
import Product from "../Common/ProductListing/Product/Product";
import ProductPage from "@/app/_components/ProductPage";
import CompareDiv from "../Common/ComparisanComponent/CompareDiv";
import WhyAccordionTab from "../Product/WhyAccordionTab";

const QuestionIcon = ({
  attributes,
  productPhaseData,
  guidePhraseData,
  comparePhaseData,
  product,
}) => {
  const [tooltipPosition, setTooltipPosition] = useState({
    top: 0,
    left: 0,
  });
  const tooltipRef = useRef(null);

  function adjustTooltipPosition() {
    const tooltip = tooltipRef.current;
    if (!tooltip) return;

    const viewportWidth = document.documentElement.clientWidth;
    const isMobile = viewportWidth <= 768; // Example breakpoint for mobile/desktop

    // Calculate the desired width based on screen size
    const tooltipWidth = isMobile ? 140 : 250;

    // Calculate ideal left position for centered alignment
    const idealLeft = (viewportWidth - tooltipWidth) / 2;

    // Calculate the final left position to ensure the tooltip stays within the screen boundaries
    const left = Math.min(Math.max(0, idealLeft), viewportWidth - tooltipWidth);

    setTooltipPosition({ ...tooltipPosition, left, width: tooltipWidth });
  }
  // (product,"mahima")
  const { isMobile } = useScreenSize();
  return (
    <div
      className="question_hover_container question-marker-icon"
      onMouseOver={adjustTooltipPosition}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M12 19C12.8284 19 13.5 19.6716 13.5 20.5C13.5 21.3284 12.8284 22 12 22C11.1716 22 10.5 21.3284 10.5 20.5C10.5 19.6716 11.1716 19 12 19ZM12 2C15.3137 2 18 4.68629 18 8C18 10.1646 17.2474 11.2907 15.3259 12.9231C13.3986 14.5604 13 15.2969 13 17H11C11 14.526                         11.787 13.3052 14.031 11.3989C15.5479 10.1102 16 9.43374 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8V9H6V8C6 4.68629 8.68629 2 12 2Z"></path>
      </svg>
      {/* { (attributes)} */}
      {attributes !== undefined && (
        <div
          className="display-content"
          ref={tooltipRef}
          style={{
            left: isMobile ? "50%" : 0,
            transform: isMobile ? "translateX(-50%)" : "translateX(-10%)",
            width: isMobile ? "170px" : "250px",
          }}
        >
          {attributes?.description && (
            <div className="mb-2">
              {<Product /> && guidePhraseData && (
                <b>
                  {guidePhraseData.what_it_is}:{""}
                </b>
              )}
              {<ProductPage /> && productPhaseData && (
                <b>
                  {productPhaseData.what_it_is}:{""}
                </b>
              )}
              {<CompareDiv /> && comparePhaseData && (
                <b>
                  {comparePhaseData.what_it_is}:{""}
                </b>
              )}
              {<WhyAccordionTab /> && product && (
                <b>
                  {product?.page_phases?.what_it_is}:{""}
                </b>
              )}

              {`${" "} ${attributes?.description}`}
            </div>
          )}
          {attributes?.when_matters && (
            <div className="mb-2">
              {<Product /> && guidePhraseData && (
                <b>
                  {guidePhraseData.when_it_matters}:{""}
                </b>
              )}
              {<ProductPage /> && productPhaseData && (
                <b>
                  {productPhaseData.when_it_matters}:{""}
                </b>
              )}
              {<CompareDiv /> && comparePhaseData && (
                <b>
                  {comparePhaseData.when_it_matters}:{""}{" "}
                </b>
              )}
              {<WhyAccordionTab /> && product && (
                <b>
                  {product?.page_phases?.when_it_matters}:{""}
                </b>
              )}
              {/* <b> When it matters:{""}</b> */}
              {`${" "} ${attributes?.when_matters}`}
            </div>
          )}
          {attributes?.score_components && (
            <div className="mb-2">
              {<Product /> && guidePhraseData && (
                <b>
                  {guidePhraseData.score_components}: {""}
                </b>
              )}
              {<ProductPage /> && productPhaseData && (
                <b>
                  {productPhaseData.score_components}: {""}
                </b>
              )}
              {<CompareDiv /> && comparePhaseData && (
                <b>
                  {comparePhaseData.score_components}:{""}{" "}
                </b>
              )}
              {<WhyAccordionTab /> && product && (
                <b>
                  {product?.page_phases?.score_components}:{""}
                </b>
              )}
              {attributes.score_components &&
                attributes.score_components?.map((data, index) => {
                  const roundedNumber = parseFloat(data?.attribute_evaluation);
                  // {(data?.attribute_evaluation)}
                  const formattedNumber =
                    roundedNumber > 9
                      ? Math.floor(roundedNumber)
                      : roundedNumber.toFixed(1);
                  return (
                    <div className="scroe_section" key={index}>
                      <p className="text-end">{`${parseFloat(
                        data?.importance
                      ).toFixed(1)}%`}</p>
                      <span
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
                        {/* { (data?.attribute_evaluation)} */}
                        {formattedNumber != "NaN"
                          ? formattedNumber
                          : data?.attribute_evaluation}
                      </span>
                      <p style={{ textTransform: "none", color: "wh" }}>
                        {" "}
                        {data?.attribute_category
                          ?.replace(/-/g, " ")
                          .charAt(0)
                          .toUpperCase() +
                          data?.attribute_category
                            ?.replace(/-/g, " ")
                            .slice(1)
                            .toLowerCase()}
                      </p>
                    </div>
                  );
                })}
            </div>
          )}
          {attributes?.importance && (
            <p className="mb-2">
              {<Product /> && guidePhraseData && (
                <b>
                  {guidePhraseData.importance_text}: {""}
                </b>
              )}
              {<ProductPage /> && productPhaseData && (
                <b>
                  {productPhaseData.importance_text}: {""}
                </b>
              )}
              {<WhyAccordionTab /> && product && (
                <b>
                  {product?.page_phases?.importance_text}:{""}{" "}
                </b>
              )}
              {<CompareDiv /> && comparePhaseData && (
                <b>
                  {comparePhaseData.importance_text}:{""}{" "}
                </b>
              )}
              {attributes?.importance}
            </p>
          )}
          {attributes?.good_value && (
            <p className="mb-2">
              {<Product /> && guidePhraseData && (
                <b>
                  {guidePhraseData.good_value_text}:{""}{" "}
                </b>
              )}
              {<ProductPage /> && productPhaseData && (
                <b>
                  {productPhaseData.good_value_text}:{""}{" "}
                </b>
              )}
              {<WhyAccordionTab /> && product && (
                <b>
                  {product?.page_phases?.good_value_text}:{""}{" "}
                </b>
              )}
              {<CompareDiv /> && comparePhaseData && (
                <b>
                  {comparePhaseData.good_value_text}:{""}{" "}
                </b>
              )}
              {/* <b>Good value: </b> */}
              {attributes?.good_value}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
export default QuestionIcon;
