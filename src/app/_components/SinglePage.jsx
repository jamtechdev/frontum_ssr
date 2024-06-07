"use client";
import React, { useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import BreadCrumb from "@/components/Common/BreadCrumb/breadcrum";

function SinglePage({ singlePageData }) {
  // (singlePageData?.page_phases);

  useEffect(() => {
    const stickyElements = document.querySelectorAll(".sticky");
    stickyElements.forEach((element) => {
      element.style.top = "0";
    });
  }, []);
  return (
    <>
      <section className="breadcrumb-section">
        <Container>
          <Row>
            <Col md={12}>
              <BreadCrumb
                productPhaseData={singlePageData?.page_phases}
                firstPageName={""}
                secondPageName={{ name: singlePageData?.title }}
              />
            </Col>
            <Col md={12}>
              <h1 className="heading-primary">{singlePageData?.title}</h1>
            </Col>
          </Row>
        </Container>
      </section>
      <section className="contentSec pt-3 pb-5">
        <Container>
          <Row>
            <Col xl={9} lg={9} md={12}>
              <div
                className="content-para"
                dangerouslySetInnerHTML={{
                  __html: singlePageData?.description,
                }}
              ></div>
            </Col>
            <Col xl={3} lg={3} md={12}></Col>
          </Row>
        </Container>
      </section>
    </>
  );
}

export default SinglePage;
