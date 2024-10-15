"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  Col,
  Container,
  Row,
  Accordion,
  Tab,
  Nav,
  Form,
  Button,
  Tabs,
} from "react-bootstrap";
import BreadCrumb from "@/components/Common/BreadCrumb/breadcrum";
import Image from "next/image";
import CompareModal from "@/components/Common/Comparison/CompareModal";
import ComparisonTable from "../CompareTable/ComparisonTable";
import {
  addCompareProduct,
  deleteCompareProduct,
  storeTextPartShortCode,
  updateCompareProduct,
} from "@/redux/features/compareProduct/compareProSlice";
import CompareForm from "../Comparison/CompareForm";
import CompareCard from "./CompareCard";
import CompareAccordionTab from "./CompareAccordionTab";
import { useDispatch, useSelector } from "react-redux";
import CompareDropDown from "@/components/Product/CompareDropDown";
import { useRouter } from "next/navigation";
import { getAttributeHalf } from "@/_helpers";
import ProductSlider from "../ProductSlider/productSlider";
import GuidePageTextArea from "../GuidePageOutline/GuidePageTextArea";
import axios from "axios";
import ReviewSlider from "../ReviewSlider/reviewSlider";
import { searchForPatternAndReplace } from "@/hooks/useChart";
import OutlineGenerator from "../OutlineGenerator/OutlineGenerator";
import ProductSliderBlog from "../ProductSliderBlog/ProductSliderBlog";
import ComparisionOutlineGenerator from "../OutlineGenerator/ComparisionOutlineGenerator";
import MobileComparisonTool from "../MobileComparisonTool/MobileComparisonTool";
import CompareRealtedGuide from "@/components/Product/CompareRealtedGuide";
import useScreenSize from "@/_helpers/useScreenSize";
import GraphReplacer from "@/_helpers/GraphReplacer";
import dynamic from "next/dynamic";

const MobileCompareTable = dynamic(
  () => import("@/components/Common/MobileCompareTable/MobileCompareTable"),
  {
    loading: () => <p>Loading...</p>, // You can customize this loading component
    ssr: false, // This makes sure the component is only loaded on the client-side
  }
);

