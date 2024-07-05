"use client";
import React, { useEffect, useState, useRef } from "react";
import useChart, { searchForPatternAndReplace } from "@/hooks/useChart";
import Image from "next/image";
import { Button, Col, Container, Row, Table, Form } from "react-bootstrap";
import Link from "next/link";
import BreadCrumb from "@/components/Common/BreadCrumb/breadcrum";
import Filter from "@/components/Common/Filter/Filter";
import ProductListing from "@/components/Common/ProductListing/ProductListing";
import ProductSlider from "@/components/Common/ProductSlider/productSlider";
import ProductSkeleton from "@/components/Common/ProductListing/ProductSkeleton";
import CompareTable from "@/components/Common/CompareTable/CompareTable";
import BottomBar from "@/components/Common/BottomBar/BottomBar";
import { isAreObjectsEqual } from "@/_helpers";
import GuidePagination from "@/components/Common/Pagination/GuidePagination";
import { useRouter } from "next/navigation";
import GuidePageTextArea from "@/components/Common/GuidePageOutline/GuidePageTextArea";

import useScreenSize from "@/_helpers/useScreenSize";
import dynamic from "next/dynamic";
const MobileCompareGuideTable = dynamic(
  () =>
    import("@/components/Common/MobileCompareTable/MobileCompareGuideTable"),
  {
    loading: () => <p>Loading...</p>, // You can customize this loading component
    ssr: false, // This makes sure the component is only loaded on the client-side
  }
);

