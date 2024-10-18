"use client";
/* eslint-disable react/display-name */
import React, { useState, useRef, useEffect, useCallback } from "react";
import { Accordion, Form } from "react-bootstrap";
import {
  getDropdownFilter,
  getFilteredAttributeValues,
} from "../../../_helpers";
import MultiRangeSlider from "../MultiRangeSlider/MultiRangeSlider.js";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import useScreenSize from "@/_helpers/useScreenSize";
import MultiRangeMobileSlider from "../MultiRangeSlider/MultiRangeMobileSlider";
import MultiRangeSliderAttributes from "../MultiRangeSlider/MultiRangeSliderAttributes";

export default function Filter({
  categoryAttributes,
  removedParam,
  guidePhraseData,
  searchParam,
  orderBy,
  setremovedParam,
}) {
  // (guidePhraseData);
  // {console.log(guidePhraseData.yes)}

  const router = useRouter();
  const searchParams = useSearchParams();
  const [sliderValues, setSliderValues] = useState({});
  // const [sliderValues, setSliderValues] = useState({
  //   minVal: 0,
  //   maxVal: 0,
  // });
  const [sliderPriceValues, setSliderPriceValues] = useState({
    minVal: 0,
    maxVal: 0,
  });
  let price = categoryAttributes?.price;
  // (price);
  let brands = categoryAttributes?.brands;
  let productCount = categoryAttributes?.attributes;
  let attributeCategories = categoryAttributes?.attribute_categories;
  let initialNoOfCategories = 5;
  let updatedParams = {};
  const [pagination, setPagination] = useState({});
  const handlePagination = (categoryName) => {
    let updatedPage =
      pagination[categoryName] + initialNoOfCategories ||
      initialNoOfCategories * 2;
    setPagination({ ...pagination, [categoryName]: updatedPage });
  };

  const { isSmallDevice } = useScreenSize();

  const handelFilterActions = (filterName, key, value, isChecked = false) => {
    const currentParams = new URLSearchParams(searchParams.toString());
    const url = new URL(window.location.href);

    switch (filterName) {
      case "price":
        if (!isChecked) {
          deleteQueryFormURL(key, updatedParams, currentParams, url);
        } else {
          updatedParams.price = value;
        }
        break;
      case "variant":
        if (value) {
          updatedParams.variant = value;
        } else {
          deleteQueryFormURL(key, updatedParams, currentParams, url);
          deleteQueryFormURL("direct", updatedParams, currentParams, url);
        }
        break;
      case "available":
        if (value) {
          updatedParams.available = value;
        } else {
          deleteQueryFormURL(key, updatedParams, currentParams, url);
        }
        break;
      case "brand":
        if (isChecked) {
          if (Object.values(value).length > 0) {
            let existingValue = url.searchParams.get([key]);
            updatedParams[key] = existingValue
              ? `${existingValue},${Object.values(value).join()}`
              : Object.values(value).join();
          } else {
            deleteQueryFormURL(key, updatedParams, currentParams, url);
          }
        } else {
          let existingValue = url.searchParams.get([key]);
          let valuesArray = existingValue ? existingValue.split(",") : [];
          let valueToRemove = Object.values(value)[0];
          valuesArray = valuesArray.filter((v) => v != valueToRemove);
          const updatedValue = valuesArray.join(",");
          if (updatedValue) {
            updatedParams[key] = updatedValue;
          } else {
            deleteQueryFormURL(key, updatedParams, currentParams, url);
          }
        }
        break;
      case "radioSwitch":
        if (isChecked) {
          updatedParams[key] = value;
        } else {
          deleteQueryFormURL(key, updatedParams, currentParams, url);
        }
        break;
      case "range":
        if (!isChecked) {
          deleteQueryFormURL(key, updatedParams, currentParams, url);

          const leftThumbId = `thumb--left ${removedParam}`;
          const rightThumbId = `thumb--right ${removedParam}`;

          const leftThumb = document.getElementById(leftThumbId);
          const rightThumb = document.getElementById(rightThumbId);

          if (leftThumb) {
            leftThumb.value = 0;
          }
          if (rightThumb) {
            rightThumb.value = 900;
          }

          // console.log("deleted");
          setremovedParam();
        } else {
          updatedParams[key] = value;
        }
        break;
      case "sort":
        if (isChecked) {
          updatedParams.sort = value;
        } else {
          deleteQueryFormURL(key, updatedParams, currentParams, url);
        }
        break;
      case "dropdown":
        if (isChecked) {
          if (Object.values(value).length > 0) {
            let existingValue = url.searchParams.get([key]);
            updatedParams[key] = existingValue
              ? `${existingValue},${Object.values(value).join()}`
              : Object.values(value).join();
          } else {
            deleteQueryFormURL(key, updatedParams, currentParams, url);
          }
        } else {
          let existingValue = url.searchParams.get([key]);
          let valuesArray = existingValue ? existingValue.split(",") : [];
          let valueToRemove = Object.values(value)[0];
          valuesArray = valuesArray.filter((v) => v != valueToRemove);
          const updatedValue = valuesArray.join(",");
          if (updatedValue) {
            updatedParams[key] = updatedValue;
          } else {
            deleteQueryFormURL(key, updatedParams, currentParams, url);
          }
        }
        break;
      default:
        return;
    }

    Object.entries(updatedParams).forEach(([paramKey, paramValue]) => {
      currentParams.set(paramKey, paramValue);
      url.searchParams.set(paramKey, paramValue);
    });

    window.history.pushState({}, "", url.toString());
    router.push(`?${currentParams.toString()}`, { scroll: false });
  };

  // (sliderValues);
  const deleteQueryFormURL = (key, updatedParams, currentParams, url) => {
    delete updatedParams[key];
    currentParams.delete([key]);
    url.searchParams.delete([key]);
    setremovedParam();
  };

  useEffect(() => {
    // console.log(removedParam);
    if (removedParam) {
      if (searchParam?.direct) {
        const filteredKeys = Object.keys(searchParam).filter(
          (key) => key !== "direct"
        );
        if (filteredKeys.includes("variant")) {
          document.getElementById("variant").checked = true;
        }
        // if (filteredKeys.includes("available")) {
        //   document.getElementById("available").checked = true;
        // }
        if (filteredKeys.includes("brand")) {
          const brandValues = searchParam["brand"].split(",");
          brandValues.map((item) => {
            document.getElementById(`${item}`).checked = true;
          });
        }
        if (filteredKeys.includes("price")) {
          setSliderPriceValues((pre) => {
            return {
              ...pre,
              maxVal: price?.max_price,
              minVal: price?.min_price,
            };
          });
        }
      }

      if (removedParam) {
        if (removedParam == "variant") {
          handelFilterActions("variant", "variant", false);
          document.getElementById("variant").checked = false;
        }
        //search param remove
        // if (removedParam == "available") {
        //   handelFilterActions("available", "available", false);
        //   document.getElementById("available").checked = false;
        // }
        if (removedParam == "brand") {
          const brandValues = searchParam["brand"]?.split(",");
          if (brandValues) {
            brandValues.map((item) => {
              handelFilterActions("brand", "brand", { brand: item }, false);
              item;
              document.getElementById(`${item}`).checked = false;
            });
          }
        }

        if (removedParam?.toLowerCase() == "price") {
          handelFilterActions(
            "price",
            "price",
            `${price?.min_price},${price?.max_price}`,
            false
          );
          setSliderPriceValues((pre) => {
            return {
              ...pre,
              maxVal: price?.max_price,
              minVal: price?.min_price,
            };
          });
        }
        if (removedParam == "sort") {
          handelFilterActions("sort", "sort", ``, false);
        }
        if (
          removedParam !== "available" &&
          removedParam != "brand" &&
          removedParam.toLowerCase() != "price" &&
          removedParam.toLowerCase() != "sort"
        ) {
          let arrayToGetFilteredObject = [];
          attributeCategories.map((item, index) => {
            let filteredArray = item.attributes.filter(
              (attribute) => attribute.name === removedParam
            );
            if (filteredArray.length > 0) {
              filteredArray && arrayToGetFilteredObject.push(filteredArray);
              return filteredArray;
            }
          });
          let filteredArrayOfAttributeValues;

          if (arrayToGetFilteredObject[0] && arrayToGetFilteredObject[0][0]) {
            filteredArrayOfAttributeValues = getFilteredAttributeValues(
              arrayToGetFilteredObject[0][0]
            );
          } else {
            filteredArrayOfAttributeValues = [];
          }
          // (arrayToGetFilteredObject, "checkNeet");

          let countAttribute = 1;
          if (filteredArrayOfAttributeValues?.type == "dropdown") {
            countAttribute++;
            // check if values contain only yes then Toggle Switch
            if (
              filteredArrayOfAttributeValues?.values?.length == 1 &&
              filteredArrayOfAttributeValues?.values[0] == guidePhraseData.yes
            ) {
              const value = filteredArrayOfAttributeValues?.values[0];
              handelFilterActions(
                "radioSwitch",
                removedParam,
                guidePhraseData.no,
                false
              );
              document.getElementById(`${removedParam}`).checked = false;
              // ("Radio switch", removedParam)
            } else {
              {
                filteredArrayOfAttributeValues?.values?.map(
                  (value, valIndex) => {
                    handelFilterActions(
                      "dropdown",
                      removedParam,
                      { key: value },
                      false
                    );

                    document.getElementById(
                      `${removedParam}${value}`
                    ).checked = false;
                  }
                );
              }
            }
          } else {
            // alert("else");
            let minn =
              filteredArrayOfAttributeValues.maxValue -
                filteredArrayOfAttributeValues.minValue >=
              1
                ? filteredArrayOfAttributeValues.minValue
                : 0;

            let maxx =
              filteredArrayOfAttributeValues.maxValue -
                filteredArrayOfAttributeValues.minValue >=
              1
                ? filteredArrayOfAttributeValues.maxValue
                : 100;

            const value = `${minn},${maxx}`;
            const newFilters = {
              [removedParam]: value,
            };

            handelFilterActions(
              "range",
              removedParam,
              { min: minn, max: maxx },
              false
            );
          }
        }

        if (removedParam.toLowerCase() == "sort") {
          delete searchParams.sort;
        }
      }
    }

    // I remove  searchParam   from dependency to stop infinite loop of useEffect
  }, [removedParam]);

  useEffect(() => {
    // (orderBy, "order");
    orderBy.ischecked == true
      ? handelFilterActions("sort", "sort", `${orderBy.value}`, true)
      : handelFilterActions("sort", "sort", `${orderBy.value}`, false);
  }, [orderBy]);

  const initialPriceRange = {
    min_price: price?.min_price,
    max_price: price?.max_price,
  };

  return (
    <div className="filter-container">
      <div className="filter-section">
        <div className="tech-features-price">
          {guidePhraseData && guidePhraseData?.price}
          {/* {(guidePhraseData?.price, "price")} */}

          {isSmallDevice
            ? price?.min_price != null && (
                <MultiRangeMobileSlider
                  rangeVal={sliderPriceValues}
                  min={price?.min_price}
                  max={price?.max_price}
                  unit={guidePhraseData?.currency}
                  onChange={({ min, max }) => {
                    handelFilterActions(
                      "price",
                      "price",
                      `${min},${max}`,
                      true
                    );
                  }}
                />
              )
            : price?.min_price != null && (
                <MultiRangeSlider
                  rangeVal={sliderPriceValues}
                  min={initialPriceRange?.min_price}
                  max={initialPriceRange?.max_price}
                  unit={guidePhraseData?.currency}
                  onChange={({ min, max }) => {
                    // (min,max)
                    handelFilterActions(
                      "price",
                      "price",
                      `${min},${max}`,
                      true
                    );
                  }}
                />
              )}
        </div>
      </div>
      <Accordion className="filter-accordion">
        <Accordion.Item eventKey="777777">
          <Accordion.Header as="div" className="accordion-header">
            {guidePhraseData && guidePhraseData?.brand_label}{" "}
            <i className="ri-arrow-down-s-fill"></i>
          </Accordion.Header>
          <Accordion.Body className="brand-list-section">
            {brands
              ?.sort((a, b) => a.brands?.brand.localeCompare(b.brands?.brand))
              .map((brand, brandIndex) => {
                return (
                  <div
                    key={brandIndex}
                    className="d-flex flex-row justify-content-between"
                  >
                    <div className="d-flex flex-row curser-pointer">
                      <Form.Check
                        required
                        label={
                          <span style={{ cursor: "pointer" }}>
                            {brand.brand}{" "}
                            {/* {brand?.brand == "-" || brand?.brand == "?"
                            ? ""
                            : brand?.brand} */}
                          </span>
                        }
                        key={brandIndex}
                        id={`${brand.brand}`}
                        onChange={(e) =>
                          handelFilterActions(
                            "brand",
                            "brand",
                            { brand: brand?.brand },
                            e.target.checked
                          )
                        }
                        // onChange={(e) =>
                        //   handelFilterActions(
                        //     "dropdown",
                        //     brand.brand,
                        //     { key: brand.brand },
                        //     e.target.checked
                        //   )
                        // }
                      />
                    </div>
                    <span
                      dangerouslySetInnerHTML={{
                        __html: `<p>(${brand?.count})</p>`,
                      }}
                    />
                  </div>
                  // (brand)
                  //   <Form.Check
                  //   required
                  //   label={
                  //     <span style={{ cursor: "pointer" }}>
                  //       {value.toString()}{" "}
                  //       {filteredArrayOfAttributeValues?.unit ==
                  //         "-" ||
                  //       filteredArrayOfAttributeValues?.unit ==
                  //         "?"
                  //         ? ""
                  //         : filteredArrayOfAttributeValues?.unit}
                  //     </span>
                  //   }
                  //   key={valIndex}
                  //   id={`${attribute.name}${value}`}
                  //   onChange={(e) =>
                  //     handelFilterActions(
                  //       "dropdown",
                  //       attribute.name,
                  //       { key: value },
                  //       e.target.checked
                  //     )
                  //   }
                  // />
                  //   <Form.Check
                  //     required
                  //     label={
                  //       <span>
                  //         {brand?.brand}

                  //         {brand?.count == "-" || brand?.count == "?"
                  //           ? ""
                  //           : brand?.count}
                  //       </span>
                  //     }
                  //     key={brandIndex}
                  //     id={brand}
                  //     onChange={(e) =>
                  //       handelFilterActions(
                  //         "brand",
                  //         "brand",
                  //         { brand: brand },
                  //         e.target.checked
                  //       )
                  //     }
                  //   />
                  //   <span
                  //   dangerouslySetInnerHTML={{
                  //     __html: `<p>(${
                  //       filteredArrayOfAttributeValues.values &&
                  //       filteredArrayOfAttributeValues.product_count &&
                  //       filteredArrayOfAttributeValues
                  //         .product_count[valIndex] !==
                  //         undefined
                  //         ? filteredArrayOfAttributeValues
                  //             .product_count[valIndex]
                  //         : "0"
                  //     })</p>`,
                  //   }}
                  // />
                );
              })}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      {/* Dynaimc Value Accordians */}
      {attributeCategories?.map((category, index) => {
        let countAttribute = 1;
        // (category)
        return (
          <div className="filter-section" key={index}>
            <div className="tech-features">{category.name}</div>
            <Accordion className="filter-accordion">
              {/* {(category?.attributes, "checking attributes")} */}
              {category?.attributes
                ?.sort((a, b) => a.position - b.position)
                ?.map((attribute, attrIndex) => {
                  if (
                    countAttribute <=
                    (pagination[category.name] || initialNoOfCategories)
                  ) {
                    let filteredArrayOfAttributeValues =
                      getFilteredAttributeValues(attribute);

                    const filterDropdownAttributeValues =
                      getDropdownFilter(attribute);

                    console.log(filterDropdownAttributeValues, "neexty");

                    if (filteredArrayOfAttributeValues?.type == "dropdown") {
                      countAttribute++;
                      // check if values contain only yes then Toggle Switch
                      if (
                        filteredArrayOfAttributeValues.values.length == 1 &&
                        filteredArrayOfAttributeValues.values[0] ==
                          guidePhraseData.yes
                      ) {
                        const value = filteredArrayOfAttributeValues.values[0];
                        // (value);
                        const groupName = `${category.name}-${attribute.name}`;
                        return (
                          <Accordion.Item eventKey={attrIndex} key={attrIndex}>
                            <Accordion.Header
                              as="div"
                              className="accordion-header"
                            >
                              {attribute.name}
                              <Form.Check
                                required
                                className="custom-switch"
                                type="switch"
                                id={`${attribute.name}`}
                                onChange={(e) =>
                                  handelFilterActions(
                                    "radioSwitch",
                                    attribute.name,
                                    value,
                                    e.target.checked
                                  )
                                }
                              />
                            </Accordion.Header>
                          </Accordion.Item>
                        );
                      }
                      // if not toggle show dropdown
                      else {
                        return (
                          <Accordion.Item eventKey={attrIndex} key={attrIndex}>
                            <Accordion.Header
                              as="div"
                              className="accordion-header"
                            >
                              {attribute.name}{" "}
                              <i className="ri-arrow-down-s-fill"></i>
                            </Accordion.Header>
                            <Accordion.Body>
                              {filterDropdownAttributeValues?.values
                                ?.slice()
                                .sort((a, b) =>
                                  a[0]
                                    ?.toString()
                                    .localeCompare(b[0]?.toString())
                                )
                                ?.map((value, valIndex) => {
                                  const groupName = `${category.attribute}-${attribute.values[0]}`;
                                  return (
                                    // console.log(value)
                                    <div
                                      key={valIndex}
                                      className="d-flex flex-row justify-content-between"
                                    >
                                      <div className="d-flex flex-row curser-pointer">
                                        <Form.Check
                                          required
                                          label={
                                            <span style={{ cursor: "pointer" }}>
                                              {value?.name.toString()}{" "}
                                              {filteredArrayOfAttributeValues?.unit ==
                                                "-" ||
                                              filteredArrayOfAttributeValues?.unit ==
                                                "?"
                                                ? ""
                                                : filteredArrayOfAttributeValues?.unit}
                                            </span>
                                          }
                                          key={valIndex}
                                          id={`${attribute.name}${value?.name}`}
                                          onChange={(e) =>
                                            handelFilterActions(
                                              "dropdown",
                                              attribute.name,
                                              { key: value?.name },
                                              e.target.checked
                                            )
                                          }
                                        />
                                      </div>
                                      <span
                                        dangerouslySetInnerHTML={{
                                          __html: `<p>(${
                                            filteredArrayOfAttributeValues.values &&
                                            filteredArrayOfAttributeValues.product_count &&
                                            filteredArrayOfAttributeValues
                                              .product_count[valIndex] !==
                                              undefined
                                              ? value?.product_count
                                              : "0"
                                          })</p>`,
                                        }}
                                      />
                                    </div>
                                  );
                                })}
                            </Accordion.Body>
                          </Accordion.Item>
                        );
                      }
                    } else if (
                      filteredArrayOfAttributeValues?.type === "range"
                    ) {
                      countAttribute++;
                      return (
                        <Accordion.Item eventKey={attrIndex} key={attrIndex}>
                          <Accordion.Header
                            as="div"
                            className="accordion-header"
                          >
                            {attribute.name}{" "}
                            <i className="ri-arrow-down-s-fill"></i>
                          </Accordion.Header>
                          <Accordion.Body>
                            {/* {(filteredArrayOfAttributeValues,"neext")} */}
                            {isSmallDevice ? (
                              <MultiRangeMobileSlider
                                // value={filters[filter.id] ? filters[filter.id].min : filter.min}
                                rangeVal={sliderValues[attribute.name]}
                                classForSlider={attribute.name}
                                min={
                                  filteredArrayOfAttributeValues.maxValue -
                                    filteredArrayOfAttributeValues.minValue >=
                                  1
                                    ? filteredArrayOfAttributeValues.minValue
                                    : 0
                                }
                                max={
                                  filteredArrayOfAttributeValues.maxValue -
                                    filteredArrayOfAttributeValues.minValue >=
                                  1
                                    ? filteredArrayOfAttributeValues.maxValue
                                    : 100
                                }
                                unit={filteredArrayOfAttributeValues.unit}
                                onChange={({ min, max }) => {
                                  handelFilterActions(
                                    "range",
                                    attribute.name,
                                    `${min},${max}`,
                                    true
                                  );
                                }}
                              />
                            ) : (
                              <>
                                {/* {(sliderValues[attribute.name].min)} */}
                                <MultiRangeSliderAttributes
                                  rangeVal={
                                    sliderValues[attribute.name]
                                      ? filteredArrayOfAttributeValues.maxValue -
                                          filteredArrayOfAttributeValues.minValue >=
                                        1
                                        ? filteredArrayOfAttributeValues.minValue
                                        : 0
                                      : filteredArrayOfAttributeValues.maxValue -
                                          filteredArrayOfAttributeValues.minValue >=
                                        1
                                      ? filteredArrayOfAttributeValues.maxValue
                                      : 100
                                  }
                                  classForSlider={attribute.name}
                                  min={
                                    filteredArrayOfAttributeValues.maxValue -
                                      filteredArrayOfAttributeValues.minValue >=
                                    1
                                      ? filteredArrayOfAttributeValues.minValue
                                      : 0
                                  }
                                  max={
                                    filteredArrayOfAttributeValues.maxValue -
                                      filteredArrayOfAttributeValues.minValue >=
                                    1
                                      ? filteredArrayOfAttributeValues.maxValue
                                      : 100
                                  }
                                  unit={filteredArrayOfAttributeValues.unit}
                                  onChange={({ min, max }) => {
                                    handelFilterActions(
                                      "range",
                                      attribute.name,
                                      `${min},${max}`,
                                      true
                                    );
                                  }}
                                />
                              </>
                            )}
                          </Accordion.Body>
                        </Accordion.Item>
                      );
                    }
                  }
                })}
            </Accordion>
            {countAttribute >
              (pagination[category.name] || initialNoOfCategories) && (
              <span
                className="show_more"
                onClick={() => handlePagination(category.name)}
              >
                {guidePhraseData && guidePhraseData?.show_all}
                <i className="ri-add-line"></i>
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
