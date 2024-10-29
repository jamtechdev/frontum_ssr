"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import SearchList from "../../Search/SearchList";
import { useRouter, usePathname } from "next/navigation";
import {
  addCompareProduct,
  deleteCompareProduct,
} from "@/redux/features/compareProduct/compareProSlice";
import CompareSearchList from "@/components/Search/CompareSearchList";          
import { useSelector, useDispatch } from "react-redux";
import { RotatingLines } from "react-loader-spinner";
export default function CompareForm({
  location,
  comparisonData,
  favSlider,
  product_name,
  handelCategoryForOffenProduct,
  handelCloseCompareModel,
  
}) {
  const router = useRouter();
  const dispatch = useDispatch();
  const reduxData = useSelector((state) => state.comparePro.compareProduct)[0];

  //  (favSlider,"checking favslider");
  const ProductPage = {
    category_id: product_name?.category_id,
    permalink: product_name?.permalink,
    name: product_name?.name,
    brand: product_name?.brand,
    overall_score: product_name?.overall_score,
    technical_score: product_name?.technical_score,
    main_image: product_name?.main_image,
    category_url: product_name?.category_url,
  };

  const compareProductFirst = {
    category_id: comparisonData?.[0]?.category_id,
    permalink: comparisonData?.[0]?.permalink,
    name: comparisonData?.[0]?.name,
    brand: comparisonData?.[0]?.brand,
    overall_score: comparisonData?.[0]?.overall_score,
    technical_score: comparisonData?.[0]?.technical_score,
    main_image: comparisonData?.[0]?.main_image,
    category_url: comparisonData?.[0]?.category_url,
  };
  const compareProductSecond = {
    category_id: comparisonData?.[1]?.category_id,
    permalink: comparisonData?.[1]?.permalink,
    name: comparisonData?.[1]?.name,
    brand: comparisonData?.[1]?.brand,
    overall_score: comparisonData?.[1]?.overall_score,
    technical_score: comparisonData?.[1]?.technical_score,
    main_image: comparisonData?.[1]?.main_image,
    category_url: comparisonData?.[1]?.category_url,
  };
  const compareProductThird = {
    category_id: comparisonData?.[2]?.category_id,
    permalink: comparisonData?.[2]?.permalink,
    name: comparisonData?.[2]?.name,
    brand: comparisonData?.[2]?.brand,
    overall_score: comparisonData?.[2]?.overall_score,
    technical_score: comparisonData?.[2]?.technical_score,
    main_image: comparisonData?.[2]?.main_image,
    category_url: comparisonData?.[2]?.category_url,
  };

  const [formFields, setFormFields] = useState({
    productFirst:
      product_name !== undefined
        ? reduxData?.productFirst || ProductPage || null
        : reduxData?.productFirst ||
          (compareProductFirst?.category_id !== undefined
            ? compareProductFirst
            : null),
    productSecond:
      comparisonData !== undefined
        ? reduxData?.productSecond || compareProductSecond || null
        : reduxData?.productSecond || null,

    productThird:
      compareProductThird?.category_id !== undefined
        ? reduxData?.productThird || compareProductThird || null
        : reduxData?.productThird || null,
    category:
      reduxData?.category ||
      comparisonData?.[0]?.category_id ||
      product_name?.category_id ||
      null,
    location: reduxData?.location ? reduxData?.location : location,
  });

  const [isFocusedProductFirst, setFocusedProductFirst] = useState(false);
  const [isFocusedProductSecond, setFocusedProductSecond] = useState(false);
  const [isFocusedProductThird, setFocusedProductThird] = useState(false);
  const [isHandelChildValue, setIsHandelChildValue] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleFieldChange = (fieldName, value) => {
    // Update the state based on the field being changed
    setFormFields((prevFields) => ({
      ...prevFields,
      [fieldName]: value,
    }));
  };
  const handleChildValue = (inputPostion, data) => {
    setFocusedProductFirst(false);
    setFocusedProductSecond(false);
    setFocusedProductThird(false);
    setFormFields((prevFields) => ({
      ...prevFields,
      [inputPostion]: data,
    }));
    setIsHandelChildValue(true);
  };
  const handelComparison = () => {
    const isValidObject = (fieldValue) =>
      typeof fieldValue === "object" && Object?.keys(fieldValue).length > 0;
    const isProductFieldsValid =
      isValidObject(formFields.productFirst) &&
      isValidObject(formFields.productSecond);
    if (isProductFieldsValid) {
      setIsLoading(true);
      const permalinksArray = [
        formFields.productFirst,
        formFields.productSecond,
        formFields.productThird,
      ].filter((product) => product && product.permalink !== "");

      const categoryInURL = formFields?.productFirst?.category_url;
      const sortedPermalinksArray = [...permalinksArray].sort((a, b) => {
        if (a.permalink && b.permalink) {
          return a.permalink.localeCompare(b.permalink);
        }
        return 0;
      });
      // (sortedPermalinksArray);
      const permalinks = sortedPermalinksArray.map((item) => item.permalink);
      const permalinkSlug = permalinks.join("-vs-");
      dispatch(addCompareProduct(formFields));
      setTimeout(() => {
        handelCloseCompareModel();
      }, 2500);
      window.location.href = `/${categoryInURL}/${permalinkSlug}`;
      // router.push(`/${categoryInURL}/${permalinkSlug}`, undefined, {
      //   scroll: false,
      // });
    }
  };
  const handelCategoryUpdate = (id) => {
    setFormFields((prevFields) => ({
      ...prevFields,
      ["category"]: id,
    }));

    if (location === "ON_MODEL") {
      handelCategoryForOffenProduct(id);
    }
  };
  const handleBlur = () => {
    setIsHandelChildValue(false);
    setTimeout(() => {
      setFocusedProductFirst(false);
      setFocusedProductSecond(false);
      setFocusedProductThird(false);
    }, 200);
  };
  // (formFields);
  useEffect(() => {
    if (product_name) {
      dispatch(addCompareProduct(formFields));
    }
  }, []);
  useEffect(() => {
    if (comparisonData) {
      dispatch(addCompareProduct(formFields));
    }
  }, []);
  useEffect(() => {
    if (isHandelChildValue) {
      dispatch(addCompareProduct(formFields));
    }
  }, [isHandelChildValue]);
  useEffect(() => {
    setFormFields((prevFields) => ({
      ...prevFields,
      ...reduxData,
    }));
  }, [reduxData]);
  // remove select product from searhList
  const removeSelectedProduct = (product, fieldName) => {
    dispatch(deleteCompareProduct({ key: product }));
    // (product, fieldName);
  };
  return (
    <>
      <div className="compare-section">
        <div className="compare-section-img">
          <div className="up-direction-section"></div>
          <Image src="/images/vs.svg" width={35} height={35} alt="VS" />
          <div className="middle-direction-section"></div>
          <Image src="/images/vs.svg" width={35} height={35} alt="VS" />
          <div className="down-direction-section"></div>
        </div>
        <div className="compare-section-form">
          <div className="position-relative w-100">
            <div className="position-relative">
              <Form.Control
                type="text"
                 placeholder={`${favSlider && favSlider?.product_first_text}`}
                // placeholder="mahima"
                onBlur={handleBlur}
                value={
                  typeof formFields.productFirst === "string"
                    ? formFields.productFirst
                    : formFields.productFirst?.name || ""
                }
                onFocus={() => setFocusedProductFirst(true)}
                onChange={(e) =>
                  handleFieldChange("productFirst", e.target.value)
                }
              />

              {formFields.productFirst?.category_id !== undefined && (
                <i
                  className="ri-close-fill input__close__icon"
                  style={{ cursor: "pointer" }}
                  onClick={(e) =>
                    removeSelectedProduct(
                      "productFirst",
                      formFields.productFirst
                    )
                  }
                ></i>
              )}
              {/*  */}
            </div>
            {/* {(formFields.productFirst && formFields.productFirst)} */}
            {formFields.productFirst && (
              <CompareSearchList
                isFocused={isFocusedProductFirst}
                setIsFocused={isFocusedProductFirst}
                onSendValue={handleChildValue}
                searchedKeyWord={formFields.productFirst}
                inputPostion={"productFirst"}
                handelCategoryUpdate={handelCategoryUpdate}
                page_phase={favSlider}
              />
            )}
          </div>
          <div className="position-relative w-100">
            <div className="position-relative">
              <Form.Control
                type="text"
                placeholder={`${favSlider && favSlider?.product_second_text}`}
                onBlur={handleBlur}
                value={
                  typeof formFields.productSecond === "string"
                    ? formFields.productSecond
                    : formFields.productSecond?.name || ""
                }
                onFocus={() => setFocusedProductSecond(true)}
                onChange={(e) =>
                  handleFieldChange("productSecond", e.target.value)
                }
                disabled={formFields.productFirst ? false : true}
              />
              {formFields.productSecond?.category_id !== undefined && (
                <i
                  className="ri-close-fill input__close__icon"
                  style={{ cursor: "pointer" }}
                  onClick={(e) =>
                    removeSelectedProduct(
                      "productSecond",
                      formFields.productSecond
                    )
                  }
                ></i>
              )}
            </div>
            {formFields.productSecond && isFocusedProductSecond && (
              <CompareSearchList
                isFocused={isFocusedProductSecond}
                setIsFocused={isFocusedProductSecond}
                onSendValue={handleChildValue}
                searchedKeyWord={formFields.productSecond}
                inputPostion={"productSecond"}
                category_id={formFields.category || product_name?.category_id}
                page_phase={favSlider}
              />
            )}
          </div>
          <div className="position-relative">
            <div className="position-relative">
              <Form.Control
                type="text"
                placeholder={`${favSlider && favSlider?.product_third_text}`}
                onFocus={() => setFocusedProductThird(true)}
                onBlur={handleBlur}
                value={
                  typeof formFields.productThird === "string"
                    ? formFields.productThird
                    : formFields.productThird?.name || ""
                }
                onChange={(e) =>
                  handleFieldChange("productThird", e.target.value)
                }
                disabled={formFields.productSecond ? false : true}
              />
            </div>
            {formFields.productThird?.category_id !== undefined && (
              <i
                className="ri-close-fill input__close__icon"
                style={{ cursor: "pointer" }}
                onClick={(e) =>
                  removeSelectedProduct("productThird", formFields.productThird)
                }
              ></i>
            )}
            {formFields.productThird && isFocusedProductThird && (
              <CompareSearchList
                isFocused={isFocusedProductThird}
                setIsFocused={isFocusedProductThird}
                onSendValue={handleChildValue}
                searchedKeyWord={formFields.productThird}
                inputPostion={"productThird"}
                category_id={formFields.category}
                page_phase={favSlider}
              />
            )}
          </div>
          <Button
            disabled={isLoading}
            onClick={handelComparison}
            className="site_main_btn d-flex justify-content-center align-items-center gap-2"
          >
            {isLoading && (
              <>
                <RotatingLines
                  visible={true}
                  height="20"
                  width="20"
                  strokeColor="#fff"
                  strokeWidth="5"
                  animationDuration="0.75"
                  ariaLabel="rotating-lines-loading"
                  wrapperStyle={{}}
                  wrapperClass=""
                />
              </>
            )}
            {favSlider && favSlider?.compare_button}
          </Button>
        </div>
      </div>
    </>
  );
}
