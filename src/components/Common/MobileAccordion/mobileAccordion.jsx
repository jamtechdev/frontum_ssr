"use client";
import { Button, Col, Container, Row, Accordion } from "react-bootstrap";
import MobileProductSlider from "../MobileProductSlider/mobileProductSlider";
import MobileExpertReview from "../MobileReview/MobileExpertReview";
import MobileUserReview from "../MobileReview/MobileUserReview";
import MobileVideoReview from "../MobileReview/MobileVideoReview";
export default function MobileAccordion({
  productReview,
  expertReview,
  videoReview,
  page_phase,
}) {
  return (
    <>
      <section className="sec-mobile_accordion">
        <Accordion
          defaultActiveKey={
            productReview && productReview.length > 0
              ? "0"
              : expertReview && expertReview.length > 0
              ? "1"
              : videoReview && videoReview.length > 0
              ? "2"
              : "0"
          }
          className="mobile_accordion"
        >
          {productReview && productReview.length > 0 && (
            <Accordion.Item eventKey="0">
              <Accordion.Header as="div">
                {page_phase?.users_reviews}
              </Accordion.Header>
              <Accordion.Body className="px-2">
                <Row>
                  <Col md={12} xs={12} className="px-0">
                    <MobileUserReview productReview={productReview} />
                  </Col>
                </Row>
              </Accordion.Body>
            </Accordion.Item>
          )}

          {expertReview && expertReview.length > 0 && (
            <Accordion.Item eventKey="1">
              <Accordion.Header as="div">
                {page_phase?.expert_review}{" "}
              </Accordion.Header>
              <Accordion.Body className="px-2">
                <Row>
                  <Col md={12} xs={12} className="px-0">
                    <MobileExpertReview expertReview={expertReview}  page_phase={page_phase}/>
                  </Col>
                </Row>
              </Accordion.Body>
            </Accordion.Item>
          )}

          {videoReview && videoReview.length > 0 && (
            <Accordion.Item eventKey="2">
              <Accordion.Header as="div">
                {page_phase?.video_review}
              </Accordion.Header>
              <Accordion.Body className="px-2">
                <Row>
                  <Col md={12} xs={12} className="px-0">
                    <MobileVideoReview videoReview={videoReview} />
                  </Col>
                </Row>
              </Accordion.Body>
            </Accordion.Item>
          )}
        </Accordion>
      </section>
    </>
  );
}
