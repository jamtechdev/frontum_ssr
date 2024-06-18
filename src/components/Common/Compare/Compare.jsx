"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import SearchList from "../../Search/SearchList";
import { useRouter, usePathname } from "next/navigation";
import { useDispatch } from "react-redux";
import { addCompareProduct } from "@/redux/features/compareProduct/compareProSlice";
import CompareSearchList from "@/components/Search/CompareSearchList";
export default function Compare({
  searchValue1,
  searchValue2,
  searchValue3,
  setIsOpen,
  modelOpen,
}) {
  const dispatch = useDispatch();
  const [product1Filled, setProduct1Filled] = useState(false);
  const [product2Filled, setProduct2Filled] = useState(false);
  const [search, setSearch] = useState("");
  const [search2, setSearch2] = useState("");
  const [search3, setSearch3] = useState("");
  const [catId, setCatId] = useState("");
  const [catId3, setCatId3] = useState("");
  const [isFocused1, setIsFocused1] = useState(false);
  const [isFocused2, setIsFocused2] = useState(false);
  const [isFocused3, setIsFocused3] = useState(false);
  const [receivedValue, setReceivedValue] = useState("");
  const [receivedValue2, setReceivedValue2] = useState("");
  const [receivedValue3, setReceivedValue3] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  //get the first slug form url to pass it as category in comparison url
  const match = pathname.match(/\/([^\/]*)\//);
  const categoryInURL = match ? match[1] :"";
  useEffect(() => {
    if (searchValue1 != "") {
      setSearch(searchValue1?.name);
      setReceivedValue(searchValue1);
    }
  }, [searchValue1]);
  useEffect(() => {
    if (searchValue2 != "") {
      setSearch2(searchValue2?.name);
      setReceivedValue2(searchValue2);
    }
  }, [searchValue2]);

  useEffect(() => {
    if (searchValue3 != "") {
      setSearch3(searchValue3?.name);
      setReceivedValue3(searchValue3);
    }
  }, [searchValue3]);
  // Your function to construct and push the route
  const handleComparison = (e) => {
    const routeParts = [
      receivedValue?.permalink,
      receivedValue2?.permalink,
      receivedValue3?.permalink,
    ];
    // Filter out undefined or null values
    const validRouteParts = routeParts.filter((part) => part);
    // Construct the route
    if (validRouteParts.length >= 1) {
      const sortedRouteParts = validRouteParts.slice().sort(); // Create a sorted copy of the array
      router.push(
        `/${
          receivedValue?.category_url
            ? receivedValue?.category_url
            : categoryInURL
        }/${sortedRouteParts[0]}`
      );
      if (validRouteParts.length >= 2) {
        router.push(
          `/${
            receivedValue2?.category_url
              ? receivedValue2?.category_url
              : categoryInURL
          }/${sortedRouteParts[0]}-vs-${sortedRouteParts[1]}`
        );
      }
      if (validRouteParts.length >= 3) {
        router.push(
          `/${
            receivedValue3?.category_url
              ? receivedValue3?.category_url
              : categoryInURL
          }/${sortedRouteParts[0]}-vs-${sortedRouteParts[1]}-vs-${
            sortedRouteParts[2]
          }`
        );
      }
    }
    if (modelOpen == true) {
      setIsOpen(false);
    }
  };
  // Function to receive value from child component
  const handleChildValue2 = (value) => {
    value["position"] = "second";

    setReceivedValue2(value);
    setSearch2(value.name);
    dispatch(addCompareProduct(value));
  };

  /**
 * Updates the state with the provided value, sets the search3 state with the name of the value,
 * and dispatches an action to add the value to the compare product list.
 *
 * @param {Object} value - The value to be updated in the state.
 * @return {void} This function does not return anything.
 */
  const handleChildValue3 = (value) => {
    value["position"] = "third";
    setReceivedValue3(value);
    setSearch3(value.name);
    dispatch(addCompareProduct(value));
  };
  // Function to receive value from child component
  const handleChildValue = (value) => {
    value["position"] = "first";

    dispatch(addCompareProduct(value));
    setReceivedValue(value);
    setSearch(value.name);
  };

  

  const handleProduct1Click = (e) => {
    // Logic to fill the 1st product
    setSearch(e.target.value);

    setProduct1Filled(true);
  };

  const handleProduct2Click = (e) => {
    // Only allow clicking on the 2nd product if the 1st product is filled
    if (product1Filled) {
      setSearch2(e.target.value);
      setCatId(receivedValue.category_id);
      // Logic to fill the 2nd product
      setProduct2Filled(true);
    }
  };

  const handleProduct3Click = (e) => {
    // Only allow clicking on the 3rd product if the 2nd product is filled
    if (product2Filled) {
      setSearch3(e.target.value);
      setCatId3(receivedValue2.category_id);
    }
  };
  const handleBlur = () => {
    setTimeout(() => {
      setIsFocused1(false);
      setIsFocused2(false);
      setIsFocused3(false);
    }, 200);
  };

  return (
    <>
      <div className="compare-section">
        <div className="compare-section-img">
          <div className="up-direction-section"></div>
          <img src="/images/vs.svg" width={35} height={35} alt="" />
          <div className="middle-direction-section"></div>
          <img src="/images/vs.svg" width={35} height={35} alt="" />
          <div className="down-direction-section"></div>
        </div>
        <div className="compare-section-form">
          <div className="position-relative w-100">
           
            <Form.Control
              type="text"
              placeholder={"1st product..."}
              onChange={handleProduct1Click}
              onFocus={() => setIsFocused1(true)}
              onBlur={handleBlur}
              aria-label="Search"
              value={
                search === "" && !isFocused1 && receivedValue
                  ? receivedValue.name
                  : search
              }
            />
            {!searchValue1 && search?.length > 0 && isFocused1 && (
              <>
                <CompareSearchList
                  compareProSearchList={search}
                  compareTabType={"comparetab"}
                  isFocused={isFocused1}
                  setIsFocused={setIsFocused1}
                  onSendValue={handleChildValue}
                />
              </>
            )}
          </div>
          <div className="position-relative w-100">
            <Form.Control
              type="text"
              placeholder="2nd product..."
              onChange={handleProduct2Click}
              onFocus={() => setIsFocused2(true)}
              onBlur={handleBlur}
              aria-label="Search"
              value={search2 || ""}
              disabled={!receivedValue || search === ""}
            />
            {!searchValue2 && search2?.length > 0 && isFocused2 && (
              <>
                <CompareSearchList
                  compareProSearchListForCat={search2}
                  compareTabType={"comparetab"}
                  isFocused={isFocused2}
                  setIsFocused={setIsFocused2}
                  onSendValue2={handleChildValue2}
                  catId={catId}
                />
              </>
            )}
          </div>
          <div className="position-relative">
            <Form.Control
              type="text"
              placeholder="3rd product... (optional)"
              onChange={handleProduct3Click}
              onFocus={() => setIsFocused3(true)}
              onBlur={handleBlur}
              aria-label="Search"
              value={search3}
              disabled={!receivedValue2 || search2 === ""}
            />
            {!searchValue3 && search3?.length > 0 && isFocused3 && (
              <>
                <CompareSearchList
                  compareProSearchListForCat3={search3}
                  compareTabType={"comparetab"}
                  isFocused={isFocused3}
                  setIsFocused={setIsFocused3}
                  onSendValue3={handleChildValue3}
                  catId3={catId3}
                />
              </>
            )}
          </div>
          <Button
            className="site_main_btn"
            onClick={(e) => {
              handleComparison(e);
            }}
          >
            Compare
          </Button>
        </div>
      </div>
    </>
  );
}
