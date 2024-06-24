"use client";
/* eslint-disable react/display-name */
import React, { useState, useRef, useEffect, useCallback } from "react";
import { Accordion, Form } from "react-bootstrap";
import { getFilteredAttributeValues } from "../../../_helpers";
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
    setremovedParam();
    currentParams.delete([key]);
    url.searchParams.delete([key]);
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
            // alert(min)

            // setSliderValues((prevVal) => {
            //   return {
            //     ...prevVal,
            //     minVal: min,
            //     maxVal: max,
            //   };
            // });

            // setSliderValues((prevValues) => ({
            //   ...prevValues,
            //   [removedParam]: { minVal: min, maxVal: max },
            // }));
            // const newRangerfilter = {
            //   ...sliderValues,
            //   [removedParam]: { minVal: min, maxVal: max },
            // };
            // setSliderValues(newRangerfilter);
            const value = `${minn},${maxx}`;
            const newFilters = {
              [removedParam]: value,
            };
            // setSliderValues(newFilters);
            // setSliderValues(newFilters);

            // thumb thumb--left ${classForSlider}
            // (sliderValues);
            // const { [removedParam]: omit, ...OldFilters } = sliderValues;
            // (OldFilters, "OldFilters");
            // setSliderValues(OldFilters);
            // (sliderValues, min, max, removedParam);

            handelFilterActions(
              "range",
              removedParam,
              { min: minn, max: maxx },
              false
            );
            // alert(removedParam);
            // (sliderValues);
            // (minn, maxx, removedParam);
            const leftThumb = document.getElementById(
              `thumb thumb--left ${removedParam}`
            );
            const rightThumb = document.getElementById(
              `thumb thumb--right ${removedParam}`
            );
            // alert("hello");
            // leftThumb.value = min;

            if (leftThumb) {
              leftThumb.value = 0;
              // (leftThumb,"neetx");
              // // If you want the slider's position to update immediately,
              // // you may need to trigger a change event manually
              leftThumb.dispatchEvent(new Event("change", { bubbles: true }));
            }
            if (rightThumb) {
              rightThumb.value = 900;
              // (rightThumb,"neetx");
              // // If you want the slider's position to update immediately,
              // // you may need to trigger a change event manually
              rightThumb.dispatchEvent(new Event("change", { bubbles: true }));
            }

            // if (rightThumb) {
            //   rightThumb.value = max;
            // }
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
        {/* <Accordion.Item eventKey="888880">
          <Accordion.Header as="div" className="accordion-header">
            {" "}
            Show all variants
            <Form.Check
              required
              className="custom-switch"
              type="switch"
              id={`variant`}
              onChange={(e) =>
                handelFilterActions("variant", "variant", e.target.checked)
              }
            />
          </Accordion.Header>
        </Accordion.Item>
        <Accordion.Item eventKey="888888">
          <Accordion.Header as="div" className="accordion-header">
            {" "}
            Available
            <Form.Check
              required
              className="custom-switch"
              type="switch"
              id={`available`}
              onChange={(e) =>
                handelFilterActions("available", "available", e.target.checked)
              }
            />
          </Accordion.Header>
        </Accordion.Item> */}
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
                    // (filteredArrayOfAttributeValues, "Checking");
                    // const uniqueValuesSet = new Set(filteredArrayOfAttributeValues?.values);
                    // const uniqueValues = Array.from(uniqueValuesSet);
                    // (uniqueValues,"uniqueValues")

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
                              {filteredArrayOfAttributeValues?.values
                                ?.slice()
                                .sort((a, b) =>
                                  a[0]
                                    ?.toString()
                                    .localeCompare(b[0]?.toString())
                                )
                                ?.map((value, valIndex) => {
                                  const groupName = `${category.attribute}-${attribute.values[0]}`;
                                  const uniqueValues = Array.isArray(value)
                                    ? [...new Set(value.flat())]
                                    : [value];
                                  // (value, "next");

                                  return (
                                    <div
                                      key={valIndex}
                                      className="d-flex flex-row justify-content-between"
                                    >
                                      <div className="d-flex flex-row curser-pointer">
                                        <Form.Check
                                          required
                                          label={
                                            <span style={{ cursor: "pointer" }}>
                                              {value.toString()}{" "}
                                              {filteredArrayOfAttributeValues?.unit ==
                                                "-" ||
                                              filteredArrayOfAttributeValues?.unit ==
                                                "?"
                                                ? ""
                                                : filteredArrayOfAttributeValues?.unit}
                                            </span>
                                          }
                                          key={valIndex}
                                          id={`${attribute.name}${value}`}
                                          onChange={(e) =>
                                            handelFilterActions(
                                              "dropdown",
                                              attribute.name,
                                              { key: value },
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
                                              ? filteredArrayOfAttributeValues
                                                  .product_count[valIndex]
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
                                rangeVal={sliderValues}
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
