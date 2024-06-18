import useScreenSize from "@/_helpers/useScreenSize";
import React from "react";
import { Accordion, Col, Nav, Row, Tab } from "react-bootstrap";
import QuestionIcon from "../Svg/QuestionIcon";

function PronsConsProductPage({ product, tabvalue, handleAccordionChange }) {
  const { isMobile } = useScreenSize();

  /**
   * Splits the input value by "vs" and formats it with bold parts.
   *
   * @param {string} value - The input value to be split and formatted.
   * @return {string} The formatted output with bold parts.
   */
  const splitVsValue = (value) => {
    const splitValue = value && value.trim().split("vs");
    // (splitValue[0])
    const boldedPart = `<strong>${splitValue[0]}</strong>`;
    if (splitValue?.length > 2) {
      return `${boldedPart} vs ${splitValue[1]} vs ${splitValue[2]}`;
    } else {
      return `${boldedPart} vs ${splitValue[1]}`;
    }
  };

  return (
    <Accordion defaultActiveKey="1" className="compare-accordion p-0">
      <Accordion.Item eventKey="1">
        <Accordion.Header as="div">
          <h3 className="font-20">
            {product && product?.page_phases?.better_then}
            {/* Why is {product && product?.name} BETTER than{" "}
          {product && product?.average_title}? */}
          </h3>
          <div className="show-btn">
            {product && product?.page_phases?.show_all}
            <i className="ri-arrow-down-s-line"></i>
          </div>
          <div className="hide-btn">
            {product && product?.page_phases?.hide_all}{" "}
            <i className="ri-arrow-up-s-line"></i>
          </div>
        </Accordion.Header>
        <Accordion.Body>
          <Tab.Container
            id="compare-left-tabs"
            defaultActiveKey={tabvalue?.pros}
          >
            <Row>
              {/* {!isLoading && <Loader pageType={"comparison"} />} */}
              <Col md={8} xl={8} className="dividers">
                <Tab.Content className="compare-tab-content">
                  <Tab.Pane eventKey={tabvalue?.pros}>
                    <ul>
                      {product && tabvalue?.pros == "total"
                        ? product?.total_average_pros
                            ?.slice(0, 8)
                            ?.map((item, index) => {
                              return (
                                <li key={index}>
                                  {/* {(item?.hover_phase)} */}
                                  <span
                                    className={`${
                                      item?.hover_phase !== null
                                        ? "tooltip-title"
                                        : ""
                                    }`}
                                    style={{
                                      textDecoration:
                                        item?.hover_phase !== null
                                          ? ""
                                          : "dotted",
                                    }}
                                  >
                                    {typeof item?.difference_value == "number"
                                      ? item?.difference
                                      : item?.phrase}

                                    {item?.hover_phase && (
                                      <>
                                        <div
                                          className="tooltip-display-content"
                                          style={{
                                            left: isMobile ? "50%" : 0,
                                            transform: isMobile
                                              ? "translateX(-60%)"
                                              : "translateX(-10%)",
                                            width: isMobile ? "190px" : "250px",
                                          }}
                                        >
                                          <span
                                            className="mb-2 prosconsColor"
                                            dangerouslySetInnerHTML={{
                                              __html: item?.hover_phase,
                                            }}
                                          >
                                            {/* {item?.hover_phase} */}
                                          </span>
                                        </div>
                                      </>
                                    )}
                                  </span>

                                  <QuestionIcon
                                    attributes={item?.when_matters}
                                    product={product}
                                  />

                                  <small
                                    className={`${
                                      item?.hover_phase !== ""
                                        ? "d-block tooltip-title"
                                        : "d-block"
                                    }`}
                                  >
                                    {item?.hover_phase && (
                                      <>
                                        <span className="tooltip-display-content">
                                          <span
                                            className="mb-2 prosconsColor"
                                            dangerouslySetInnerHTML={{
                                              __html: item?.hover_phase,
                                            }}
                                          >
                                            {/* {item?.hover_phase} */}
                                          </span>
                                        </span>
                                      </>
                                    )}
                                  </small>
                                  <small>
                                    {item?.difference_value === "yes" ||
                                    item?.difference_value === "no" ||
                                    item?.difference_value === 0 ||
                                    item?.difference_value === null ? (
                                      ""
                                    ) : (
                                      <span
                                        dangerouslySetInnerHTML={{
                                          __html: splitVsValue(item?.vs),
                                        }}
                                      ></span>
                                    )}
                                  </small>
                                </li>
                              );
                            })
                        : ""}
                      {/* Gernal props */}
                      {product &&
                        product?.general?.pros &&
                        tabvalue?.pros == "general" &&
                        product?.general?.pros?.map((item, index) => {
                          return (
                            <li key={index}>
                              {/* {(item)} */}
                              <span
                                className={`${
                                  item?.hover_phase !== null
                                    ? "tooltip-title"
                                    : ""
                                }`}
                                style={{
                                  textDecoration:
                                    item?.hover_phase !== null ? "" : "dotted",
                                }}
                              >
                                {typeof item?.difference_value == "number"
                                  ? item?.difference
                                  : item?.phrase.toFixed(2)}

                                {item?.hover_phase && (
                                  <>
                                    <div className="tooltip-display-content">
                                      <span
                                        className="mb-2 prosconsColor"
                                        dangerouslySetInnerHTML={{
                                          __html: item?.hover_phase,
                                        }}
                                      ></span>
                                    </div>
                                  </>
                                )}
                              </span>

                              <QuestionIcon
                                attributes={item?.when_matters}
                                product={product}
                              />

                              <small className="d-block tooltip-title">
                                {item?.hover_phase && (
                                  <>
                                    <span className="tooltip-display-content">
                                      <span
                                        className="mb-2 prosconsColor"
                                        dangerouslySetInnerHTML={{
                                          __html: item?.hover_phase,
                                        }}
                                      >
                                        {/* {item?.hover_phase} */}
                                      </span>
                                    </span>
                                  </>
                                )}
                              </small>
                              <small>
                                {item?.difference_value === "yes" ||
                                item?.difference_value === "no" ||
                                item?.difference_value === 0 ||
                                item?.difference_value === null ? (
                                  ""
                                ) : (
                                  <span
                                    dangerouslySetInnerHTML={{
                                      __html: splitVsValue(item?.vs),
                                    }}
                                  ></span>
                                )}
                              </small>
                            </li>
                          );
                        })}
                      {product?.average_pros[tabvalue?.pros]?.length > 0 ? (
                        product?.average_pros[tabvalue?.pros]
                          ?.slice(0, 8)
                          ?.map((item, index) => {
                            return (
                              <li key={index}>
                                <span
                                  className={`${
                                    item?.hover_phase !== null
                                      ? "tooltip-title"
                                      : ""
                                  }`}
                                  style={{
                                    textDecoration:
                                      item?.hover_phase !== null
                                        ? ""
                                        : "dotted",
                                  }}
                                >
                                  {typeof item?.difference_value == "number"
                                    ? item?.difference
                                    : item?.phrase}

                                  {item?.hover_phase && (
                                    <>
                                      <div className="tooltip-display-content">
                                        <span
                                          className="mb-2 prosconsColor"
                                          dangerouslySetInnerHTML={{
                                            __html: item?.hover_phase,
                                          }}
                                        >
                                          {/* {item?.hover_phase} */}
                                        </span>
                                      </div>
                                    </>
                                  )}
                                </span>
                                <QuestionIcon
                                  attributes={item?.when_matters}
                                  product={product}
                                />

                                <small className="d-block tooltip-title invisible">
                                  {item?.hover_phase && (
                                    <>
                                      <span
                                        className="toolt
                                    ip-display-content"
                                      >
                                        <span className="mb-2 prosconsColor">
                                          {/* {item?.hover_phase} */}
                                        </span>
                                      </span>
                                    </>
                                  )}
                                </small>
                                <small>
                                  {item?.difference_value === "yes" ||
                                  item?.difference_value === "no" ||
                                  item?.difference_value === 0 ||
                                  item?.difference_value === null ? (
                                    ""
                                  ) : (
                                    <span
                                      dangerouslySetInnerHTML={{
                                        __html: splitVsValue(item?.vs),
                                      }}
                                    ></span>
                                  )}
                                </small>
                              </li>
                            );
                          })
                      ) : (
                        <p></p>
                      )}
                    </ul>
                  </Tab.Pane>
                </Tab.Content>
              </Col>
              <Col md={4} xl={4}>
                <div className="overlay">
                  <Nav className="flex-column compare-nav">
                    <Nav.Item>
                      <Nav.Link
                        eventKey="total"
                        onClick={() => handleAccordionChange("total", "pros")}
                      >
                        TOTAL
                      </Nav.Link>
                    </Nav.Item>
                    {product?.general?.pros?.length > 0 && (
                      <Nav.Item>
                        <Nav.Link
                          eventKey="general"
                          onClick={() =>
                            handleAccordionChange("general", "pros")
                          }
                        >
                          {product && product?.page_phases?.general}
                        </Nav.Link>
                      </Nav.Item>
                    )}

                    {/* <Nav.Item>
                    <Nav.Link
                      eventKey="general"
                      onClick={() =>
                        handleAccordionChange("general", "pros")
                      }
                    >
                      General
                    </Nav.Link>
                  </Nav.Item> */}
                    {product &&
                      Object?.keys(product?.average_pros)?.map(
                        (item, index) => {
                          return (
                            <Nav.Item key={index}>
                              <Nav.Link
                                eventKey={item}
                                onClick={() =>
                                  handleAccordionChange(item, "pros")
                                }
                              >
                                {item}
                              </Nav.Link>
                            </Nav.Item>
                          );
                        }
                      )}
                  </Nav>
                </div>
              </Col>
            </Row>
          </Tab.Container>
        </Accordion.Body>
      </Accordion.Item>

      <Accordion.Item eventKey="2">
        <Accordion.Header as="div">
          <h3 className="font-20">
            {product && product?.page_phases?.worst_then}
            {/* Why is {product && product?.name} WORSE than{" "}
          {product && product?.average_title}? */}
          </h3>

          <div className="show-btn">
            {product && product?.page_phases?.show_all}{" "}
            <i className="ri-arrow-down-s-line"></i>
          </div>
          <div className="hide-btn">
            {product && product?.page_phases?.hide_all}{" "}
            <i className="ri-arrow-up-s-line"></i>
          </div>
        </Accordion.Header>
        <Accordion.Body>
          <Tab.Container
            id="compare-left-tabs"
            defaultActiveKey={tabvalue?.cons}
          >
            <Row>
              <Col md={8} xl={8} className="dividers">
                <Tab.Content className="compare-tab-content">
                  <Tab.Pane eventKey={tabvalue?.cons}>
                    <ul className="compare-crons">
                      {product &&
                      product?.general?.cons &&
                      tabvalue?.cons == "general" ? (
                        product?.general?.cons?.map((item, index) => {
                          return (
                            <li key={index}>
                              {/* {(item)} */}
                              <span
                                className={`${
                                  item?.hover_phase !== null
                                    ? "tooltip-title"
                                    : ""
                                }`}
                                style={{
                                  textDecoration:
                                    item?.hover_phase !== null ? "" : "dotted",
                                }}
                              >
                                {typeof item?.difference_value == "number"
                                  ? item?.difference
                                  : item?.phrase.toFixed(2)}

                                {item?.hover_phase && (
                                  <>
                                    <div className="tooltip-display-content">
                                      <span
                                        className="mb-2 prosconsColor"
                                        dangerouslySetInnerHTML={{
                                          __html: item?.hover_phase,
                                        }}
                                      ></span>
                                    </div>
                                  </>
                                )}
                              </span>

                              <QuestionIcon
                                attributes={item?.when_matters}
                                product={product}
                              />

                              <small className="d-block tooltip-title">
                                {item?.hover_phase && (
                                  <>
                                    <span className="tooltip-display-content">
                                      <span
                                        className="mb-2 prosconsColor"
                                        dangerouslySetInnerHTML={{
                                          __html: item?.hover_phase,
                                        }}
                                      >
                                        {/* {item?.hover_phase} */}
                                      </span>
                                    </span>
                                  </>
                                )}
                              </small>
                              <small>
                                {item?.difference_value === "yes" ||
                                item?.difference_value === "no" ||
                                item?.difference_value === 0 ||
                                item?.difference_value === null ? (
                                  ""
                                ) : (
                                  <span
                                    dangerouslySetInnerHTML={{
                                      __html: splitVsValue(item?.vs),
                                    }}
                                  ></span>
                                )}
                              </small>
                            </li>
                          );
                        })
                      ) : product?.total_average_cons?.length > 0 ? (
                        product && tabvalue?.cons == "total" ? (
                          product?.total_average_cons?.map((item, index) => {
                            return (
                              <li key={index}>
                                <span
                                  className={`${
                                    item?.hover_phase !== null
                                      ? "tooltip-title"
                                      : ""
                                  }`}
                                  style={{
                                    textDecoration:
                                      item?.hover_phase !== null
                                        ? ""
                                        : "dotted",
                                  }}
                                >
                                  {typeof item?.difference_value == "number"
                                    ? item?.difference
                                    : item?.phrase}

                                  {item?.hover_phase && (
                                    <>
                                      <div className="tooltip-display-content">
                                        <span
                                          className="mb-2 prosconsColor"
                                          dangerouslySetInnerHTML={{
                                            __html: item?.hover_phase,
                                          }}
                                        ></span>
                                      </div>
                                    </>
                                  )}
                                </span>
                                <QuestionIcon
                                  attributes={item?.when_matters}
                                  product={product}
                                />

                                <small className="d-block tooltip-title">
                                  {item?.hover_phase && (
                                    <>
                                      <span className="tooltip-display-content">
                                        <span
                                          className="mb-2 prosconsColor"
                                          dangerouslySetInnerHTML={{
                                            __html: item?.hover_phase,
                                          }}
                                        >
                                          {/* {item?.hover_phase} */}
                                        </span>
                                      </span>
                                    </>
                                  )}
                                </small>
                                <small>
                                  {item?.difference_value === "yes" ||
                                  item?.difference_value === "no" ||
                                  item?.difference_value === 0 ||
                                  item?.difference_value === null ? (
                                    ""
                                  ) : (
                                    <span
                                      dangerouslySetInnerHTML={{
                                        __html: splitVsValue(item?.vs),
                                      }}
                                    ></span>
                                  )}
                                </small>
                              </li>
                            );
                          })
                        ) : product?.average_cons[tabvalue?.cons]?.length >
                          0 ? (
                          product?.average_cons[tabvalue?.cons]
                            ?.slice(0, 8)
                            ?.map((item, index) => {
                              return (
                                <li key={index}>
                                  <span
                                    className={`${
                                      item?.hover_phase !== null
                                        ? "tooltip-title"
                                        : ""
                                    }`}
                                    style={{
                                      textDecoration:
                                        item?.hover_phase !== null
                                          ? ""
                                          : "dotted",
                                    }}
                                  >
                                    {typeof item?.difference_value == "number"
                                      ? item?.difference
                                      : item?.phrase}

                                    {item?.hover_phase && (
                                      <>
                                        <div className="tooltip-display-content">
                                          <span
                                            className="mb-2 prosconsColor"
                                            dangerouslySetInnerHTML={{
                                              __html: item?.hover_phase,
                                            }}
                                          >
                                            {/* {item?.hover_phase} */}
                                          </span>
                                        </div>
                                      </>
                                    )}
                                  </span>
                                  <QuestionIcon
                                    attributes={item?.when_matters}
                                    product={product}
                                  />
                                  <small className="d-block tooltip-title">
                                    {item?.hover_phase && (
                                      <>
                                        <span className="tooltip-display-content">
                                          <span
                                            className="mb-2 prosconsColor"
                                            dangerouslySetInnerHTML={{
                                              __html: item?.hover_phase,
                                            }}
                                          >
                                            {/* {item?.hover_phase} */}
                                          </span>
                                        </span>
                                      </>
                                    )}
                                  </small>
                                  <small>
                                    {item?.difference_value === "yes" ||
                                    item?.difference_value === "no" ||
                                    item?.difference_value === 0 ||
                                    item?.difference_value === null ? (
                                      ""
                                    ) : (
                                      <span
                                        dangerouslySetInnerHTML={{
                                          __html: splitVsValue(item?.vs),
                                        }}
                                      ></span>
                                    )}
                                  </small>
                                </li>
                              );
                            })
                        ) : (
                          <p>No Data Found</p>
                        )
                      ) : (
                        <p className="text-center pt-2 pb-2 font-5 font-bold">
                          No Data Found
                        </p>
                      )}
                    </ul>
                  </Tab.Pane>
                </Tab.Content>
              </Col>
              <Col md={4} xl={4}>
                <div className="overlay">
                  <Nav className="flex-column compare-nav">
                    <Nav.Item>
                      <Nav.Link
                        eventKey="total"
                        onClick={() => handleAccordionChange("total", "cons")}
                      >
                        TOTAL
                      </Nav.Link>
                    </Nav.Item>
                    {product?.general?.cons?.length > 0 && (
                      <Nav.Item>
                        <Nav.Link
                          eventKey="general"
                          onClick={() =>
                            handleAccordionChange("general", "cons")
                          }
                        >
                          {product && product?.page_phases?.general}
                        </Nav.Link>
                      </Nav.Item>
                    )}

                    {product &&
                      Object.keys(product?.average_cons).map((item, index) => {
                        return (
                          <Nav.Item key={index}>
                            <Nav.Link
                              eventKey={item}
                              onClick={() =>
                                handleAccordionChange(item, "cons")
                              }
                            >
                              {item}
                            </Nav.Link>
                          </Nav.Item>
                        );
                      })}
                  </Nav>
                </div>
              </Col>
            </Row>
          </Tab.Container>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
}

export default PronsConsProductPage;
