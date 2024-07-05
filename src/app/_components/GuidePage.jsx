"use client";
import React, { useEffect, useState, useRef } from "react";
import useChart, { searchForPatternAndReplace } from "@/hooks/useChart";
import Image from "next/image";
import { Button, Col, Container, Row, Table, Form } from "react-bootstrap";
import Link from "next/link";
import BreadCrumb from "@/components/Common/BreadCrumb/breadcrum";
import Filter from "@/components/Common/Filter/Filter";
import ProductListing from "@/components/Common/ProductListing/ProductListing";
import ProductSlider from "@/components/Common/ProductSlider/productSlider";
import ProductSkeleton from "@/components/Common/ProductListing/ProductSkeleton";
import CompareTable from "@/components/Common/CompareTable/CompareTable";
import BottomBar from "@/components/Common/BottomBar/BottomBar";
import { isAreObjectsEqual } from "@/_helpers";
import GuidePagination from "@/components/Common/Pagination/GuidePagination";
import { useRouter } from "next/navigation";
import GuidePageTextArea from "@/components/Common/GuidePageOutline/GuidePageTextArea";

import useScreenSize from "@/_helpers/useScreenSize";
import dynamic from "next/dynamic";
import Loader from "./Loader";
import { Hourglass } from "react-loader-spinner";
const MobileCompareGuideTable = dynamic(
  () =>
    import("@/components/Common/MobileCompareTable/MobileCompareGuideTable"),
  {
    loading: () => <p>Loading...</p>, // You can customize this loading component
    ssr: false, // This makes sure the component is only loaded on the client-side
  }
);

