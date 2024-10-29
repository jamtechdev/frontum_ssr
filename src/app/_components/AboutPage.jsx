"use client";
import BreadCrumb from "@/components/Common/BreadCrumb/breadcrum";
import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import Image from "next/image";
import Link from "next/link";

function AboutPage({ slug, aboutData }) {
  // (aboutData)
  return (
    <>
      <section className="breadcrumb-section">
        <Container>
          <Row>
            <Col xl={9} lg={9} md={12}>
              <Row>
                <Col md={12}>
                  <BreadCrumb
                    productPhaseData={aboutData?.page_phases}
                    firstPageName={""}
                    secondPageName={{ name: aboutData?.title }}
                  />
                </Col>
                <Col md={12}>
                  <h1 className="heading-primary">{aboutData?.title}</h1>
                </Col>
              </Row>
            </Col>
            <Col xl={3} lg={3} md={12}></Col>
          </Row>
        </Container>
      </section>
      <section className="py-4">
        <Container>
          <Row>
            <Col xl={9} lg={9} md={12}>
              <Row>
                <Col md={12}>
                  <div
                    className="content-para"
                    dangerouslySetInnerHTML={{ __html: aboutData?.content }}
                  ></div>
                </Col>

                <Col md={4} className="about-category-Sec d-none">
                  <h2 className="heading-primary secondary">See also</h2>
                  <Row className="mt-3">
                    <Col md={12} xs={6}>
                      <div className="category-section">
                        <img
                          src="/images/how-work.png"
                          width={0}
                          height={0}
                          sizes="100%"
                          alt=""
                          className="card-img"
                        />
                        <span className="category_name">
                          How our ranking works
                        </span>
                      </div>
                    </Col>
                    <Col md={12} xs={6} className="ps">
                      <div className="category-section">
                        <img
                          src="/images/tab.png"
                          width={0}
                          height={0}
                          sizes="100%"
                          alt=""
                          className="card-img"
                        />
                        <span className="category_name">Blog</span>
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Row>
           
              <Row>
                <Col md={12}>
                  <h2 className="site-main-heading mt-3">{aboutData?.page_phases?.our_team_title}</h2>
                </Col>
                {aboutData &&
                  aboutData?.authors?.map((item, index) => {
                    return (
                      <>
                        <Col md={4} lg={4}>
                          <a href={`/author/${item?.id}`}>
                            <div className="author-page-section about-card-section">
                              <img
                                src={
                                  item?.image
                                    ? item?.image
                                    : "/images/nofound.png"
                                }
                                width={0}
                                height={0}
                                sizes="100%"
                                alt=""
                              />

                              <div className="author-page-section-footer">
                                <span>{item?.name}</span>
                              </div>
                            </div>
                          </a>
                        </Col>
                      </>
                    );
                  })}
              </Row>
            </Col>
            <Col xl={3} lg={3} md={12}></Col>
          </Row>
        </Container>
      </section>
    </>
  );
}

export default AboutPage;
