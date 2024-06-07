"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Col, Container, Row } from "react-bootstrap";
import BreadCrumb from "@/components/Common/BreadCrumb/breadcrum";
import formatValue from "@/_helpers/formatValue";

const ProductCategoryArchivePage = ({ slug, categoryData }) => {
  // (categoryData[0]?.data?.page_phases)
  return (
    <div>
      {categoryData != null && (
        <>
          <section className="breadcrumb-section">
            <Container>
              <Row>
                <Col md={12}>
                  <BreadCrumb
                    productPhaseData={categoryData[0]?.data?.page_phases}
                    firstPageName={""}
                    secondPageName={{
                      name:
                        slug?.replace(/-/g, " ").charAt(0).toUpperCase() +
                        slug?.replace(/-/g, " ").slice(1).toLowerCase(),
                    }}
                  />
                </Col>

                <Col md={12}>
                  <h1 className="heading-primary">
                    {categoryData[0]?.data?.title}
                  </h1>
                </Col>
              </Row>
            </Container>
          </section>
          <section className="blog_post_section py-3">
            <Container>
              {/*-------------POPULAR GUIDE -------------------*/}
              <Row className="py-3">
                <Col md={12}>
                  <h2 className="heading-primary secondary">
                    {categoryData[0]?.data?.page_phases?.popular_guide_heading}
                  </h2>
                </Col>
                {/* if data found */}
                {categoryData[0]?.data?.popular_guides?.length > 0 && (
                  <Col md={12}>
                    <Row>
                      {categoryData[0]?.data?.popular_guides?.length > 0 &&
                        categoryData[0]?.data?.popular_guides?.map(
                          (item, index) => {
                            // (categoryData,"check category")
                            // console.log(item , 'neetxy');
                            return (
                              <Col
                                lg={2}
                                md={3}
                                xs={6}
                                className="px-2 mb-3"
                                key={`guide-${index}`}
                              >
                                <div className="product-card">
                                  <a
                                    href={`${item?.category_url}/${item?.permalink}`}
                                    style={{ color: "#27304e" }}
                                    className="product-link-cover"
                                  ></a>
                                  <img
                                    src={
                                      item?.bannerImage === null
                                        ? `/images/nofound.png`
                                        : item?.bannerImage
                                    }
                                    width={0}
                                    height={0}
                                    sizes="100%"
                                    alt=""
                                  />
                                  <div className="product-name-wrapper">
                                    <span>{item?.short_name}</span>
                                  </div>
                                </div>
                              </Col>
                            );
                          }
                        )}
                    </Row>
                  </Col>
                )}
                {/* if no data found */}

                {categoryData[0]?.data?.popular_guides?.length == 0 && (
                  <p className="">No records to display</p>
                )}
              </Row>
              {/*---------------- POPULAR REVIEWS -----------------------*/}

              {categoryData[0]?.data?.popular_reviews?.length > 0 && (
                <Row className="py-3">
                  <Col md={12}>
                    <h2 className="heading-primary secondary">
                      {
                        categoryData[0]?.data?.page_phases
                          ?.popular_review_heading
                      }
                    </h2>
                  </Col>
                  {/* if data found */}

                  <Col md={12}>
                    <Row>
                      {/* {(categoryData[0]?.data?.popular_reviews?.length)} */}
                      {categoryData[0]?.data?.popular_reviews?.length > 0 &&
                        // categoryData[0]?.data?.popular_reviews?.slice(0, 12)?.map(
                        categoryData[0]?.data?.popular_reviews?.map(
                          (item, index) => {
                            return (
                              <Col
                                lg={2}
                                md={3}
                                xs={6}
                                className="px-2 mb-3"
                                key={`review-${index}`}
                              >
                                <a
                                  href={`/${item?.category_url}/${item?.permalink}`}
                                >
                                  <div className="review-wrapper">
                                    <div className="review-card">
                                      <img
                                        src={
                                          item?.mini_image ||
                                          "/images/nofound.png"
                                        }
                                        width={60}
                                        height={60}
                                        sizes="100%"
                                        alt=""
                                      />
                                      <div className="footer_content">
                                        <div className="flex-container-section">
                                          <span className="text-wrapper">
                                            {item?.name}
                                          </span>
                                        </div>
                                        {/* <span className="text-wrapper">{item?.name}</span> */}
                                        <p>{item?.category}</p>
                                      </div>
                                      <span
                                        className="rating_count"
                                        style={{
                                          background:
                                            item.overall_score >= 7.5
                                              ? "#093673"
                                              : item.overall_score >= 5 &&
                                                item.overall_score < 7.5
                                              ? "#437ECE"
                                              : "#85B2F1",
                                        }}
                                      >
                                        {formatValue(item?.overall_score)}
                                      </span>
                                    </div>
                                  </div>
                                </a>
                              </Col>
                            );
                          }
                        )}
                    </Row>
                  </Col>
                  {/* if no data found */}
                  {categoryData[0]?.data?.popular_reviews?.length == 0 && (
                    <p className="">No records to display</p>
                  )}
                </Row>
              )}

              {/* --------------TEST LOGS------------- */}
              {categoryData[0]?.data?.tested_blogs?.length > 0 && (
                <Row className="py-3">
                  <Col md={12}>
                    <h2 className="heading-primary secondary">
                      {
                        categoryData[0]?.data?.page_phases
                          ?.popular_article_heading
                      }
                    </h2>
                  </Col>
                  {/* if data found */}

                  <Col md={12}>
                    <Row>
                      {categoryData[0]?.data?.tested_blogs?.length > 0 &&
                        categoryData[0]?.data?.tested_blogs?.map(
                          (item, index) => {
                            return (
                              <Col
                                lg={3}
                                md={3}
                                xs={6}
                                className="px-2 mb-3"
                                key={`articles-${index}`}
                              >
                                <div className="blog-card" role="button">
                                  <a
                                    href={`/${
                                      item.category_url
                                        ? item.category_url
                                        : item.primary_category.toLowerCase()
                                    }/${item?.permalink}`}
                                  >
                                    <div className="blog-card-img">
                                      <img
                                        src={
                                          item?.banner_image === null
                                            ? "/images/cat7.png"
                                            : item?.banner_image
                                        }
                                        width={0}
                                        height={0}
                                        sizes="100%"
                                        alt=""
                                        className="card-img"
                                      />
                                    </div>
                                    <p className="dates">SEPTEMBER 20 2022</p>
                                    <span className="blog-title">
                                      {item?.title}
                                    </span>
                                    <p className="category">{item?.category}</p>
                                  </a>
                                </div>
                              </Col>
                            );
                          }
                        )}
                    </Row>
                  </Col>

                  {/* if no data found */}
                  {categoryData[0]?.data?.popular_blogs?.length == 0 && (
                    <p className="">No records to display</p>
                  )}
                </Row>
              )}
              {/*-------------------- POPULAR ARTICLES --------------------------------*/}
              {categoryData[0]?.data?.popular_blogs?.length > 0 && (
                <Row className="py-3">
                  <Col md={12}>
                    <h2 className="heading-primary secondary">
                      {
                        categoryData[0]?.data?.page_phases
                          ?.popular_article_heading
                      }
                    </h2>
                  </Col>
                  {/* if data found */}

                  <Col md={12}>
                    <Row>
                      {categoryData[0]?.data?.popular_blogs?.length > 0 &&
                        categoryData[0]?.data?.popular_blogs?.map(
                          (item, index) => {
                            return (
                              <Col
                                lg={3}
                                md={3}
                                xs={6}
                                className="px-2 mb-3"
                                key={`articles-${index}`}
                              >
                                <div className="blog-card" role="button">
                                  <a
                                    href={`/${
                                      item.category_url
                                        ? item.category_url
                                        : item.primary_category.toLowerCase()
                                    }/${item?.permalink}`}
                                  >
                                    <div className="blog-card-img">
                                      <img
                                        src={
                                          item?.banner_image === null
                                            ? "/images/cat7.png"
                                            : item?.banner_image
                                        }
                                        width={0}
                                        height={0}
                                        sizes="100%"
                                        alt=""
                                        className="card-img"
                                      />
                                    </div>
                                    <p className="dates">SEPTEMBER 20 2022</p>
                                    <span className="blog-title">
                                      {item?.title}
                                    </span>
                                    <p className="category">{item?.category}</p>
                                  </a>
                                </div>
                              </Col>
                            );
                          }
                        )}
                    </Row>
                  </Col>

                  {/* if no data found */}
                  {categoryData[0]?.data?.popular_blogs?.length == 0 && (
                    <p className="">No records to display</p>
                  )}
                </Row>
              )}
            </Container>
          </section>
        </>
      )}
      {categoryData == null && <p>NO DATA FOUND</p>}
    </div>
  );
};

export default ProductCategoryArchivePage;