export default function GuidePage({
  slug,
  categorySlug,
  guideData,
  attributesForTable,
  productForTable,
  filters,
  searchParams,
  category_id,
}) {
  const router = useRouter();
  const currentParams = new URLSearchParams(searchParams.toString());
  const [isShown, setIsShown] = useState(false);
  const [currentHeading, setCurrentHeading] = useState("");

  const guide = guideData[0]?.data;

  const products = guideData[1]?.data?.products || [];
  const sidebarRef = useRef(null);

  //I introduce this new value to map the actial postion of product in guide order_values in backend.
  const productPosition = guideData[1]?.data?.product_names || [];
  const productPagination = guideData[1]?.data?.pagination;
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [prevSearcParam, setPrevSearcParam] = useState({});
  const [removedParam, setremovedParam] = useState();

  const [order, setorder] = useState({
    value: "",
    ischecked: false,
  });
  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };
  const sortRangeAttributeArray = useRef([
    { algo: "", rangeAttributes: "Overall" },
  ]);
  const [manageCollapsedDiv, setManageCollapsedDiv] = useState(false);
  const [params, setparams] = useState(searchParams);
  const handleManageCollapsedDiv = () => {
    setManageCollapsedDiv(true);
  };
  const handelSetFilterActive = (status) => {
    setIsFilterActive(status);
    // (status,"check status")a
  };
  useEffect(() => {
    setPrevSearcParam(searchParams);
  }, []);
  // (searchParams)

  useEffect(() => {
    if (Object.keys(searchParams).length > 0) {
      // Show loader when filter is applied
      handelSetFilterActive(true);

      setTimeout(() => {
        handelSetFilterActive(false);
      }, 1000);
    } else {
      // Show loader when filter is removed
      // handelSetFilterActive(true);

      setTimeout(() => {
        handelSetFilterActive(false);
      }, 1000);
    }
  }, [searchParams]);
  // console.log(removedParam)

  // This function removeQueryParamAndNavigate is used to remove a query parameter from the URL
  function removeQueryParamAndNavigate(url, paramToRemove) {
    // delete searchParams[`${paramToRemove}`];

    console.log(url, paramToRemove);

    if (paramToRemove != "sort") {
      setparams(() => {
        return {
          ...searchParams,
        };
      });
    } else {
      delete params.sort;
      let removeSortParam = params;

      setparams(() => {
        return {
          ...removeSortParam,
        };
      });
    }
    handelSetFilterActive(true);

    setTimeout(() => {
      handelSetFilterActive(false);
    }, 1000);
    const urlObject = new URL(url);
    urlObject.searchParams.delete(paramToRemove);
    const newUrl = urlObject.toString();
    // Update the URL in the address bar without triggering a page reload
    window.history.pushState({ path: newUrl }, "", newUrl);
    router.replace(newUrl, { scroll: false });
    // You can also use window.location.href = newUrl; if you want to trigger a page reload
    // Optionally, you can perform additional actions
    // location.reload();
    handelSetFilterActive(true);

    setTimeout(() => {
      handelSetFilterActive(false);
    }, 1000);
    return newUrl;
  }

  useEffect(() => {
    setparams(() => {
      return {
        ...searchParams,
      };
    });
  }, [searchParams]);
  const handleSort = (sortAttribute) => {
    // (sortAttribute, "neet");
    let param = JSON.parse(sortAttribute);

    // (param.rangeAttributes);
    if (param.algo) {
      const currentUrl = new URL(window.location.href);
      // (currentUrl);
      const searchParam = new URLSearchParams(currentUrl.search);
      const sortValue = `${param.algo},${param.rangeAttributes}`;
      // (sortValue);
      setorder((prev) => {
        return {
          value: sortValue,
          ischecked: true,
        };
      });
    } else {
      removeQueryParamAndNavigate(window.location.href, "sort");
      delete searchParams.sort;
    }
  };

  // (products, "hello");
  // Testing purpose
  const [isChecked, setIsChecked] = useState(
    products?.length < 12 ? false : true
  );

  // Handle case-insensitive variant query parameter

  const [hideSmiliar, setHideSmiliar] = useState(true);

  let updatedParams = {};

  const handelFilterActions = (filterName, key, value, isChecked = false) => {
    const currentParams = new URLSearchParams(searchParams.toString());
    // (value);
    const url = new URL(window.location.href);
    switch (filterName) {
      case "variant":
        if (!value) {
          updatedParams.variant = value;
        } else {
          deleteQueryFormURL(key, updatedParams, currentParams, url);
          deleteQueryFormURL("direct", updatedParams, currentParams, url);

          // setHideSmiliar(false);
        }
        break;
      case "available":
        if (!value) {
          updatedParams.available = value;
        } else {
          deleteQueryFormURL(key, updatedParams, currentParams, url);
        }
        break;
      default:
        return;
    }

    Object.entries(updatedParams).forEach(([paramKey, paramValue]) => {
      currentParams.set(paramKey, paramValue);
      url.searchParams.set(paramKey, paramValue);
    });
    // Update the URL without triggering a page reload (hack)
    window.history.pushState({}, "", url.toString());
    //call the next router for srr
    // (url.searchParams.toString());
    router.push(`?${url.searchParams.toString()}`, { scroll: false });
  };

  const deleteQueryFormURL = (key, updatedParams, currentParams, url) => {
    delete updatedParams[key];
    currentParams.delete([key]);
    url.searchParams.delete([key]);
  };
  // const handleChange = (e) => {
  //   const checked = e.target.checked;
  //   setIsChecked(checked);
  //   handelFilterActions("available", "available", checked);
  // };
  const handleHideSmiliar = (e) => {
    const checked = e.target.checked;
    setHideSmiliar(checked);
    handelFilterActions("variant", "variant", checked);
  };
  // (order)

  // (products,"neet");
  const swapPriceWebsites = (data) => {
    // Similar logic to sort elements based on price_websites
    const splitData = order?.value.split(",");
    const currentParams = new URLSearchParams(searchParams.toString());
    // (order.value);

    // (splitData[0]);
    if (splitData[0] === "available") {
      const sortedData = data.sort((a, b) => b.overall_score - a.overall_score);
      return [...sortedData];
    } else {
      const withWebsites = data.filter((item) => item.price_websites?.length);
      const withoutWebsites = data.filter(
        (item) => !item.price_websites?.length
      );
      return [...withWebsites, ...withoutWebsites];
    }
  };
  const sortedData = swapPriceWebsites(products);

  // (sortedData);

  // toggle mobile filter
  const openClick = (event) => {
    setIsShown(true);
    document.body.classList.add("filter--sidebar--open");
  };
  const closeClick = (event) => {
    setIsShown(false);
    document.body.classList.remove("filter--sidebar--open");
  };

  // this code for when click outside of sidebar then close sidebar

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsShown(false);
        document.body.classList.remove("filter--sidebar--open");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const { isMobile, isSmallDevice } = useScreenSize();

  useEffect(() => {
    const blockClicks = (event) => {
      event.preventDefault();
    };

    // Add the event listener to block clicks after 3 seconds
    const timer = setTimeout(() => {
      document.addEventListener("mousedown", blockClicks);

      // Remove the event listener after 5 seconds
      const unblockTimer = setTimeout(() => {
        document.removeEventListener("mousedown", blockClicks);
      }, 5000);

      // Cleanup unblockTimer when the component unmounts
      return () => clearTimeout(unblockTimer);
    }, 3000);

    // Cleanup the timer when the component unmounts
    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", blockClicks);
    };
  }, []);

  return (
    <>
      <section className="product-header">
        <Container>
          <Row className="align-items-center">
            <Col md={12}>
              <BreadCrumb
                firstPageName={categorySlug}
                secondPageName={guide}
                productPhaseData={guide && guide?.page_phases}
              />
            </Col>
            <Col md={12} lg={12} xl={9}>
              <h1 className="site-main-heading">{guide?.heading_title}</h1>
            </Col>

            <Col md={12} lg={12} xl={3}>
              <div className="user-info-section">
                {guide?.author && (
                  <div className="user-section">
                    {guide?.author?.image && (
                      <img
                        src={
                          guide?.author?.image
                            ? guide?.author?.image
                            : "/images/user.png"
                        }
                        width={0}
                        height={0}
                        sizes="100%"
                        alt="author"
                      />
                    )}

                    <div className="user-detail">
                      {/* {   (guide)} */}
                      <p>
                        <a href={`/author/${guide?.author?.id}`}>
                          {guide?.author?.name}
                        </a>
                      </p>
                    </div>
                  </div>
                )}
                <span>
                  {guide && guide?.page_phases?.updated}
                  <i> {guide?.updated_at}</i>
                </span>
              </div>
            </Col>
            <Col md={12}>
              <div
                className="product-inner-content"
                dangerouslySetInnerHTML={{
                  __html: searchForPatternAndReplace(guide?.text_first_part),
                }}
              />
            </Col>
          </Row>

          <Row className="pt-3 best-page-card">
            {/* {(guide)} */}
            {Object?.values(guide?.top_guide_counts).map(function (
              item,
              index
            ) {
              return (
                <Col className="p-2" md={6} lg={3} sm={6} xs={6} key={index}>
                  <div className="hero-card-content">
                    <span className="count">{item.count}</span>
                    <span className="card-heading">{item.heading}</span>
                  </div>
                </Col>
              );
            })}
          </Row>
        </Container>
      </section>
      <section className="ptb-25">
        <Container>
          {guideData[0]?.data?.show_catchy_titles_in_text === 1 &&
            guideData[0]?.data?.catchy_titles?.length > 0 && (
              <Row className="catchy_titles_section mb-3">
                <Col md={7} className="mx-auto p-0">
                  <p>
                    {guideData[0]?.data?.catchy_titles_box_title ||
                      "No title found"}
                  </p>
                  <ul className="text-center">
                    {guideData[0]?.data?.catchy_titles?.map((item, index) => (
                      <li key={index}>
                        <span className="catchy_titles_section_title">
                          {item.title}:
                        </span>
                        <span className="catchy_titles_section_product_name">
                          {/* {(item)} */}
                          {item?.product?.url !== null ? (
                            <a
                              rel="noopener noreferrer"
                              target="_blank"
                              href={`/link?p=${btoa(item?.product.url)}`}
                            >
                              {item.product.name}
                            </a>
                          ) : (
                            <span>{item?.product?.name}</span>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                </Col>
              </Row>
            )}

          <Row>
            <Col md={12}>
              <div
                className="para_content_text"
                dangerouslySetInnerHTML={{
                  __html: searchForPatternAndReplace(guide?.text_second_part),
                }}
              />
            </Col>
          </Row>
        </Container>
      </section>
      <Container>
        <Row>
          <Col
            md={12}
            lg={3}
            xl={3}
            className={
              isShown ? "sidebar-width sidebar--open" : "sidebar-width"
            }
            ref={sidebarRef}
            // style={{ display: isShown ? "block" : "none" }}
          >
            <div className="desktop-hide">
              <div className="header--section">
                <span style={{ fontSize: "1rem" }}>
                  {" "}
                  <i className="ri-equalizer-line"></i>{" "}
                  {guide?.page_phases?.filter_text}
                </span>
                <i class="ri-close-circle-line" onClick={closeClick}></i>
              </div>
            </div>
            <Filter
              guidePhraseData={guide && guide?.page_phases}
              categoryAttributes={filters}
              searchParam={searchParams}
              removedParam={removedParam}
              orderBy={order}
              setremovedParam={setremovedParam}
            />
            <div className="desktop-hide">
              {/* {(Object.keys(searchParams).length)} */}

              <Button
                className="site_main_btn w-100 d-block btn-icon mb-4"
                onClick={closeClick}
              >
                {/* <i className="ri-close-fill"></i> */}
                {guide?.page_phases?.see_product_text}
              </Button>
            </div>
          </Col>
          <Col md={12} lg={9} xl={9} className="main-content">
            <Row className="mobile-hide"></Row>
            <Row className="desktop-hide">
              <Col sm={6} xs={12}>
                <Button
                  className="site_main_btn w-100 d-block btn-icon"
                  onClick={openClick}
                >
                  <i className="ri-filter-line"></i>
                  {guide?.page_phases?.filter_text}
                </Button>
              </Col>
              <Col sm={6} xs={12}>
                <div className="filtered-data-select">
                  <span>{guide && guide?.page_phases?.order_by}:</span>
                  <Form.Select
                    aria-label="Default select example"
                    className="mobile__filter"
                    onChange={(e) => handleSort(e.target.value)}
                  >
                    {/* <option>Autonomy</option> */}
                    <option
                      value={JSON.stringify({
                        algo: "remove",
                        rangeAttributes: "Overall",
                      })}
                    >
                      {guide && guide?.page_phases?.overall_available}
                    </option>
                    <option
                      value={JSON.stringify({
                        algo: "available",
                        rangeAttributes: "false",
                      })}
                    >
                      {guide && guide?.page_phases?.overall_available}
                    </option>

                    <option
                      value={JSON.stringify({
                        algo: "high-low",
                        rangeAttributes: "technical_score",
                      })}
                    >
                      {guide && guide?.page_phases?.technical_score}
                    </option>
                    <option
                      value={JSON.stringify({
                        algo: "low-high",
                        rangeAttributes: "price",
                      })}
                    >
                      {guide && guide?.page_phases?.price_lowest_to_highest}
                    </option>
                    <option
                      value={JSON.stringify({
                        algo: "high-low",
                        rangeAttributes: "price",
                      })}
                    >
                      {guide && guide?.page_phases?.price_highest_to_lowest}
                    </option>
                    <option
                      value={JSON.stringify({
                        algo: "high-low",
                        rangeAttributes: "rating",
                      })}
                    >
                      {" "}
                      {guide && guide?.page_phases?.users_ratings}
                    </option>
                    <option
                      value={JSON.stringify({
                        algo: "high-low",
                        rangeAttributes: "ratio_quality_price_points",
                      })}
                    >
                      {guide && guide?.page_phases?.ratio_quality_price_points}
                    </option>
                    <option
                      value={JSON.stringify({
                        algo: "high-low",
                        rangeAttributes: "popularity_points",
                      })}
                    >
                      {guide && guide?.page_phases?.popularity}
                    </option>

                    {
                      // Technical score --- will be ordered from highest to lowest, based on numbers in "Technical Score Points CONVERTED"
                      // Price (Lowest to Highest) --- will be ordered from lowest to highest price, based on numbers in "Lowest Price"
                      // Price (Highest to Lowest) --- will be ordered from highest to lowest price, based on numbers in "Highest Price"
                      // User's rating --- will be ordered from highest to lowest price, based on numbers in "User's Rating"
                      // Ratio quality-price ---- will be ordered from highest to lowest, based on numbers in "Ratio Quality Price Points"
                      // Popularity --- will be ordered from highest to lowest, based on numbers in "Popularity points"

                      sortRangeAttributeArray?.current.map(
                        (algoAttribute, attrIndex) => {
                          if (algoAttribute?.rangeAttributes != "Overall")
                            return (
                              <option
                                value={JSON.stringify(algoAttribute)}
                                key={attrIndex}
                              >
                                {algoAttribute?.rangeAttributes}
                                {algoAttribute?.algo == "lowest_to_highest" &&
                                  " (Lowest to Highest)" &&
                                  "available"}
                              </option>
                            );
                        }
                      )
                    }
                  </Form.Select>
                </div>
              </Col>
              <Col sm={12} xs={12}>
                <div className="sidebar_filter">
                  <div className="tooltip-title">
                    {" "}
                    {guide && guide?.page_phases?.hide_similar}
                    <div className="tooltip-display-content">
                      <p>{guide?.page_phases?.hide_similar_hover_phrase}</p>
                    </div>
                    <div className="custom-switch form-switch">
                      <input
                        required=""
                        className="form-check-input"
                        type="checkbox"
                        id={`variant`}
                        onChange={handleHideSmiliar}
                        checked={hideSmiliar}
                      />
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
            <Row className="m-0">
              <Col md={6}>
                <div className="filtered-data">
                  {/* {(Object.keys(params)?.length)} */}
                  {/* This code renders a list of filters that have been applied to the current page. */}
                  <ul>
                    {Object.keys(params)
                      .filter((key) => key !== "direct" && key !== "sort")
                      .map((categoryName, index) =>
                        categoryName === "variant" ||
                        categoryName === "available" ||
                        categoryName === "page" ? (
                          ""
                        ) : (
                          <li key={index}>
                            {categoryName === "variant"
                              ? `Show all variants: Yes`
                              : categoryName === "available"
                              ? `Available: Yes`
                              : `${
                                  categoryName.charAt(0).toUpperCase() +
                                  categoryName.slice(1)
                                }: ${
                                  params[categoryName].includes(",")
                                    ? params[categoryName].replace(/,/g, " - ")
                                    : params[categoryName]
                                }`}

                            <span
                              className="text0danger"
                              onClick={() => {
                                removeQueryParamAndNavigate(
                                  window.location.href,
                                  categoryName
                                );
                                setremovedParam(categoryName);
                              }}
                            >
                              {" "}
                              <i className="ri-close-fill"></i>{" "}
                            </span>
                          </li>
                        )
                      )}
                  </ul>
                </div>
              </Col>
              <Col md={6} className="mobile-hide">
                <div className="sidebar_filter">
                  <div className="tooltip-title">
                    {" "}
                    {guide && guide?.page_phases?.hide_similar}
                    <div className="tooltip-display-content">
                      <p>{guide?.page_phases?.hide_similar_hover_phrase}</p>
                    </div>
                    <div className="custom-switch form-switch">
                      <input
                        required=""
                        className="form-check-input"
                        type="checkbox"
                        id={`variant`}
                        onChange={handleHideSmiliar}
                        checked={hideSmiliar}
                      />
                    </div>
                  </div>
                </div>

                <div className="filtered-data-select">
                  <span>{guide && guide?.page_phases?.order_by}:</span>
                  <Form.Select
                    aria-label="Default select example"
                    onChange={(e) => handleSort(e.target.value)}
                  >
                    {/* <option>Autonomy</option> */}
                    <option
                      value={JSON.stringify({
                        algo: "remove",
                        rangeAttributes: "Overall",
                      })}
                    >
                      {guide && guide?.page_phases?.overall_available}
                    </option>
                    <option
                      value={JSON.stringify({
                        algo: "available",
                        rangeAttributes: "false",
                      })}
                    >
                      {guide && guide?.page_phases?.overall_all}
                    </option>

                    <option
                      value={JSON.stringify({
                        algo: "high-low",
                        rangeAttributes: "technical_score",
                      })}
                    >
                      {guide && guide?.page_phases?.technical_score}
                    </option>
                    <option
                      value={JSON.stringify({
                        algo: "low-high",
                        rangeAttributes: "price",
                      })}
                    >
                      {guide && guide?.page_phases?.price_lowest_to_highest}
                    </option>
                    <option
                      value={JSON.stringify({
                        algo: "high-low",
                        rangeAttributes: "price",
                      })}
                    >
                      {guide && guide?.page_phases?.price_highest_to_lowest}
                    </option>
                    <option
                      value={JSON.stringify({
                        algo: "high-low",
                        rangeAttributes: "rating",
                      })}
                    >
                      {" "}
                      {guide && guide?.page_phases?.users_ratings}
                    </option>
                    <option
                      value={JSON.stringify({
                        algo: "high-low",
                        rangeAttributes: "ratio_quality_price_points",
                      })}
                    >
                      {guide && guide?.page_phases?.ratio_quality_price_points}
                    </option>
                    <option
                      value={JSON.stringify({
                        algo: "high-low",
                        rangeAttributes: "popularity_points",
                      })}
                    >
                      {guide && guide?.page_phases?.popularity}
                    </option>

                    {
                      // Technical score --- will be ordered from highest to lowest, based on numbers in "Technical Score Points CONVERTED"
                      // Price (Lowest to Highest) --- will be ordered from lowest to highest price, based on numbers in "Lowest Price"
                      // Price (Highest to Lowest) --- will be ordered from highest to lowest price, based on numbers in "Highest Price"
                      // User's rating --- will be ordered from highest to lowest price, based on numbers in "User's Rating"
                      // Ratio quality-price ---- will be ordered from highest to lowest, based on numbers in "Ratio Quality Price Points"
                      // Popularity --- will be ordered from highest to lowest, based on numbers in "Popularity points"

                      sortRangeAttributeArray?.current.map(
                        (algoAttribute, attrIndex) => {
                          if (algoAttribute?.rangeAttributes != "Overall")
                            return (
                              <option
                                value={JSON.stringify(algoAttribute)}
                                key={attrIndex}
                              >
                                {algoAttribute?.rangeAttributes}
                                {algoAttribute?.algo == "lowest_to_highest" &&
                                  " (Lowest to Highest)" &&
                                  "available"}
                              </option>
                            );
                        }
                      )
                    }
                  </Form.Select>
                </div>
              </Col>
              {isFilterActive && <ProductSkeleton />}
              {products?.length > 0 ? (
                products ? (
                  <ProductListing
                    guidePhraseData={guide?.page_phases}
                    text_before_listing={guide?.text_before_listing}
                    text_after_listing={guide?.text_after_listing}
                    productPositionArray={productPosition}
                    products={sortedData && sortedData}
                    handleToggleCollapse={handleToggleCollapse}
                    handleManageCollapsedDiv={handleManageCollapsedDiv}
                    slug={slug}
                    order={order}
                    searchParams={searchParams}
                    productPagination={productPagination}
                  />
                ) : (
                  <ProductSkeleton />
                )
              ) : (
                <>
                  {/* <ConfirmationModal
                          showModal={showModal}
                          handleClose={handleModalClose}
                          handleConfirm={handleConfirm}
                        />
                        {showModal === false ? (
                          <div className="text-center p-5">
                            None of the products meet your filtering criteria.
                          </div>
                        ) : (
                          ""
                        )} */}
                </>
              )}

              {productPagination?.total_pages > 1 && (
                <GuidePagination
                  pagination={productPagination}
                  productPhaseData={guide?.page_phases}
                />
              )}
            </Row>
          </Col>
        </Row>
      </Container>
      {/* {console.log(guide?.page_phases?.similar_guides)} */}

      <section className="ptb-25">
        <Container>
          <Row>
            <Col md={12}>
              <div className="similar-guides">
                <p>{guide && guide?.page_phases?.similar_guides}:</p>
                <ul>
                  {guide?.recommended_guides &&
                    guide?.recommended_guides?.map((data, index) => {
                      return (
                        <li key={index}>
                          <a
                            href={`/${data?.category_url}/${data?.permalink}`}
                            style={{ color: "#437ece" }}
                            scroll={false}
                          >
                            {data?.short_name}
                          </a>
                        </li>
                      );
                    })}
                </ul>
              </div>
            </Col>
          </Row>
          {/* <section className="mobile-table-section">
              <Container>
                <Row className="table-section-desktop p-0">
                  <Col md={12} className="p-0">
                    <MobileCompareTable />
                  </Col>
                </Row>
              </Container>
            </section> */}
          <Row className="table-section-mobile">
            <Col md={12}>
              <h2 className="site-main-heading pt-5">
                {guideData[0]?.data?.big_table_subtitle
                  ? guideData[0]?.data?.big_table_subtitle
                  : "No title found"}
              </h2>

              {guide && productForTable?.length > 1 && (
                <CompareTable
                  guidePhraseData={guide?.page_phases}
                  products={productForTable}
                  categoryAttributes={attributesForTable && attributesForTable}
                  slug={slug}
                />
              )}
            </Col>
          </Row>
        </Container>
      </section>
      <section className="mobile-table-section">
        {isMobile ? (
          <Container>
            <h2 className="site-main-heading pt-5 m-3">
              {guideData[0]?.data?.big_table_subtitle
                ? guideData[0]?.data?.big_table_subtitle
                : "No title found"}
            </h2>
          </Container>
        ) : null}
        {/* {console.log(categorySlug)} */}
        <Container className="p-0 p-md-4">
          <Row className="table-section-desktop p-0">
            <Col md={12} className="p-0">
              {isMobile ? (
                <MobileCompareGuideTable
                  productPhaseData={guide?.page_phases}
                  products={productForTable}
                  categoryAttributes={attributesForTable && attributesForTable}
                  slug={slug}
                  categorySlug={categorySlug}
                  type={"guide"}
                  category_id={category_id}
                />
              ) : null}
            </Col>
          </Row>
        </Container>
        {/* {isSmallDevice && (
          <Container className="p-0 p-md-4">
            <Row className="table-section-desktop p-0">
              <Col md={12} className="p-0">
                {
                  isSmallDevice ? (
                    <MobileCompareGuideTable
                      productPhaseData={guide?.page_phases}
                      products={productForTable}
                      categoryAttributes={
                        attributesForTable && attributesForTable
                      }
                      slug={slug}
                      type={"guide"}
                    />
                  ) : null // or any other fallback content for non-mobile
                }
              </Col>
            </Row>
          </Container>
        )} */}
      </section>

      <section>
        <Container>
          <Row>
            <Col md={12}>
              <h2 className="site-main-heading">
                {guideData[0]?.data?.main_text_subtitle
                  ? guideData[0]?.data?.main_text_subtitle
                  : "No title found"}
              </h2>
            </Col>
          </Row>
          <GuidePageTextArea guide={guide} />
        </Container>
        {/* {console.log(guide?.page_phases?.currency)} */}
      </section>
      <section className="ptb-25 mobite-mb-20">
        <Container>
          <Row>
            <Col md={12}>
              <h2 className="site-main-heading">
                {guide && guide?.page_phases?.see_also_guides}
              </h2>
              <ProductSlider favSlider={guide?.see_also_guides} slug={slug} />
            </Col>
          </Row>
        </Container>
      </section>
      {/* here will be bottom bar section were add to comparision product */}
      <BottomBar
        guidePhraseData={guide}
        isCollapsed={isCollapsed}
        handleToggleCollapse={handleToggleCollapse}
        manageCollapsedDiv={manageCollapsedDiv}
        handleManageCollapsedDiv={handleManageCollapsedDiv}
      />
    </>
  );
}
