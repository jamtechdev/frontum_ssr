"use client";
import React from "react";
import { Col, Container, Row, Tab, Tabs } from "react-bootstrap";
import Image from "next/image";
import ExperReviwes from "../Common/ExpertReviews/ExperReviwes";
import Rating from "../Common/Rating/Rating";
import ProductReviewTab from "./ProductReviewTab";
import VideoReviews from "../Common/VideoReviews/VideoReviews";
import MobileAccordion from "../Common/MobileAccordion/mobileAccordion";
import useScreenSize from "@/_helpers/useScreenSize";

function ProductTabs({
  productReview,
  productPhaseData,
  expertReview,
  videoReview,
  page_phase,
}) {
  // (productReview, expertReview, videoReview);
  const { isMobile } = useScreenSize();
  return (
    <>
      {" "}
      <section className="ptb-80 bg-color">
        {
          <Container>
            <Row>
              {productReview?.length > 0 ||
              expertReview?.length > 0 ||
              videoReview?.length > 0 ? (
                <Col md={12}>
                  <h2 className="site-main-heading">{productPhaseData}</h2>
                </Col>
              ) : (
                ""
              )}

              <Col md={12} className="site_tabs_hide">
                <Tabs
                  defaultActiveKey={
                    productReview && productReview.length > 0
                      ? "tab-1"
                      : expertReview && expertReview.length > 0
                      ? "tab-2"
                      : videoReview && videoReview.length > 0
                      ? "tab-3"
                      : "tab-1"
                  }
                  id="Review-tab"
                  className="mb-3 site_tabs site_tabs_hide"
                >
                  {productReview && productReview.length > 0 && (
                    <Tab
                      eventKey="tab-1"
                      title={`${page_phase?.users_reviews}`}
                    >
                      <ProductReviewTab productReview={productReview} />
                    </Tab>
                  )}

                  {expertReview && expertReview.length > 0 && (
                    <Tab
                      eventKey="tab-2"
                      title={`${page_phase?.expert_review}`}
                    >
                      <ExperReviwes
                        expertReview={expertReview}
                        page_phase={page_phase}
                      />
                    </Tab>
                  )}

                  {videoReview && videoReview.length > 0 && (
                    <Tab eventKey="tab-3" title={`${page_phase?.video_review}`}>
                      <VideoReviews videoReview={videoReview} />
                    </Tab>
                  )}
                </Tabs>
              </Col>

              {isMobile && (
                <Col md={12} className="">
                  <MobileAccordion
                    productReview={productReview}
                    expertReview={expertReview}
                    videoReview={videoReview}
                    page_phase={page_phase}
                  />
                </Col>
              )}
            </Row>
          </Container>
        }
      </section>
    </>
  );
}
export default ProductTabs;
