import React, { useEffect, useRef, useState } from "react";
import {
  Accordion,
  Breadcrumb,
  Button,
  Col,
  Container,
  Form,
  Nav,
  Row,
  Tab,
  Tabs,
} from "react-bootstrap";

// import ProsConsToolTip from "@/component/Svg/ProsConsToolTip";
import QuestionIcon from "@/components/Svg/QuestionIcon";
import { LoaderIcon } from "react-hot-toast";
import Loader from "@/app/_components/Loader";
import Radar from "@/_chart/Radar";
const CompareAccordionTab = React.memo(
  ({
    sendProductProps,
    comparePhaseData,
    categorySlug,
    getProsConsforVsPage,
  }) => {
    const [activatab, setActiveTab] = useState("tab-1");
    const [apiData, setApiData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [graphData, setGraphData] = useState(null);
    const [activeAccordionTab, setActiveAccordionTab] = useState(null);
    // console.log(comparePhaseData?.yes);

    // extract the permalink from the sendProductProps
    const extractedUrls = sendProductProps.map((entry) => entry?.permalink);
    // (sendProductProps?.length)

    const [tabvalue, setTabValue] = useState({ pros: "total", cons: "total" });

    const handleAccordionChange = (value, key) => {
      if (key == "pros") {
        if (value == "total") {
          setTabValue({ ...tabvalue, pros: "total" });
        } else if (value === "general") {
          setTabValue({ ...tabvalue, pros: value });
        } else {
          setTabValue({ ...tabvalue, pros: value });
        }
      } else {
        if (value == "total") {
          setTabValue({ ...tabvalue, cons: "total" });
        } else {
          setTabValue({ ...tabvalue, cons: value });
        }
      }
    };
    const handleTabChange = (eventKey) => {
      // (eventKey);
      setActiveTab(eventKey);
      setIsLoading(false);
    };
    useEffect(() => {
      // Extract the numerical index from the eventKey
      const index = parseInt(activatab.split("-")[1], 10);
      // Swap the order of extractedUrls when the active tab changes
      const updatedUrls = [...extractedUrls];
      // (updatedUrls);
      const temp = updatedUrls[index - 1];
      updatedUrls[index - 1] = updatedUrls[0];
      updatedUrls[0] = temp;
      const apiUrlParams = updatedUrls.map((url, idx) => {
        return `permalink${idx + 1}=${url}`;
      });

      const apiUrl = `${
        process.env.NEXT_PUBLIC_API_URL
      }/product/average/${categorySlug}?${apiUrlParams.join("&")}`;
      // Now you can use apiUrl to make your API call or perform any other actions
      const headers = {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
      };
      fetch(apiUrl, {
        method: "GET",
        headers: headers,
      })
        .then((response) => response.json())
        .then((data) => {
          setApiData(data.data);
          // (data.data,"Check")
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });

      const secondApiUrl = `${
        process.env.NEXT_PUBLIC_API_URL
      }/generate-chart/${categorySlug}?${apiUrlParams.join("&")}`;
      fetch(secondApiUrl, {
        method: "GET",
        headers: headers,
      })
        .then((response) => response.json())
        .then((data) => {
          // (data.data?.sets);
          setGraphData(data.data?.sets); // Assuming data from the second API call is directly usable
        })
        .catch((error) => {
          console.error("Error fetching data from second API:", error);
        });

      setTimeout(() => {
        setIsLoading(true);
      }, 1000);
    }, [activatab]);
    // (graphData?.data);

    // this funcation spilt the vs value from ApiData
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

    //  find button and add data Attribute to button
    const getColorBasedOnScore = (score) => {
      if (score >= 9.7) {
        return "#28A28C";
      } else if (score >= 8.7 && score < 9.2) {
        return "#437ECE";
      } else {
        return "#FF8F0B";
      }
    };

    //if value is an integer and not equal to 10, add decimal that value
    const formatValue = (value) => {
      if (value % 1 === 0 && value !== 10) {
        return `${value}.0`;
      }
      return value;
    };
    useEffect(() => {
      const getColor = ["#437ECE", "#FF8F0B", "#28A28C"];
      // Find all buttons that are children of an element with role="presentation" add attribute
      const attributeAdd = document.querySelectorAll(
        '[role="presentation"] button'
      );
      attributeAdd.forEach((button, index) => {
        button.setAttribute(
          "data-count",
          formatValue(sendProductProps[index]?.overall_score)
        );
        button.style.setProperty("--color-bg", getColor[index]);
      });
    }, []);

    // Helping Funcation Accordion Heading

    const getTabNumber = () => {
      const tabNumbers = { "tab-2": 1, "tab-3": 2 };
      return tabNumbers[activatab] || 0;
    };
    const getComparisonIndex = () => (getTabNumber() + 1) % 3;
    const accordionHeader = (type) => {
      const isPros = type === "pros";
      const comparisonText = isPros
        ? comparePhaseData?.two_products_better_then
        : comparePhaseData?.two_products_better_then;

      const tabNumber = getTabNumber();
      const comparisonIndex = getComparisonIndex();
      return (
        <h3 className="font-20">
          {/* Why is {sendProductProps[tabNumber]?.name} {comparisonText} than{" "} */}
          {sendProductProps?.length > 2
            ? comparePhaseData?.three_products_better_then
            : comparePhaseData?.two_products_better_then}
          {extractedUrls.length > 2
            ? activatab === "tab-3"
              ? "other"
              : "other"
            : activatab === "tab-2"
            ? sendProductProps[0]?.name
            : sendProductProps[1]?.name}
          ?
        </h3>
      );
    };

    // (graphData);

    const [highlighted, setHighlighted] = useState(null);

    const onHover = (hovered) => {
      if (!highlighted && !hovered) return;
      if (highlighted && hovered && hovered.key === highlighted.key) return;
      setHighlighted(hovered);
    };
    // (comparePhaseData)
    useEffect(() => {
      handleAccordionChange("total", "pros");
    }, [activatab]);
    // console.log(apiData);
    return (
      <>
        <Row>
          <Col md={12} lg={6}>
            <Tabs
              defaultActiveKey="tab-1"
              id="Review-tab"
              className="site_tabs graph-tab compare-graph-tabs"
              activeKey={activatab}
              onSelect={handleTabChange}
              data-count="4.0"
            >
              {sendProductProps?.map((items, index) => (
                <Tab
                  eventKey={`tab-${index + 1}`}
                  title={items?.name}
                  key={index}
                  onSelect={() => {
                    d3.select(".tooltip").remove(); // Remove existing tooltip
                  }}
                >
                  <div className="graph-tab-content compare_radar_chart">
                    {activatab === `tab-${index + 1}` && graphData && (
                      <Radar
                        data={graphData}
                        itemsData={items}
                        activeTab={index}
                      />
                    )}
                  </div>
                </Tab>
              ))}
            </Tabs>
          </Col>
          <Col md={12} lg={6}>
            <Accordion defaultActiveKey="1" className="compare-accordion p-0">
              <Accordion.Item eventKey="1">
                <Accordion.Header as="div">
                  <h3 className="font-20 h_neet">
                    {" "}
                    {sendProductProps?.length > 2
                      ? activatab === "tab-3"
                        ? getProsConsforVsPage?.apiThird?.data
                            ?.three_products_better_then
                        : activatab === "tab-2"
                        ? getProsConsforVsPage?.apiSecond?.data
                            ?.three_products_better_then
                        : getProsConsforVsPage?.apiFirst?.data
                            ?.three_products_better_then
                      : activatab === "tab-2"
                      ? getProsConsforVsPage?.apiSecond?.data
                          ?.two_products_better_then
                      : getProsConsforVsPage?.apiFirst?.data
                          ?.two_products_better_then}
                  </h3>

                  <div className="show-btn remove_outline_border">
                    {comparePhaseData && comparePhaseData?.show_all}{" "}
                    <i className="ri-arrow-down-s-line"></i>
                  </div>
                  <div className="hide-btn">
                    {comparePhaseData && comparePhaseData?.hide_all}{" "}
                    <i className="ri-arrow-down-s-line"></i>
                  </div>
                </Accordion.Header>
                <Accordion.Body>
                  <Tab.Container
                    id="compare-left-tabs"
                    defaultActiveKey={tabvalue?.pros}
                  >
                    <Row>
                      {!isLoading && <Loader pageType={"comparison"} />}
                      {/* {(apiData)} */}
                      <Col md={8} xl={8} className="dividers">
                        <Tab.Content className="compare-tab-content">
                          <Tab.Pane eventKey={tabvalue?.pros}>
                            <ul>
                              {apiData && tabvalue?.pros === "total"
                                ? apiData?.total_average_pros
                                    ?.slice(0, 8)
                                    ?.map((item, index) => {
                                      return (
                                        <li key={index}>
                                          {/* {(item?.difference)} */}
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
                                            {extractedUrls.length > 2
                                              ? typeof item?.difference_value ==
                                                "number"
                                                ? item?.difference.replace(
                                                    /\d+\.?\d*%/,
                                                    ""
                                                  )
                                                : item?.phrase
                                              : typeof item?.difference_value ==
                                                "number"
                                              ? item?.difference
                                              : item?.phrase}

                                            {item?.hover_phase && (
                                              <>
                                                <div className="tooltip-display-content">
                                                  <span
                                                    className="prosconsColor"
                                                    dangerouslySetInnerHTML={{
                                                      __html: item?.hover_phase,
                                                    }}
                                                  ></span>
                                                </div>
                                              </>
                                            )}
                                          </span>
                                          {/* {console.log(comparePhaseData,"neet")} */}
                                          {item?.when_matters?.description && (
                                            <QuestionIcon
                                              attributes={item?.when_matters}
                                              comparePhaseData={
                                                comparePhaseData
                                              }
                                            />
                                          )}

                                          {/* <QuestionIcon
                                            attributes={item?.when_matters}
                                            comparePhaseData={comparePhaseData}
                                          /> */}

                                          <small className="d-block tooltip-title">
                                            {item?.hover_phase && (
                                              <>
                                                <span className="tooltip-display-content">
                                                  <span
                                                    className="prosconsColor"
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
                                          {/* {console.log(item?.vs)} */}
                                          <small>
                                            {item?.difference_value ===
                                              comparePhaseData?.yes ||
                                            item?.difference_value ===
                                              comparePhaseData?.no ||
                                            item?.difference_value === null ? (
                                              ""
                                            ) : (
                                              <span
                                                dangerouslySetInnerHTML={{
                                                  __html: splitVsValue(
                                                    item?.vs
                                                  ),
                                                }}
                                              ></span>
                                            )}
                                          </small>
                                        </li>
                                      );
                                    })
                                : ""}
                              {/* Gernal props */}
                              {apiData &&
                                apiData?.general?.pros &&
                                tabvalue?.pros == "general" &&
                                apiData?.general?.pros?.map((item, index) => {
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
                                            item?.hover_phase !== null
                                              ? ""
                                              : "dotted",
                                        }}
                                      >
                                        {extractedUrls.length > 2
                                          ? typeof item?.difference_value ==
                                            "number"
                                            ? item?.difference.replace(
                                                /\d+\.?\d*%/,
                                                ""
                                              )
                                            : item?.phrase
                                          : typeof item?.difference_value ==
                                            "number"
                                          ? item?.difference
                                          : item?.phrase}

                                        {item?.hover_phase && (
                                          <>
                                            <div className="tooltip-display-content">
                                              <span
                                                className="prosconsColor"
                                                dangerouslySetInnerHTML={{
                                                  __html: item?.hover_phase,
                                                }}
                                              ></span>
                                            </div>
                                          </>
                                        )}
                                      </span>
                                      {item?.when_matters?.description && (
                                        <QuestionIcon
                                          attributes={item?.when_matters}
                                          comparePhaseData={comparePhaseData}
                                        />
                                      )}

                                      <small className="d-block tooltip-title">
                                        {item?.hover_phase && (
                                          <>
                                            <span className="tooltip-display-content">
                                              <span
                                                className="prosconsColor"
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
                                        {item?.difference_value ===
                                          comparePhaseData?.yes ||
                                        item?.difference_value ===
                                          comparePhaseData?.no ||
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

                              {/* SSR code start */}

                              {getProsConsforVsPage &&
                                Object.values(
                                  getProsConsforVsPage?.apiFirst?.data
                                    ?.average_pros
                                )?.map((item, index) => {
                                  return item?.map((itemx, index) => {
                                    return (
                                      <li
                                        key={index}
                                        style={{
                                          display:
                                            Object.values(
                                              getProsConsforVsPage?.apiFirst
                                                ?.data?.average_pros
                                            )[index] === tabvalue.pros
                                              ? "block"
                                              : "none",
                                        }}
                                      >
                                        <span
                                          className={`${
                                            itemx?.hover_phase !== null
                                              ? "tooltip-title  pros_frist"
                                              : ""
                                          }`}
                                          style={{
                                            textDecoration:
                                              itemx?.hover_phase !== null
                                                ? ""
                                                : "dotted",
                                          }}
                                        >
                                          {typeof itemx?.difference_value ===
                                          "number"
                                            ? itemx?.difference
                                            : itemx?.phrase}
                                          {itemx?.hover_phase && (
                                            <div className="tooltip-display-content">
                                              <span
                                                className="mb-2 prosconsColor"
                                                dangerouslySetInnerHTML={{
                                                  __html: itemx?.hover_phase,
                                                }}
                                              />
                                            </div>
                                          )}
                                        </span>
                                        {item?.when_matters?.description && (
                                          <QuestionIcon
                                            attributes={item?.when_matters}
                                            comparePhaseData={comparePhaseData}
                                          />
                                        )}
                                        {/* <QuestionIcon
                                          attributes={itemx?.when_matters}
                                          comparePhaseData={comparePhaseData}
                                        /> */}
                                        {itemx?.hover_phase && (
                                          <small className="d-block tooltip-title invisible">
                                            <span className="tooltip-display-content">
                                              <span className="mb-2 prosconsColor">
                                                {/* {itemx?.hover_phase} */}
                                              </span>
                                            </span>
                                          </small>
                                        )}
                                        {/* <small>
                                        {[comparePhaseData?.yes, comparePhaseData?.no, 0, null].includes(
                                          itemx?.difference_value
                                        ) ? (
                                          ""
                                        ) : (
                                          <span
                                            dangerouslySetInnerHTML={{
                                              __html: splitVsValue(itemx?.vs),
                                            }}
                                          />
                                        )}
                                      </small> */}
                                      </li>
                                    );
                                  });
                                })}
                              {getProsConsforVsPage &&
                                Object.values(
                                  getProsConsforVsPage?.apiSecond?.data
                                    ?.average_pros
                                )?.map((item, index) => {
                                  return item?.map((itemx, index) => {
                                    return (
                                      <li
                                        key={index}
                                        style={{
                                          display:
                                            Object.values(
                                              getProsConsforVsPage?.apiFirst
                                                ?.data?.average_pros
                                            )[index] === tabvalue.pros
                                              ? "block"
                                              : "none",
                                        }}
                                      >
                                        <span
                                          className={`${
                                            itemx?.hover_phase !== null
                                              ? "tooltip-title  pros_second"
                                              : ""
                                          }`}
                                          style={{
                                            textDecoration:
                                              itemx?.hover_phase !== null
                                                ? ""
                                                : "dotted",
                                          }}
                                        >
                                          {typeof itemx?.difference_value ===
                                          "number"
                                            ? itemx?.difference
                                            : itemx?.phrase}
                                          {itemx?.hover_phase && (
                                            <div className="tooltip-display-content">
                                              <span
                                                className="mb-2 prosconsColor"
                                                dangerouslySetInnerHTML={{
                                                  __html: itemx?.hover_phase,
                                                }}
                                              />
                                            </div>
                                          )}
                                        </span>
                                        {item?.when_matters?.description && (
                                          <QuestionIcon
                                            attributes={item?.when_matters}
                                            comparePhaseData={comparePhaseData}
                                          />
                                        )}
                                        {itemx?.hover_phase && (
                                          <small className="d-block tooltip-title invisible">
                                            <span className="tooltip-display-content">
                                              <span className="mb-2 prosconsColor">
                                                {/* {itemx?.hover_phase} */}
                                              </span>
                                            </span>
                                          </small>
                                        )}
                                        {/* <small>
                                        {[comparePhaseData?.yes, comparePhaseData?.no, 0, null].includes(
                                          itemx?.difference_value
                                        ) ? (
                                          ""
                                        ) : (
                                          <span
                                            dangerouslySetInnerHTML={{
                                              __html: splitVsValue(itemx?.vs),
                                            }}
                                          />
                                        )}
                                      </small> */}
                                      </li>
                                    );
                                  });
                                })}

                              {getProsConsforVsPage?.apiThird &&
                                Object.values(
                                  getProsConsforVsPage?.apiThird?.data
                                    ?.average_pros
                                )?.map((item, index) => {
                                  return item?.map((itemx, index) => {
                                    return (
                                      <li
                                        key={index}
                                        style={{
                                          display:
                                            Object.values(
                                              getProsConsforVsPage?.apiThird
                                                ?.data?.average_pros
                                            )[index] === tabvalue.pros
                                              ? "block"
                                              : "none",
                                        }}
                                      >
                                        <span
                                          className={`${
                                            itemx?.hover_phase !== null
                                              ? "tooltip-title pros_third"
                                              : ""
                                          }`}
                                          style={{
                                            textDecoration:
                                              itemx?.hover_phase !== null
                                                ? ""
                                                : "dotted",
                                          }}
                                        >
                                          {typeof itemx?.difference_value ===
                                          "number"
                                            ? itemx?.difference
                                            : itemx?.phrase}
                                          {itemx?.hover_phase && (
                                            <div className="tooltip-display-content">
                                              <span
                                                className="mb-2 prosconsColor"
                                                dangerouslySetInnerHTML={{
                                                  __html: itemx?.hover_phase,
                                                }}
                                              />
                                            </div>
                                          )}
                                        </span>
                                        {item?.when_matters?.description && (
                                          <QuestionIcon
                                            attributes={item?.when_matters}
                                            comparePhaseData={comparePhaseData}
                                          />
                                        )}
                                        {itemx?.hover_phase && (
                                          <small className="d-block tooltip-title invisible">
                                            <span className="tooltip-display-content">
                                              <span className="mb-2 prosconsColor">
                                                {/* {itemx?.hover_phase} */}
                                              </span>
                                            </span>
                                          </small>
                                        )}
                                        {/* <small>
                                          {[comparePhaseData?.yes, comparePhaseData?.no, 0, null].includes(
                                            itemx?.difference_value
                                          ) ? (
                                            ""
                                          ) : (
                                            <span
                                              dangerouslySetInnerHTML={{
                                                __html: splitVsValue(itemx?.vs),
                                              }}
                                            />
                                          )}
                                        </small> */}
                                      </li>
                                    );
                                  });
                                })}

                              {/* SSR code start */}
                              {/* {console.log(
                                apiData?.average_pros[tabvalue?.pros]
                              )} */}

                              {apiData?.average_pros[tabvalue?.pros]?.length >
                              0 ? (
                                apiData?.average_pros[tabvalue?.pros]
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
                                          {extractedUrls.length > 2
                                            ? typeof item?.difference_value ==
                                              "number"
                                              ? item?.difference.replace(
                                                  /\d+\.\d+%/,
                                                  ""
                                                )
                                              : item?.phrase
                                            : typeof item?.difference_value ==
                                              "number"
                                            ? item?.difference
                                            : item?.phrase}

                                          {item?.hover_phase && (
                                            <>
                                              <div className="tooltip-display-content">
                                                <span
                                                  className="prosconsColor"
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
                                        {item?.when_matters?.description && (
                                          <QuestionIcon
                                            attributes={item?.when_matters}
                                            comparePhaseData={comparePhaseData}
                                          />
                                        )}

                                        <small className="d-block tooltip-title invisible">
                                          {item?.hover_phase && (
                                            <>
                                              <span
                                                className="toolt
                                            ip-display-content"
                                              >
                                                <span className="prosconsColor">
                                                  {/* {item?.hover_phase} */}
                                                </span>
                                              </span>
                                            </>
                                          )}
                                        </small>
                                        <small>
                                          {item?.difference_value ===
                                            comparePhaseData?.yes ||
                                          item?.difference_value ===
                                            comparePhaseData?.no ||
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
                                onClick={() =>
                                  handleAccordionChange("total", "pros")
                                }
                              >
                                {comparePhaseData && comparePhaseData?.total}
                              </Nav.Link>
                            </Nav.Item>
                            {apiData?.general?.pros?.length > 0 && (
                              <Nav.Item>
                                <Nav.Link
                                  eventKey="general"
                                  onClick={() =>
                                    handleAccordionChange("general", "pros")
                                  }
                                >
                                  {comparePhaseData &&
                                    comparePhaseData?.general}
                                </Nav.Link>
                              </Nav.Item>
                            )}

                            {apiData &&
                              Object.keys(apiData?.average_pros)?.map(
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
                  {/* worse than */}
                  <h3 className="font-20">
                    {" "}
                    {sendProductProps?.length > 2
                      ? activatab === "tab-3"
                        ? getProsConsforVsPage?.apiThird?.data
                            ?.three_products_worse_then
                        : activatab === "tab-2"
                        ? getProsConsforVsPage?.apiSecond?.data
                            ?.three_products_worse_then
                        : getProsConsforVsPage?.apiFirst?.data
                            ?.three_products_worse_then
                      : activatab === "tab-2"
                      ? getProsConsforVsPage?.apiSecond?.data
                          ?.two_products_worse_then
                      : getProsConsforVsPage?.apiFirst?.data
                          ?.two_products_worse_then}
                    {/* {sendProductProps?.length > 2
                      ? activatab === "tab-3"
                        ? apiData?.three_products_worse_then
                        : activatab === "tab-2"
                        ? apiData?.three_products_worse_then
                        : apiData?.three_products_worse_then
                      : activatab === "tab-2"
                      ? apiData?.two_products_worse_then
                      : apiData?.two_products_worse_then} */}
                  </h3>

                  <div className="show-btn">
                    {comparePhaseData && comparePhaseData?.show_all}{" "}
                    <i className="ri-arrow-down-s-line"></i>
                  </div>
                  <div className="hide-btn">
                    {comparePhaseData && comparePhaseData?.hide_all}{" "}
                    <i className="ri-arrow-up-s-line"></i>
                  </div>
                </Accordion.Header>
                <Accordion.Body>
                  <Tab.Container
                    id="compare-left-tabs"
                    defaultActiveKey={tabvalue?.cons}
                  >
                    <Row>
                      {!isLoading && <Loader pageType={"comparison"} />}
                      <Col md={8} xl={8} className="dividers">
                        <Tab.Content className="compare-tab-content">
                          <Tab.Pane eventKey={tabvalue?.cons}>
                            <ul className="compare-crons">
                              {apiData &&
                              apiData?.general?.cons &&
                              tabvalue?.cons == "general" ? (
                                apiData?.general?.cons?.map((item, index) => {
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
                                            item?.hover_phase !== null
                                              ? ""
                                              : "dotted",
                                        }}
                                      >
                                        {extractedUrls.length > 2
                                          ? typeof item?.difference_value ==
                                            "number"
                                            ? item?.difference.replace(
                                                /\d+\.\d+%/,
                                                ""
                                              )
                                            : item?.phrase
                                          : typeof item?.difference_value ==
                                            "number"
                                          ? item?.difference
                                          : item?.phrase}

                                        {item?.hover_phase && (
                                          <>
                                            <div className="tooltip-display-content">
                                              <span
                                                className="prosconsColor"
                                                dangerouslySetInnerHTML={{
                                                  __html: item?.hover_phase,
                                                }}
                                              ></span>
                                            </div>
                                          </>
                                        )}
                                      </span>

                                      {item?.when_matters?.description && (
                                        <QuestionIcon
                                          attributes={item?.when_matters}
                                          comparePhaseData={comparePhaseData}
                                        />
                                      )}

                                      <small className="d-block tooltip-title">
                                        {item?.hover_phase && (
                                          <>
                                            <span className="tooltip-display-content">
                                              <span
                                                className="prosconsColor"
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
                                        {item?.difference_value ===
                                          comparePhaseData?.yes ||
                                        item?.difference_value ===
                                          comparePhaseData?.no ||
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
                              ) : apiData?.total_average_cons?.length > 0 ? (
                                apiData && tabvalue?.cons == "total" ? (
                                  apiData?.total_average_cons?.map(
                                    (item, index) => {
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
                                            {extractedUrls.length > 2
                                              ? typeof item?.difference_value ==
                                                "number"
                                                ? item?.difference.replace(
                                                    /\d+\.\d+%/,
                                                    ""
                                                  )
                                                : item?.phrase
                                              : typeof item?.difference_value ==
                                                "number"
                                              ? item?.difference
                                              : item?.phrase}

                                            {item?.hover_phase && (
                                              <>
                                                <div className="tooltip-display-content">
                                                  <span
                                                    className="prosconsColor"
                                                    dangerouslySetInnerHTML={{
                                                      __html: item?.hover_phase,
                                                    }}
                                                  />
                                                  {/* {item?.hover_phase} */}
                                                </div>
                                              </>
                                            )}
                                          </span>
                                          {item?.when_matters?.description && (
                                            <QuestionIcon
                                              attributes={item?.when_matters}
                                              comparePhaseData={
                                                comparePhaseData
                                              }
                                            />
                                          )}
                                          <small className="d-block tooltip-title">
                                            {item?.hover_phase && (
                                              <>
                                                <span className="tooltip-display-content">
                                                  <span
                                                    className="prosconsColor"
                                                    dangerouslySetInnerHTML={{
                                                      __html: item?.hover_phase,
                                                    }}
                                                  />
                                                  {/* {item?.hover_phase} */}
                                                </span>
                                              </>
                                            )}
                                          </small>
                                          <small>
                                            {item?.difference_value ===
                                              comparePhaseData?.yes ||
                                            item?.difference_value ===
                                              comparePhaseData?.no ||
                                            item?.difference_value === null ? (
                                              ""
                                            ) : (
                                              <span
                                                dangerouslySetInnerHTML={{
                                                  __html: splitVsValue(
                                                    item?.vs
                                                  ),
                                                }}
                                              ></span>
                                            )}
                                          </small>
                                        </li>
                                      );
                                    }
                                  )
                                ) : apiData?.average_cons[tabvalue?.cons]
                                    ?.length > 0 ? (
                                  apiData?.average_cons[tabvalue?.cons]
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
                                            {extractedUrls.length > 2
                                              ? typeof item?.difference_value ==
                                                "number"
                                                ? item?.difference.replace(
                                                    /\d+\.?\d*%/,
                                                    ""
                                                  )
                                                : item?.phrase
                                              : typeof item?.difference_value ==
                                                "number"
                                              ? item?.difference
                                              : item?.phrase}

                                            {item?.hover_phase && (
                                              <>
                                                <div className="tooltip-display-content">
                                                  <span
                                                    className="prosconsColor"
                                                    dangerouslySetInnerHTML={{
                                                      __html: item?.hover_phase,
                                                    }}
                                                  />
                                                  {/* {item?.hover_phase} */}
                                                </div>
                                              </>
                                            )}
                                          </span>
                                          {item?.when_matters?.description && (
                                            <QuestionIcon
                                              attributes={item?.when_matters}
                                              comparePhaseData={
                                                comparePhaseData
                                              }
                                            />
                                          )}

                                          <small className="d-block tooltip-title">
                                            {item?.hover_phase && (
                                              <>
                                                <span className="tooltip-display-content">
                                                  <span
                                                    className="prosconsColor"
                                                    dangerouslySetInnerHTML={{
                                                      __html: item?.hover_phase,
                                                    }}
                                                  />
                                                </span>
                                              </>
                                            )}
                                          </small>
                                          <small>
                                            {item?.difference_value ===
                                              comparePhaseData?.yes ||
                                            item?.difference_value ===
                                              comparePhaseData?.no ||
                                            item?.difference_value === null ? (
                                              ""
                                            ) : (
                                              <span
                                                dangerouslySetInnerHTML={{
                                                  __html: splitVsValue(
                                                    item?.vs
                                                  ),
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
                              {/* SSR code for cons Start */}
                              {getProsConsforVsPage &&
                                Object.values(
                                  getProsConsforVsPage?.apiFirst?.data
                                    ?.average_cons
                                )?.map((item, index) => {
                                  return item?.map((itemx, index) => {
                                    return (
                                      <li
                                        key={index}
                                        style={{
                                          display:
                                            Object.values(
                                              getProsConsforVsPage?.apiFirst
                                                ?.data?.average_cons
                                            )[index] === tabvalue.pros
                                              ? "block"
                                              : "none",
                                        }}
                                      >
                                        <span
                                          className={`${
                                            itemx?.hover_phase !== null
                                              ? "tooltip-title cons_frist"
                                              : ""
                                          }`}
                                          style={{
                                            textDecoration:
                                              itemx?.hover_phase !== null
                                                ? ""
                                                : "dotted",
                                          }}
                                        >
                                          {typeof itemx?.difference_value ===
                                          "number"
                                            ? itemx?.difference
                                            : itemx?.phrase}
                                          {itemx?.hover_phase && (
                                            <div className="tooltip-display-content">
                                              <span
                                                className="mb-2 prosconsColor"
                                                dangerouslySetInnerHTML={{
                                                  __html: itemx?.hover_phase,
                                                }}
                                              />
                                            </div>
                                          )}
                                        </span>
                                        {item?.when_matters?.description && (
                                          <QuestionIcon
                                            attributes={item?.when_matters}
                                            comparePhaseData={comparePhaseData}
                                          />
                                        )}
                                        {itemx?.hover_phase && (
                                          <small className="d-block tooltip-title invisible">
                                            <span className="tooltip-display-content">
                                              <span className="mb-2 prosconsColor">
                                                {/* {itemx?.hover_phase} */}
                                              </span>
                                            </span>
                                          </small>
                                        )}
                                        {/* <small>
                                        {[comparePhaseData?.yes, comparePhaseData?.no, 0, null].includes(
                                          itemx?.difference_value
                                        ) ? (
                                          ""
                                        ) : (
                                          <span
                                            dangerouslySetInnerHTML={{
                                              __html: splitVsValue(itemx?.vs),
                                            }}
                                          />
                                        )}
                                      </small> */}
                                      </li>
                                    );
                                  });
                                })}
                              {getProsConsforVsPage &&
                                Object.values(
                                  getProsConsforVsPage?.apiSecond?.data
                                    ?.average_cons
                                )?.map((item, index) => {
                                  return item?.map((itemx, index) => {
                                    return (
                                      <li
                                        key={index}
                                        style={{
                                          display:
                                            Object.values(
                                              getProsConsforVsPage?.apiSecond
                                                ?.data?.average_cons
                                            )[index] === tabvalue.pros
                                              ? "block"
                                              : "none",
                                        }}
                                      >
                                        <span
                                          className={`${
                                            itemx?.hover_phase !== null
                                              ? "tooltip-title cons_second"
                                              : ""
                                          }`}
                                          style={{
                                            textDecoration:
                                              itemx?.hover_phase !== null
                                                ? ""
                                                : "dotted",
                                          }}
                                        >
                                          {typeof itemx?.difference_value ===
                                          "number"
                                            ? itemx?.difference
                                            : itemx?.phrase}
                                          {itemx?.hover_phase && (
                                            <div className="tooltip-display-content">
                                              <span
                                                className="mb-2 prosconsColor"
                                                dangerouslySetInnerHTML={{
                                                  __html: itemx?.hover_phase,
                                                }}
                                              />
                                            </div>
                                          )}
                                        </span>
                                        {item?.when_matters?.description && (
                                          <QuestionIcon
                                            attributes={item?.when_matters}
                                            comparePhaseData={comparePhaseData}
                                          />
                                        )}
                                        {itemx?.hover_phase && (
                                          <small className="d-block tooltip-title invisible">
                                            <span className="tooltip-display-content">
                                              <span className="mb-2 prosconsColor">
                                                {/* {itemx?.hover_phase} */}
                                              </span>
                                            </span>
                                          </small>
                                        )}
                                        {/* <small>
                                        {[comparePhaseData?.yes, comparePhaseData?.no, 0, null].includes(
                                          itemx?.difference_value
                                        ) ? (
                                          ""
                                        ) : (
                                          <span
                                            dangerouslySetInnerHTML={{
                                              __html: splitVsValue(itemx?.vs),
                                            }}
                                          />
                                        )}
                                      </small> */}
                                      </li>
                                    );
                                  });
                                })}
                              {getProsConsforVsPage?.apiThird &&
                                Object.values(
                                  getProsConsforVsPage?.apiThird?.data
                                    ?.average_cons
                                )?.map((item, index) => {
                                  return item?.map((itemx, index) => {
                                    return (
                                      <li
                                        key={index}
                                        style={{
                                          display:
                                            Object.values(
                                              getProsConsforVsPage?.apiThird
                                                ?.data?.average_cons
                                            )[index] === tabvalue.pros
                                              ? "block"
                                              : "none",
                                        }}
                                      >
                                        <span
                                          className={`${
                                            itemx?.hover_phase !== null
                                              ? "tooltip-title cons_third"
                                              : ""
                                          }`}
                                          style={{
                                            textDecoration:
                                              itemx?.hover_phase !== null
                                                ? ""
                                                : "dotted",
                                          }}
                                        >
                                          {typeof itemx?.difference_value ===
                                          "number"
                                            ? itemx?.difference
                                            : itemx?.phrase}
                                          {itemx?.hover_phase && (
                                            <div className="tooltip-display-content">
                                              <span
                                                className="mb-2 prosconsColor"
                                                dangerouslySetInnerHTML={{
                                                  __html: itemx?.hover_phase,
                                                }}
                                              />
                                            </div>
                                          )}
                                        </span>
                                        {item?.when_matters?.description && (
                                          <QuestionIcon
                                            attributes={item?.when_matters}
                                            comparePhaseData={comparePhaseData}
                                          />
                                        )}
                                        {itemx?.hover_phase && (
                                          <small className="d-block tooltip-title invisible">
                                            <span className="tooltip-display-content">
                                              <span className="mb-2 prosconsColor">
                                                {/* {itemx?.hover_phase} */}
                                              </span>
                                            </span>
                                          </small>
                                        )}
                                        {/* <small>
                                        {[comparePhaseData?.yes, comparePhaseData?.no, 0, null].includes(
                                          itemx?.difference_value
                                        ) ? (
                                          ""
                                        ) : (
                                          <span
                                            dangerouslySetInnerHTML={{
                                              __html: splitVsValue(itemx?.vs),
                                            }}
                                          />
                                        )}
                                      </small> */}
                                      </li>
                                    );
                                  });
                                })}
                              {/* SSR code for cons Start */}
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
                                onClick={() =>
                                  handleAccordionChange("total", "cons")
                                }
                              >
                                {comparePhaseData && comparePhaseData?.total}
                              </Nav.Link>
                            </Nav.Item>
                            {/* {(
                              comparePhaseData && comparePhaseData?.general
                            )} */}
                            {apiData?.general?.cons?.length > 0 && (
                              <Nav.Item>
                                <Nav.Link
                                  eventKey="general"
                                  onClick={() =>
                                    handleAccordionChange("general", "cons")
                                  }
                                >
                                  {comparePhaseData &&
                                    comparePhaseData?.general}
                                </Nav.Link>
                              </Nav.Item>
                            )}

                            {apiData &&
                              Object.keys(apiData?.average_cons).map(
                                (item, index) => {
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
                                }
                              )}
                          </Nav>
                        </div>
                      </Col>
                    </Row>
                  </Tab.Container>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Col>
        </Row>
      </>
    );
  }
);

export default CompareAccordionTab;
