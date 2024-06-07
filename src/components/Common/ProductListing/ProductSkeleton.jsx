import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import RightPointingArrow from "../../Svg/RightPointingArrow";
import { Fragment } from "react";
import Image from "next/image";
import { Accordion, Button, Col, Row } from "react-bootstrap";
export default function ProductSkeleton() {
  return (
    <Fragment>
      <div className="best-product-listing">
        <div className="flex-box">
          <div className="left_box">
            <span className="ribbon-number">
              <p>
                <Skeleton />
              </p>
              <RightPointingArrow />
            </span>
            <div className="box_content light-bg-color">
              <Skeleton width={100} />
            </div>
          </div>
        </div>
        <Row className="m-0">
          <Col
            md={12}
            lg={3}
            xl={2}
            className="border-right d-flex align-items-center justify-content-center"
          >
            <Skeleton circle={true} height={100} width={100} />
          </Col>
          <Col md={12} lg={9} xl={10} className="p-0 product-listing-width-80">
            <div className="product-listing-inner-content">
              <div className="col light-bg-color">
                <div className="pros-corns-section pt-2">
                  <ul>
                    <li>
                      <Skeleton height={40} />
                    </li>
                    <li>
                      <Skeleton height={40} />
                    </li>
                    <li>
                      <Skeleton height={40} />
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col">
                <div className="pros-corns-section pt-1 pb-2">
                  <ul>
                    <li>
                      <Skeleton height={30} />
                    </li>
                    <li>
                      <Skeleton height={30} />
                    </li>
                    <li>
                      <Skeleton height={30} />
                    </li>
                    <li>
                      <Skeleton height={30} />
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col light-bg-color">
                <div className="pros-corns-section pros">
                  <p className="buy-avoid">
                    <Skeleton />
                  </p>
                  <ul>
                    <li>
                      <Skeleton />
                    </li>
                    <li>
                      <Skeleton />
                    </li>
                    <li>
                      <Skeleton />
                    </li>
                    <li>
                      <Skeleton />
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col">
                <div className="pros-corns-section corns">
                  <p className="buy-avoid">
                    <Skeleton />
                  </p>
                  <ul>
                    <li>
                      <span>
                        <Skeleton />
                      </span>
                    </li>
                    <li>
                      <span>
                        <Skeleton />
                      </span>
                    </li>
                    <li>
                      <span>
                        <Skeleton />
                      </span>
                    </li>
                    <li>
                      <span>
                        <Skeleton />
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </Col>
          <Col md={12} className="p-0">
            <Row className="w-100 m-0 alternatives-border-top">
              <Col md={12}>
                <div className="alternatives">
                  <p className="version-availabel">
                    <Skeleton width={100} />
                  </p>
                  <ul>
                    <li>
                      <span>
                        <Skeleton />
                      </span>
                    </li>
                    <li>
                      <span>
                        <Skeleton />
                      </span>
                    </li>
                  </ul>
                </div>
              </Col>
            </Row>
            <div className="w-100">
              <p className="best-product-content border-top border-bottom p-2">
                <Skeleton />
                <Skeleton width={200} />
              </p>
            </div>
            <Row>
              <Col className="mb-1 d-flex align-items-center justify-content-center">
                <Skeleton height={35} width={110} />
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
      <div className="best-product-listing">
        <div className="flex-box">
          <div className="left_box">
            <span className="ribbon-number">
              <p>
                <Skeleton />
              </p>
              <RightPointingArrow />
            </span>
            <div className="box_content light-bg-color">
              <Skeleton width={100} />
            </div>
          </div>
        </div>
        <Row className="m-0">
          <Col
            md={12}
            lg={3}
            xl={2}
            className="border-right d-flex align-items-center justify-content-center"
          >
            <Skeleton circle={true} height={100} width={100} />
          </Col>
          <Col md={12} lg={9} xl={10} className="p-0 product-listing-width-80">
            <div className="product-listing-inner-content">
              <div className="col light-bg-color">
                <div className="pros-corns-section pt-2">
                  <ul>
                    <li>
                      <Skeleton height={40} />
                    </li>
                    <li>
                      <Skeleton height={40} />
                    </li>
                    <li>
                      <Skeleton height={40} />
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col">
                <div className="pros-corns-section pt-1 pb-2">
                  <ul>
                    <li>
                      <Skeleton height={30} />
                    </li>
                    <li>
                      <Skeleton height={30} />
                    </li>
                    <li>
                      <Skeleton height={30} />
                    </li>
                    <li>
                      <Skeleton height={30} />
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col light-bg-color">
                <div className="pros-corns-section pros">
                  <p className="buy-avoid">
                    <Skeleton />
                  </p>
                  <ul>
                    <li>
                      <Skeleton />
                    </li>
                    <li>
                      <Skeleton />
                    </li>
                    <li>
                      <Skeleton />
                    </li>
                    <li>
                      <Skeleton />
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col">
                <div className="pros-corns-section corns">
                  <p className="buy-avoid">
                    <Skeleton />
                  </p>
                  <ul>
                    <li>
                      <span>
                        <Skeleton />
                      </span>
                    </li>
                    <li>
                      <span>
                        <Skeleton />
                      </span>
                    </li>
                    <li>
                      <span>
                        <Skeleton />
                      </span>
                    </li>
                    <li>
                      <span>
                        <Skeleton />
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </Col>
          <Col md={12} className="p-0">
            <Row className="w-100 m-0 alternatives-border-top">
              <Col md={12}>
                <div className="alternatives">
                  <p className="version-availabel">
                    <Skeleton width={100} />
                  </p>
                  <ul>
                    <li>
                      <span>
                        <Skeleton />
                      </span>
                    </li>
                    <li>
                      <span>
                        <Skeleton />
                      </span>
                    </li>
                  </ul>
                </div>
              </Col>
            </Row>
            <div className="w-100">
              <p className="best-product-content border-top border-bottom p-2">
                <Skeleton />
                <Skeleton width={200} />
              </p>
            </div>
            <Row>
              <Col className="mb-1 d-flex align-items-center justify-content-center">
                <Skeleton height={35} width={110} />
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
      <div className="best-product-listing">
        <div className="flex-box">
          <div className="left_box">
            <span className="ribbon-number">
              <p>
                <Skeleton />
              </p>
              <RightPointingArrow />
            </span>
            <div className="box_content light-bg-color">
              <Skeleton width={100} />
            </div>
          </div>
        </div>
        <Row className="m-0">
          <Col
            md={12}
            lg={3}
            xl={2}
            className="border-right d-flex align-items-center justify-content-center"
          >
            <Skeleton circle={true} height={100} width={100} />
          </Col>
          <Col md={12} lg={9} xl={10} className="p-0 product-listing-width-80">
            <div className="product-listing-inner-content">
              <div className="col light-bg-color">
                <div className="pros-corns-section pt-2">
                  <ul>
                    <li>
                      <Skeleton height={40} />
                    </li>
                    <li>
                      <Skeleton height={40} />
                    </li>
                    <li>
                      <Skeleton height={40} />
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col">
                <div className="pros-corns-section pt-1 pb-2">
                  <ul>
                    <li>
                      <Skeleton height={30} />
                    </li>
                    <li>
                      <Skeleton height={30} />
                    </li>
                    <li>
                      <Skeleton height={30} />
                    </li>
                    <li>
                      <Skeleton height={30} />
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col light-bg-color">
                <div className="pros-corns-section pros">
                  <p className="buy-avoid">
                    <Skeleton />
                  </p>
                  <ul>
                    <li>
                      <Skeleton />
                    </li>
                    <li>
                      <Skeleton />
                    </li>
                    <li>
                      <Skeleton />
                    </li>
                    <li>
                      <Skeleton />
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col">
                <div className="pros-corns-section corns">
                  <p className="buy-avoid">
                    <Skeleton />
                  </p>
                  <ul>
                    <li>
                      <span>
                        <Skeleton />
                      </span>
                    </li>
                    <li>
                      <span>
                        <Skeleton />
                      </span>
                    </li>
                    <li>
                      <span>
                        <Skeleton />
                      </span>
                    </li>
                    <li>
                      <span>
                        <Skeleton />
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </Col>
          <Col md={12} className="p-0">
            <Row className="w-100 m-0 alternatives-border-top">
              <Col md={12}>
                <div className="alternatives">
                  <p className="version-availabel">
                    <Skeleton width={100} />
                  </p>
                  <ul>
                    <li>
                      <span>
                        <Skeleton />
                      </span>
                    </li>
                    <li>
                      <span>
                        <Skeleton />
                      </span>
                    </li>
                  </ul>
                </div>
              </Col>
            </Row>
            <div className="w-100">
              <p className="best-product-content border-top border-bottom p-2">
                <Skeleton />
                <Skeleton width={200} />
              </p>
            </div>
            <Row>
              <Col className="mb-1 d-flex align-items-center justify-content-center">
                <Skeleton height={35} width={110} />
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </Fragment>
  );
}
