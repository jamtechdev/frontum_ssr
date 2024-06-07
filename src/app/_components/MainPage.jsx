"use client";
import { Button, Col, Container, Form, Row, Tab, Tabs } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import SearchList from "@/components/Search/SearchList";
import LatesGuid from "@/components/Common/ProductSlider/LatesGuid";
import Sponsor from "@/components/Common/Sponsor/Sponsor";
import Category from "@/components/Common/Category/Category";
import ProductSlider from "@/components/Common/ProductSlider/productSlider";
import ReviewSlider from "@/components/Common/ReviewSlider/reviewSlider";
import BlogSlider from "@/components/Common/BlogSlider/blogSlider";
import Image from "next/image";
import { useRouter } from "next/navigation";
import CompareForm from "@/components/Common/Comparison/CompareForm";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { resetGuideCompareProduct } from "@/redux/features/compareProduct/compareProSlice";
import Head from "next/head";
import MainComparision from "@/components/Common/MainComparision/MainComparision";
import HomeCompareSlider from "@/components/Common/HomeComparisonSlider/HomeCompareSlider";

export default function MainPage({ bannerCounts, favSlider }) {
  const [search, setsearch] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const dispatch = useDispatch();

  const handleBlur = () => {
    setTimeout(() => {
      setIsFocused(false);
    }, 200);
  };
  const handleSearch = (e) => {
    setsearch(e.target.value);
  };
  const router = useRouter();
  // {(favSlider,"neet")}
  return (
    <>
      <section className="hero_section home">
        <Container>
          <Row>
            <Col md={12} className="form-col">
              <h1>{favSlider && favSlider?.motto_phrase1}</h1>
              <p>{favSlider && favSlider?.motto_phrase2}</p>
              <Form className="d-flex hero-searchbar">
                <div className="search-icon">
                  <i className="ri-search-line"></i>
                </div>

                <Form.Control
                  type="text"
                  value={search}
                  onFocus={() => setIsFocused(true)}
                  onBlur={handleBlur}
                  onChange={handleSearch}
                  placeholder={`${favSlider && favSlider?.search_phrase}`}
                  aria-label="Search"
                />
                <Button className="search-btn">
                  {favSlider && favSlider?.search_button}
                </Button>
                {/* {(favSlider?.no_data_found, "favSlider")} */}
                <SearchList
                  search={search}
                  isFocused={isFocused}
                  noDataFoundPhase={favSlider?.no_results_found}
                />
              </Form>
            </Col>
          </Row>
          <div className="hero-card-container">
            <Row>
              {bannerCounts ? (
                <>
                  {Object.values(bannerCounts).map((section, index) => (
                    <Col className="p-2" lg={3} md={6} xs={6} key={index}>
                      <div className="hero-card-content">
                        <span className="count">{section?.count}</span>
                        <span className="card-heading">{section?.heading}</span>
                        <span className="card-subheading">
                          {section?.subheading}
                        </span>
                      </div>
                    </Col>
                  ))}
                </>
              ) : (
                <>
                  <Col className="p-2" lg={12}>
                    <h2>No Data Found</h2>
                  </Col>
                </>
              )}
            </Row>
          </div>
        </Container>
      </section>

      <Container className="ptb-80">
        <Row>
          <Col md={12}>
            <h2 className="site-main-heading">
              {favSlider && favSlider?.favourite_guides}
            </h2>
            {favSlider && favSlider.favorite_guides && (
              <>
                <LatesGuid favSlider={favSlider.favorite_guides} />
              </>
            )}
          </Col>
        </Row>
      </Container>

      <section className="ptb-80 bg-color">
        <Container>
          <Row>
            <Col md={12}>
              <h2 className="site-main-heading">
                {favSlider && favSlider?.compare_products_text}
              </h2>
              <CompareForm
                favSlider={favSlider && favSlider}
                location="ON_MAIN_PAGE"
                handelCloseCompareModel={() => { }}
              />
            </Col>
          </Row>
        </Container>
      </section>
      {favSlider && favSlider?.as_seen_on.length > 0 && (
        <section className="ptb-80">
          <Container>
            <Row>
              <Col md={12}>
                <h2 className="site-main-heading">As Seen On</h2>
                <Sponsor asSeenOn={favSlider?.as_seen_on} />
              </Col>
            </Row>
          </Container>
        </section>
      )}

      {favSlider && favSlider?.categories_in_home?.length > 0 && (
        <section className="ptb-80">
          <Container>
            <Row>
              <Col md={12}>
                <h2 className="site-main-heading">
                  {favSlider && favSlider?.categories}
                </h2>
                <Category
                  categories={favSlider && favSlider?.categories_in_home}
                />
              </Col>
            </Row>
          </Container>
        </section>
      )}
      <section className="ptb-80 bg-pattern">
        <Container>
          <Row>
            <Col lg={7} md={12}>
              <h2 className="site-main-heading">
                {favSlider && favSlider?.how_rankings_work_text}
              </h2>
              <p
                className="inner-text-content mt-3"
                dangerouslySetInnerHTML={{
                  __html: favSlider && favSlider?.how_ranking_work,
                }}
              ></p>
            </Col>
            <Col lg={5} md={12} className="top-space">
              <img
                className="site_image"
                src="/images/side-img.png"
                width={10}
                height={10}
                alt="How Our Rankings Work Image"
                sizes="100%"
              />
            </Col>
          </Row>
        </Container>
      </section>

      {favSlider &&
        favSlider?.categories_in_home?.map((data, index) => {
          return (
            <div key={index}>
              <section className="ptb-80 bg-cat">
                <Container className="small-p-0 ">
                  <Row key={data?.id}>
                    <Col md={12} xs={12}>
                      <a
                        href={`/${data?.permalink}`}
                        className="text-center electronics"
                      >
                        <h2
                          role="button"
                          style={{
                            backgroundImage: `url(${data?.rectangle_image})`,
                          }}
                        >
                          {data?.primary_archive_category}
                        </h2>
                      </a>
                    </Col>
                  </Row>
                </Container>
              </section>
              {data?.categories?.length > 0 && (
                <section className="mt-3">
                  <Container>
                    <Row>
                      <Col md={12}>
                        <h3 className="site-main-heading">
                          {favSlider && favSlider?.product_categories_text}
                        </h3>
                        {/* sorted array alphabateically */}
                        <div className="product-categories-container">
                          {data &&
                            data.categories
                              ?.sort((a, b) => a.title.localeCompare(b.title))
                              ?.map((item, index) => (
                                <div
                                  key={index}
                                  style={{ display: "inline-block" }}
                                >
                                  <span
                                    className="product-categories-item"
                                    style={{ cursor: "pointer" }}
                                  >
                                    <a
                                      style={{ color: "#27304e" }}
                                      href={`/${item.category_url?.toLowerCase()}`}
                                    >
                                      {item.title}
                                    </a>
                                  </span>
                                </div>
                              ))}
                        </div>
                      </Col>
                    </Row>
                  </Container>
                </section>
              )}

              <Container className="mt-3">
                <Row>
                  <Col md={12}>
                    <h3 className="site-main-heading">
                      {favSlider && favSlider?.guides}
                    </h3>
                    <Tabs
                      defaultActiveKey="tab-1"
                      id="Review-tab"
                      className="mb-3 site_tabs"
                    >
                      <Tab
                        eventKey="tab-1"
                        title={`${favSlider && favSlider?.most_popular_guides_text
                          }`}
                      >
                        <ProductSlider favSlider={data?.popular_guides} />
                      </Tab>
                      <Tab
                        eventKey="tab-2"
                        title={`${favSlider && favSlider?.latest_guides_text}`}
                      >
                        <LatesGuid favSlider={data?.latest_guides} />
                      </Tab>
                    </Tabs>
                  </Col>
                </Row>
              </Container>

              <Container className="mt-3">
                <Row>
                  <Col md={12}>
                    <h3 className="site-main-heading">
                      {favSlider && favSlider?.review_text}
                    </h3>
                    <Tabs
                      defaultActiveKey="tab-1"
                      id="Review-tab"
                      className="mb-3 site_tabs"
                    >
                      <Tab
                        eventKey="tab-1"
                        title={`${favSlider && favSlider?.most_popular_review_text
                          }`}
                      >
                        {data?.popular_reviews.length > 0 ? (
                          <ReviewSlider favSlider={data?.popular_reviews} />
                        ) : (
                          <>
                            <span
                              className="d-flex justify-content-center mt-5 "
                              style={{
                                fontSize: "20px",
                                fontWeight: "700",
                                color: "#27304e",
                              }}
                            >
                              No Popular Reviews Found
                            </span>
                          </>
                        )}
                        {/* <ReviewSlider favSlider={data?.popular_reviews} /> */}
                      </Tab>
                      {/* <Tab
                        eventKey="tab-2"
                        title={`${favSlider && favSlider?.latest_reviews_text}`}
                      >
                        <ReviewSlider favSlider={data?.latest_reviews} />
                      </Tab> */}
                    </Tabs>
                  </Col>
                </Row>
              </Container>
              <Container className="mt-3">
                <Row>
                  <Col md={12}>
                    <h3 className="site-main-heading">
                      {favSlider && favSlider?.comparison_heading_homepage}
                      {/* {favSlider && favSlider?.comparison_heading_homepage} */}
                    </h3>
                    {/* {(data?.comparison)} */}
                    {/* { (favSlider?.see)} */}

                    <HomeCompareSlider
                      products={data?.comparison}
                      page_phase={favSlider}
                    />
                  </Col>
                </Row>
              </Container>

              {data?.blog_posts && data?.blog_posts?.length > 0 && (
                <Container className="my-3">
                  <Row>
                    <Col md={12}>
                      <h3 className="site-main-heading">
                        {favSlider && favSlider?.blog_posts_text}
                      </h3>
                      <BlogSlider blogData={data?.blog_posts} />
                    </Col>
                  </Row>
                </Container>
              )}
            </div>
          );
        })}
    </>
  );
}

