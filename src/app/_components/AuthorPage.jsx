"use client";
import BlogSlider from "@/components/Common/BlogSlider/blogSlider";
import BreadCrumb from "@/components/Common/BreadCrumb/breadcrum";
import LatesGuid from "@/components/Common/ProductSlider/LatesGuid";
import ReviewSlider from "@/components/Common/ReviewSlider/reviewSlider";
import React from "react";
import { Col, Container, Row } from "react-bootstrap";
function AuthorPage({ slug, authorData }) {
  // (authorData)
  return (
    <>
      <section className="breadcrumb-section">
        <Container>
          <Row>
            {/* <Col md={12}>
              <BreadCrumb firstPageName="author" secondPageName={""} />
            </Col> */}
            <Col md={12}>
              <h1 className="heading-primary">{authorData?.name}</h1>
            </Col>
          </Row>
        </Container>
      </section>
      <section className="contentSec pt-3 pb-5">
        <Container>
          <Row>
            <Col md={12}>
              <div className="contentPara">
                <div className="author-page-section">
                  <img
                    src={
                      authorData?.image
                        ? authorData?.image
                        : "/images/nofound.png"
                    }
                    width={0}
                    height={0}
                    sizes="100%"
                    alt=""
                  />
                  <div className="author-page-section-footer">
                    <span>{authorData?.name}</span>
                  </div>
                </div>
                <br />
                <br />
                <div
                className="author-page-para"
                  dangerouslySetInnerHTML={{ __html: authorData?.about }}
                />

                <br />
                <br />
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      <section>
        <Container>
          <Row className="my-3">
            {authorData?.latest_guides?.length > 0 && (
              <Col md={12}>
                <h2 className="heading-primary secondary related-guides">
                  {(authorData && authorData?.page_phases?.latest_guide_text) ||
                    "Latest Guides"}
                </h2>
              </Col>
            )}

            <Col md={12}>
              {authorData?.latest_guides?.length > 0 && (
                <LatesGuid favSlider={authorData?.latest_guides.slice(0, 10)} />
              )}
            </Col>
          </Row>
        </Container>
      </section>
      {authorData?.latest_reviews?.length > 0 && (
        <section>
          <Container>
            <Row className="my-3">
              <Col md={12}>
                <h2 className="heading-primary secondary related-guides">
                  Latest Reviews
                </h2>
              </Col>
              <Col md={12}>
                {authorData?.latest_reviews?.length > 0 && (
                  <ReviewSlider
                    favSlider={authorData?.latest_reviews.slice(0, 9)}
                  />
                )}
              </Col>
            </Row>
          </Container>
        </section>
      )}

      <section className="blog-slides">
        <Container>
          <Row className="my-3">
            {authorData?.blog_posts?.length > 0 && (
              <>
                <Col md={12}>
                  <h2 className="heading-primary secondary blog-post">
                    {(authorData &&
                      authorData?.page_phases?.related_blog_posts_text) ||
                      "Related Blog Posts"}
                  </h2>
                </Col>
                <Col md={12}>
                  <BlogSlider blogData={authorData?.blog_posts?.slice(0, 8)} />
                </Col>
              </>
            )}
          </Row>
        </Container>
      </section>
    </>
  );
}

export default AuthorPage;