export default function GuidePage({
  slug,
  categorySlug,
  guideData,
  attributesForTable,
  productForTable,
  filters,
  searchParams,
  category_id,
}) {
  const router = useRouter();
  const currentParams = new URLSearchParams(searchParams.toString());
  const [isShown, setIsShown] = useState(false);
  const [currentHeading, setCurrentHeading] = useState("");

  const guide = guideData[0]?.data;

  const products = guideData[1]?.data?.products || [];
  const sidebarRef = useRef(null);

  //I introduce this new value to map the actial postion of product in guide order_values in backend.
  const productPosition = guideData[1]?.data?.product_names || [];
  const productPagination = guideData[1]?.data?.pagination;
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [prevSearcParam, setPrevSearcParam] = useState({});
  const [removedParam, setremovedParam] = useState();

  const [order, setorder] = useState({
    value: "",
    ischecked: false,
  });
  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };
  const sortRangeAttributeArray = useRef([
    { algo: "", rangeAttributes: "Overall" },
  ]);
  const [manageCollapsedDiv, setManageCollapsedDiv] = useState(false);
  const [params, setparams] = useState(searchParams);
  const handleManageCollapsedDiv = () => {
    setManageCollapsedDiv(true);
  };
  const handelSetFilterActive = (status) => {
    setIsFilterActive(status);
    // (status,"check status")a
  };
  useEffect(() => {
    setPrevSearcParam(searchParams);
  }, []);
  // (searchParams)

  useEffect(() => {
    if (Object.keys(searchParams).length > 0) {
      // Show loader when filter is applied
      handelSetFilterActive(true);

      setTimeout(() => {
        handelSetFilterActive(false);
      }, 1000);
    } else {
      // Show loader when filter is removed
      // handelSetFilterActive(true);

      setTimeout(() => {
        handelSetFilterActive(false);
      }, 1000);
    }
  }, [searchParams]);
  // console.log(removedParam)

  // This function removeQueryParamAndNavigate is used to remove a query parameter from the URL
  function removeQueryParamAndNavigate(url, paramToRemove) {
    // delete searchParams[`${paramToRemove}`];

    console.log(url, paramToRemove);

    if (paramToRemove != "sort") {
      setparams(() => {
        return {
          ...searchParams,
        };
      });
    } else {
      delete params.sort;
      let removeSortParam = params;

      setparams(() => {
        return {
          ...removeSortParam,
        };
      });
    }
    handelSetFilterActive(true);

    setTimeout(() => {
      handelSetFilterActive(false);
    }, 1000);
    const urlObject = new URL(url);
    urlObject.searchParams.delete(paramToRemove);
    const newUrl = urlObject.toString();
    // Update the URL in the address bar without triggering a page reload
    window.history.pushState({ path: newUrl }, "", newUrl);
    router.replace(newUrl, { scroll: false });
    // You can also use window.location.href = newUrl; if you want to trigger a page reload
    // Optionally, you can perform additional actions
    // location.reload();
    handelSetFilterActive(true);

    setTimeout(() => {
      handelSetFilterActive(false);
    }, 1000);
    return newUrl;
  }

  useEffect(() => {
    setparams(() => {
      return {
        ...searchParams,
      };
    });
  }, [searchParams]);
  const handleSort = (sortAttribute) => {
    // (sortAttribute, "neet");
    let param = JSON.parse(sortAttribute);

    // (param.rangeAttributes);
    if (param.algo) {
      const currentUrl = new URL(window.location.href);
      // (currentUrl);
      const searchParam = new URLSearchParams(currentUrl.search);
      const sortValue = `${param.algo},${param.rangeAttributes}`;
      // (sortValue);
      setorder((prev) => {
        return {
          value: sortValue,
          ischecked: true,
        };
      });
    } else {
      removeQueryParamAndNavigate(window.location.href, "sort");
      delete searchParams.sort;
    }
  };

  // (products, "hello");
  // Testing purpose
  const [isChecked, setIsChecked] = useState(
    products?.length < 12 ? false : true
  );

  // Handle case-insensitive variant query parameter

  const [hideSmiliar, setHideSmiliar] = useState(true);

  let updatedParams = {};

  const handelFilterActions = (filterName, key, value, isChecked = false) => {
    const currentParams = new URLSearchParams(searchParams.toString());
    // (value);
    const url = new URL(window.location.href);
    switch (filterName) {
      case "variant":
        if (!value) {
          updatedParams.variant = value;
        } else {
          deleteQueryFormURL(key, updatedParams, currentParams, url);
          deleteQueryFormURL("direct", updatedParams, currentParams, url);

          // setHideSmiliar(false);
        }
        break;
      case "available":
        if (!value) {
          updatedParams.available = value;
        } else {
          deleteQueryFormURL(key, updatedParams, currentParams, url);
        }
        break;
      default:
        return;
    }

    Object.entries(updatedParams).forEach(([paramKey, paramValue]) => {
      currentParams.set(paramKey, paramValue);
      url.searchParams.set(paramKey, paramValue);
    });
    // Update the URL without triggering a page reload (hack)
    window.history.pushState({}, "", url.toString());
    //call the next router for srr
    // (url.searchParams.toString());
    router.push(`?${url.searchParams.toString()}`, { scroll: false });
  };

  const deleteQueryFormURL = (key, updatedParams, currentParams, url) => {
    delete updatedParams[key];
    currentParams.delete([key]);
    url.searchParams.delete([key]);
  };
  // const handleChange = (e) => {
  //   const checked = e.target.checked;
  //   setIsChecked(checked);
  //   handelFilterActions("available", "available", checked);
  // };
  const handleHideSmiliar = (e) => {
    const checked = e.target.checked;
    setHideSmiliar(checked);
    handelFilterActions("variant", "variant", checked);
  };
  // (order)

  // (products,"neet");
  const swapPriceWebsites = (data) => {
    // Similar logic to sort elements based on price_websites
    const splitData = order?.value.split(",");
    const currentParams = new URLSearchParams(searchParams.toString());
    // (order.value);

    // (splitData[0]);
    if (splitData[0] === "available") {
      const sortedData = data.sort((a, b) => b.overall_score - a.overall_score);
      return [...sortedData];
    } else {
      const withWebsites = data.filter((item) => item.price_websites?.length);
      const withoutWebsites = data.filter(
        (item) => !item.price_websites?.length
      );
      return [...withWebsites, ...withoutWebsites];
    }
  };
  const sortedData = swapPriceWebsites(products);

  // (sortedData);

  // toggle mobile filter
  const openClick = (event) => {
    setIsShown(true);
    document.body.classList.add("filter--sidebar--open");
  };
  const closeClick = (event) => {
    setIsShown(false);
    document.body.classList.remove("filter--sidebar--open");
  };

  // this code for when click outside of sidebar then close sidebar

  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
  //       setIsShown(false);
  //       document.body.classList.remove("filter--sidebar--open");
  //     }
  //   };

  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, []);

  const { isMobile, isSmallDevice } = useScreenSize();

  return (
    <>
     
    
    </>
  );
}