function CompareDiv({
  slug,
  categorySlug,
  comparisonData,
  categroyAttributes,
  graphComparisonProsCons,
  getComparisonPhase,
  getProsConsforVsPage,
  compareTableData
}) {
  // const router = useRouter();
  const dispatch = useDispatch();
  const products = comparisonData.map((item) => item.data);

  // (products);
  const [isOpen, setIsOpen] = useState(false);
  const [compareProDataFirst, setCompareProDataFirst] = useState(
    (products[0] && products[0]) || []
  );

  const [compareProDataSec, setCompareProDataSec] = useState(
    (products[1] && products[1]) || []
  );
  const [compareProDataThird, setCompareProDataThird] = useState(
    (products[2] && products[2]) || []
  );
  const [otherPermalinks, setOtherPermalinks] = useState([]);
  // best alternative state
  const [bestAlternative, setBestAlternative] = useState([]);
  const [activeOutlineId, setActiveOutlineId] = useState("");

  const contentRef = useRef(null);

  const router = useRouter();

  // check slug have duplicate product have or not
  const isDuplicateProduct =
    slug.split("-vs-").length !== new Set(slug.split("-vs-")).size;
  // (isDuplicateProduct);
  useEffect(() => {
    const uniqueProducts = [...new Set(slug.split("-vs-"))];
    slug = uniqueProducts.join("-vs-");
    // redirect to new slug window
    // window.location.href = `/${categorySlug}/${slug}`;
    router.push(`/${categorySlug}/${slug}`);
  }, []);

  const handelRemoveProductFormComparison = (index) => {
    // Remove the last product's URL from the comparison store.
    let remainingProductUrl = "";
    if (index === 0) {
      setCompareProDataFirst([]);
      dispatch(deleteCompareProduct({ key: "productFirst" }));
      remainingProductUrl = [compareProDataSec, compareProDataThird];
    } else if (index === 1) {
      setCompareProDataSec([]);
      dispatch(deleteCompareProduct({ key: "productSecond" }));
      remainingProductUrl = [compareProDataThird, compareProDataFirst];
    } else if (index === 2) {
      dispatch(deleteCompareProduct({ key: "productThird" }));
      setCompareProDataThird([]);
      remainingProductUrl = [compareProDataFirst, compareProDataSec];
    }
    // Optionally, you can store the updated permalinks array in state
    const updatedPermalinks = [...remainingProductUrl, ...otherPermalinks];
    let removeEmptyArray = updatedPermalinks.filter(
      (item) =>
        item !== "" &&
        typeof item !== "undefined" &&
        Object.keys(item).length !== 0
    );
    // Log the last remaining product URL
    if (removeEmptyArray.length === 1) {
      const lastPermalink = removeEmptyArray[0];
      window.location.href = `/${lastPermalink?.category_url}/${lastPermalink?.permalink}`;
      // router.push(
      //   `/${lastPermalink?.category_url}/${lastPermalink?.permalink}`
      // );
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);
  // prepare data for comparison table component
  const comparisonTableProductData = [
    compareProDataFirst,
    compareProDataSec,
    compareProDataThird,
  ];
  // This funcation rmeove undefined and empty object
  let comparisonProductData = comparisonTableProductData.filter(
    (item) =>
      item !== "" &&
      typeof item !== "undefined" &&
      Object.keys(item).length !== 0
  );
  // (comparisonProductData?.length);

  const productCopy = comparisonProductData;
  const productAttributes = {};
  comparisonProductData[0]?.attributes?.forEach((attribute) => {
    // Extract the category name for the attribute
    const categoryName = attribute?.attribute_category?.name;
    // Check if the category name exists in the productAttributes object

    if (!productAttributes[categoryName]) {
      // If not, create an empty array for the category
      productAttributes[categoryName] = [];
    }
    // Push the current attribute to the array corresponding to its category
    productAttributes[categoryName]?.push(attribute);
  });
  productCopy["attributes"] = productAttributes;
  // (comparisonTableProductData)
  // (productAttributes);

  // best alternative api call
  useEffect(() => {
    const config = {
      headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}` },
    };
    axios
      .get(
        `${process.env.NEXT_PUBLIC_API_URL}/compare/products?slug=${slug}`,
        config
      )
      .then((res) => {
        setBestAlternative(res.data?.data);
        // (res?.data?.data);
      })
      .catch((err) => {
        err;
      });
  }, []);

  const addIdsToHeadings = (content) => {
    const headings = content?.match(/<h[2-6][^>]*>.*?<\/h[2-6]>/g) || [];

    headings.forEach((heading) => {
      const id = heading
        .replace(/<\/?[^>]+(>|$)/g, "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-");
      const newHeading = heading.replace(">", ` id="${id}">`);
      content = content.replace(heading, newHeading);
    });

    return content;
  };

  let contentWithIds;
  if (bestAlternative?.text_part) {
    // (bestAlternative,"check alternative")
    contentWithIds = addIdsToHeadings(bestAlternative.text_part);
  } else {
    // Handle the case where bestAlternative.text_part is undefined
    contentWithIds = "";
  }
  // const contentWithIds = addIdsToHeadings(bestAlternative?.text_part);

  const { isMobile } = useScreenSize();

  // get graph code

  const getGuideTextPartShortcode = useSelector(
    (state) => state.comparePro.text_part_main?.content
  );
  useEffect(() => {
    const replaceShortcodes = () => {
      const elements = document.querySelectorAll(".addClassData");
      elements.forEach((element) => {
        if (!element.classList.contains("observed")) {
          element.classList.add("observed");
          let innerHTML = element.innerHTML;
          const shortCodepatternsRE =
            /\[(pie-chart|vertical-chart|horizontal-chart|correlation-chart)-\d+\]/g;

          innerHTML = innerHTML.replace(shortCodepatternsRE, (match) => {
            return `<span class="chart-placeholder" data-shortcode="${match}">${match}</span>`;
          });
          innerHTML;

          element.innerHTML = innerHTML;
          dispatch(storeTextPartShortCode({ content: innerHTML }));
        }
      });
    };

    // Delay the execution of replaceShortcodes to ensure the elements are rendered
    const timeoutId = setTimeout(replaceShortcodes, 100);

    const observer = new MutationObserver(replaceShortcodes);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Cleanup function to clear timeout and disconnect observer
    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, []);
  // (contentWithIds);
  // console.log(getComparisonPhase?.text);
  return (
    <>
      <section className="product-header">
        <Container>
          <Row className="align-items-center">
            <Col md={12}>
              <BreadCrumb
                productPhaseData={getComparisonPhase?.page_phases}
                pageType="comparision"
                firstPageName={categorySlug}
                secondPageName={`${compareProDataFirst?.name || ""} vs ${
                  compareProDataSec?.name || ""
                } ${
                  compareProDataThird?.name
                    ? `vs ${compareProDataThird?.name}`
                    : ""
                }`}
              />
            </Col>
            <Col md={12}>
              {/* {bestAlternative?.page_phases} */}
              <h1 className="site-main-heading">
                {compareProDataFirst?.name} vs {compareProDataSec?.name}{" "}
                {compareProDataThird?.name && `vs ${compareProDataThird?.name}`}
              </h1>
            </Col>
          </Row>
          <Row className="w-100 m-0">
            <div className="col-md-12">
              <p className="product-inner-content">
                {getComparisonPhase?.text}
              </p>
            </div>
          </Row>
        </Container>
      </section>
      <section>
        <Container>
          <Row>
            <Col md={12} className="table-section-mobile">
              <div className="comparison-tool">
                {/* First Crd */}
                {/* {(bestAlternative?.page_phases)} */}
                <CompareCard
                  productPhaseData={
                    getComparisonPhase && getComparisonPhase?.page_phases
                  }
                  compareProduct={compareProDataFirst}
                  products={products}
                  productIndex={0}
                  setIsOpen={setIsOpen}
                  handelRemoveProductFormComparison={
                    handelRemoveProductFormComparison
                  }
                />
                <div className="comparison-vs-img">
                  <Image src="/images/vs.svg" width={118} height={40} alt="" />
                </div>
                {/* second  Card*/}
                {/* {(bestAlternative,"hello")} */}
                <CompareCard
                  productPhaseData={
                    getComparisonPhase && getComparisonPhase?.page_phases
                  }
                  compareProduct={compareProDataSec}
                  products={products}
                  productIndex={1}
                  setIsOpen={setIsOpen}
                  handelRemoveProductFormComparison={
                    handelRemoveProductFormComparison
                  }
                />
                <div className="comparison-vs-img">
                  <Image src="/images/vs.svg" width={118} height={40} alt="" />
                </div>
                {/* Third Card */}
                <CompareCard
                  productPhaseData={
                    getComparisonPhase && getComparisonPhase?.page_phases
                  }
                  compareProduct={compareProDataThird}
                  products={products}
                  productIndex={2}
                  setIsOpen={setIsOpen}
                  handelRemoveProductFormComparison={
                    handelRemoveProductFormComparison
                  }
                />
              </div>
            </Col>
            <Col md={12} className="table-section-desktop">
              <MobileComparisonTool
                compareProduct={comparisonTableProductData}
                handelRemoveProductFormComparison={
                  handelRemoveProductFormComparison
                }
                productPhaseData={getComparisonPhase && getComparisonPhase}
              />
            </Col>
          </Row>
          {/* {(bestAlternative,"hello mahi")} */}
          {/* {(bestAlternative?.page_phases)} */}
          {getComparisonPhase?.verdict_text &&
            getComparisonPhase?.verdict_text &&
            getComparisonPhase?.verdict_text !== "" &&
            getComparisonPhase?.verdict_text !== null && (
              <Row>
                <div className="box__content__section">
                  <h2 class="site-main-heading">
                    {getComparisonPhase?.page_phases?.verdict_text_heading}
                  </h2>
                  <div
                    className="box__content__section__textarea"
                    dangerouslySetInnerHTML={{
                      __html: getComparisonPhase?.verdict_text,
                    }}
                  ></div>
                </div>
              </Row>
            )}
        </Container>
      </section>
      <section className="ptb-80 bg-color">
        <Container>
          <Row>
            <Col md={12}>
              <h2 className="site-main-heading">
                {comparisonData?.length > 2
                  ? getComparisonPhase &&
                    getComparisonPhase?.page_phases
                      ?.three_products_graph_comparison
                  : getComparisonPhase &&
                    getComparisonPhase?.page_phases
                      ?.two_products_graph_comparison}
              </h2>
            </Col>
          </Row>

          <CompareAccordionTab
            comparePhaseData={getComparisonPhase?.page_phases}
            sendProductProps={comparisonProductData}
            categorySlug={categorySlug}
            product={graphComparisonProsCons}
            pageType={"comparison"}
            getComparisonPhase={getComparisonPhase}
            getProsConsforVsPage={getProsConsforVsPage}
          />
        </Container>
      </section>
      {getComparisonPhase && getComparisonPhase?.text_part !== null && (
        <section className="contentSec my-3">
          <Container>
            <div className="custom-row">
              <div className="left-side-bar">
                <div className="outline-section">
                  <p>
                    {getComparisonPhase &&
                      getComparisonPhase?.page_phases?.outline}
                  </p>
                  {getComparisonPhase?.text_part && (
                    <ComparisionOutlineGenerator
                      currentIndexId={activeOutlineId}
                      blogData={getComparisonPhase?.text_part}
                    />
                  )}
                </div>
              </div>
              <div className="center-section ">
                {getGuideTextPartShortcode !== undefined ? (
                  <div
                    id="shortCodeText"
                    ref={contentRef}
                    className="addClassData content-para mt-1"
                    dangerouslySetInnerHTML={{
                      __html: getGuideTextPartShortcode,
                    }}
                  />
                ) : (
                  <div
                    id="shortCodeText"
                    ref={contentRef}
                    className="addClassData content-para mt-1"
                    dangerouslySetInnerHTML={{ __html: contentWithIds }}
                  />
                )}

                {/* <div className="social-icon items-icon">
                  <div className="twitter">
                    <i className="ri-twitter-fill"></i>
                  </div>
                  <div className="facebook">
                    <i className="ri-facebook-fill"></i>
                  </div>
                  <div className="printerest">
                    <i className="ri-pinterest-fill"></i>
                  </div>
                  <div className="linkedIn">
                    <i className="ri-linkedin-fill"></i>
                  </div>
                </div> */}
              </div>

              <div className="mobile-hide right-side-bar productSlider-Container">
                <Row className="mt-3">
                  <Col md={12}>
                    <div className="heading-primary secondary mb-2">
                      {getComparisonPhase &&
                        getComparisonPhase?.page_phases?.related_guides_sidebar}
                    </div>
                  </Col>
                  <Col md={12}>
                    <ProductSliderBlog
                      favSlider={getComparisonPhase?.related_guides}
                    />
                  </Col>
                </Row>
              </div>
            </div>
          </Container>
        </section>
      )}
      {/* {console.log(getComparisonPhase?.page_phases)} */}
      {getComparisonPhase &&
        getComparisonPhase?.should_buy_product_one?.length > 0 && (
          <section className="ptb-80 bg-color">
            <Container>
              <Row>
                <Col md={12}>
                  <h2 className="site-main-heading">
                    {comparisonData?.length > 2
                      ? getComparisonPhase?.page_phases
                          ?.three_products_should_buy
                      : getComparisonPhase &&
                        getComparisonPhase?.page_phases
                          ?.two_products_should_buy}
                    {/* Should You Buy {compareProDataFirst?.name} or{" "}
                    {compareProDataSec?.name}{" "}
                    {compareProDataThird?.name &&
                      `or ${compareProDataThird?.name}`} */}
                  </h2>
                </Col>
                <Col md={6}>
                  <div className="pros-corns-section pros">
                    <div className="pros-header">
                      {bestAlternative?.page_phases?.when_should_buy}
                      {/* Who SHOULD BUY {compareProDataFirst?.name}? */}
                    </div>
                    {bestAlternative?.should_buy_product_one?.length === 0 && (
                      <h3 className="no-data text-center mt-2">
                        No data Found
                      </h3>
                    )}
                    {/* {(product?.should_not_buy)} */}
                    <ul>
                      {bestAlternative &&
                        bestAlternative?.should_buy_product_one?.map(
                          (item, index) => {
                            return (
                              <>
                                <li
                                  key={index}
                                  style={{ color: "rgba(39, 48, 78, 0.7)" }}
                                >
                                  {item}
                                </li>
                              </>
                            );
                          }
                        )}
                    </ul>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="pros-corns-section pros">
                    <div className="pros-header">
                      {bestAlternative?.page_phases?.when_should_buy}
                      {/* Who SHOULD NOT BUY {compareProDataSec?.name} ? */}
                    </div>
                    {bestAlternative?.should_buy_product_two?.length === 0 && (
                      <h3 className="no-data text-center mt-2">
                        No data Found
                      </h3>
                    )}
                    <ul className="cross">
                      {bestAlternative &&
                        bestAlternative?.should_buy_product_two?.map(
                          (item, index) => {
                            return (
                              <>
                                <li
                                  key={index}
                                  style={{ color: "rgba(39, 48, 78, 0.7)" }}
                                >
                                  {item}
                                </li>
                              </>
                            );
                          }
                        )}
                    </ul>
                  </div>
                </Col>
              </Row>
            </Container>
          </section>
        )}
      <section className="ptb-80">
        <Container>
          <Row>
            <Col md={12}>
              <h2 className="site-main-heading">
                {comparisonData?.length > 2
                  ? bestAlternative &&
                    bestAlternative?.page_phases
                      ?.three_products_table_compare_title
                  : bestAlternative &&
                    bestAlternative?.page_phases
                      ?.two_products_table_compare_title}
              </h2>
            </Col>
            <Col md={12} className="table-section-mobile">
              <ComparisonTable
                comparisonPhaseData={
                  bestAlternative && bestAlternative?.page_phases
                }
                products={comparisonProductData}
                categoryAttributes={categroyAttributes}
                productAttributes={productAttributes}
                compareTableData={compareTableData}
              />
            </Col>
            {/* <Col md={12} className="table-section-desktop">
              <MobileCompareTable
                productPhaseData={
                  bestAlternative && bestAlternative?.page_phases
                }
                products={comparisonProductData}
                categoryAttributes={categroyAttributes}
                slug={slug}
              />
            </Col> */}
          </Row>
        </Container>
      </section>

      <section className="mobile-table-section">
        {/* {isMobile ? (
          <Container>
            <h2 className="site-main-heading pt-5 m-3">
            {bestAlternative &&
            {/* <h2 className="site-main-heading pt-5 m-3">
              {bestAlternative &&
                bestAlternative?.page_phases?.table_compare_title}
            </h2>
          </Container>
        ) : null} */}
        <Container className="p-0">
          <Row className="table-section-desktop p-0 m-0">
            <Col md={12} className="p-0">
              {/* {(compareByCatID?.data?.length)} */}
              {
                isMobile ? (
                  <MobileCompareTable
                    productPhaseData={
                      bestAlternative && bestAlternative?.page_phases
                    }
                    products={comparisonProductData}
                    categoryAttributes={categroyAttributes}
                    slug={slug}
                    type="compare"
                  />
                ) : null // or any other fallback content for non-mobile
              }
            </Col>
          </Row>
        </Container>
      </section>
      <section className="ptb-80 bg-color">
        <Container>
          <Row>
            <Col md={12}>
              <h2 className="site-main-heading">
                {bestAlternative &&
                  bestAlternative?.page_phases?.compare_with_other_products}
              </h2>
              {/* {(bestAlternative?.page_phases)} */}
              <CompareForm
                favSlider={bestAlternative && bestAlternative?.page_phases}
                location="ON_MAIN_PAGE"
                comparisonData={products && products}
                handelCloseCompareModel={() => {}}
              />
            </Col>
          </Row>
        </Container>
      </section>
      <CompareDropDown
        categorySlug={categorySlug}
        product={bestAlternative && bestAlternative}
        slug={slug}
        attributeDropDown={[...categroyAttributes].reverse()}
      />
      <section className="mt-3">
        <Container>
          <Row>
            <Col md={12}>
              <h2 className="site-main-heading">
                {bestAlternative &&
                  bestAlternative?.page_phases?.best_alternative}
              </h2>
              {bestAlternative?.alternative_products ? (
                <ReviewSlider
                  favSlider={bestAlternative?.alternative_products}
                />
              ) : (
                <p>No Data Found</p>
              )}
            </Col>
          </Row>
        </Container>
      </section>
      <section>
        <Container>
          <Row className="my-3">
            <Col md={12}>
              <h2 className="heading-primary secondary related-guides">
                {bestAlternative &&
                  bestAlternative?.page_phases?.related_guides_bottom}
              </h2>
            </Col>
            <Col md={12}>
              <CompareRealtedGuide
                favSlider={bestAlternative?.related_guides}
              />
            </Col>
          </Row>
        </Container>
      </section>
      {isOpen && (
        <CompareModal
          location={"comparison"}
          setIsOpen={setIsOpen}
          favSlider={bestAlternative}
          compareProDataFirst={{
            name: compareProDataFirst?.name,
            permalink: compareProDataFirst?.permalink,
            category_id: compareProDataFirst.category_id,
            category_url: compareProDataFirst.category_url,
          }}
          compareProDataSec={{
            name: compareProDataSec?.name,
            permalink: compareProDataSec?.permalink,
            category_id: compareProDataSec.category_url,
            category_url: compareProDataSec.category_url,
          }}
        />
      )}
      <GraphReplacer />
    </>
  );
}

export default CompareDiv;
