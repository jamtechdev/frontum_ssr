import {
  deleteCompareProduct,
  removeCompareProductForGuide,
  resetGuideCompareProduct,
} from "@/redux/features/compareProduct/compareProSlice";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RotatingLines } from "react-loader-spinner";
import CompareModal from "../Comparison/CompareModal";
export default function BottomBar({
  isCollapsed,
  handleToggleCollapse,
  manageCollapsedDiv,
  handleManageCollapsedDiv,
  guidePhraseData,
}) {
  const compareGuideData = useSelector(
    (state) => state.comparePro.compareProduct[0]
  );

  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const dispatch = useDispatch();
  // this function will remove item from compare list
  const removeItem = (index) => {
    // (index);
    if (index === "productFirst") {
      dispatch(deleteCompareProduct({ key: "productFirst" }));
      return;
    } else if (index === "productSecond") {
      dispatch(deleteCompareProduct({ key: "productSecond" }));
    } else if (index === "productThird") {
      dispatch(deleteCompareProduct({ key: "productThird" }));
    }
  };

  const handelComparison = () => {
    if (compareGuideData !== undefined) {
      // Here Check redux for  compare Product convert  to object to array
      const compareFilterData = Object?.values(compareGuideData)
        .slice(0, 3)
        .filter((item) => item !== null && item !== undefined);
      const permalinksArray = compareFilterData.filter(
        (product) => product && product.permalink !== ""
      );
      // Here Check redux for  compare Product convert  to object to array than make a url compare page

      const categoryInURL = permalinksArray[0].category_url;

      if (permalinksArray.length === 1) {
        setIsLoading(true);
        setTimeout(() => {
          router.push(`/${categoryInURL}/${permalinksArray[0].permalink}`);
          dispatch(resetGuideCompareProduct());
        }, 1000);
      } else {
        setIsLoading(true);
        const sortedPermalinksArray = [...permalinksArray].sort((a, b) =>
          a.permalink.localeCompare(b.permalink)
        );
        const permalinks = sortedPermalinksArray.map((item) => item.permalink);
        const permalinkSlug = permalinks.join("-vs-");
        setTimeout(() => {
          window.location.href = `/${categoryInURL}/${permalinkSlug}`;
          // router.push(`/${categoryInURL}/${permalinkSlug}`, undefined, {
          //   scroll: false,
          // });
        }, 1000);
      }
    }
  };

  return (
    <>
      {compareGuideData !== undefined &&
        Object?.values(compareGuideData)
          .slice(0, 3)
          .filter((item) => item !== null && item !== undefined)?.length >
          0 && (
          <section className="bottom_bar">
            <div
              className="bottom_bar_head"
              //  onClick={handleToggleCollapse}
              onClick={(e) => {
                handleToggleCollapse(e);
                handleManageCollapsedDiv(e);
              }}
            >
              <div className="bottom_bar_header_content">
                <img src="/images/vs.svg" width={40} height={40} alt="" />
                <div className="bottom_bar_heading">
                  <div>
                    {guidePhraseData &&
                      guidePhraseData?.page_phases?.comparison}
                  </div>
                  <span>
                    {
                      Object?.values(compareGuideData)
                        .slice(0, 3)
                        .filter((item) => item !== null && item !== undefined)
                        ?.length
                    }
                  </span>
                </div>
                {isCollapsed ? (
                  <i className="ri-arrow-up-s-line"></i>
                ) : (
                  <i className="ri-arrow-down-s-line"></i>
                )}
              </div>
            </div>
            <div
              className={
                isCollapsed === true
                  ? "bottom_bar_body bottom_bar_body_collapse"
                  : "bottom_bar_body"
              }
            >
              <ul className="bottom_bar_compare_list">
                {Object?.values(compareGuideData)
                  .slice(0, 3)
                  .filter((item) => item !== null && item !== undefined)
                  ?.map((item, index) => {
                    return (
                      <li key={index}>
                        <img
                          src={item.image ? item.image : "/images/vs.svg"}
                          width={0}
                          height={0}
                          alt=""
                        />
                        {/* {(item)} */}
                        <p>{item.name}</p>
                        <i
                          className="ri-close-fill"
                          onClick={() => removeItem(item?.delete_key)}
                          style={{ cursor: "pointer" }}
                        ></i>
                      </li>
                    );
                  })}
              </ul>
              <div className="bottom_bar_compare_list_footer">
                {Object?.values(compareGuideData)
                  .slice(0, 3)
                  .filter((item) => item !== null && item !== undefined)
                  ?.length < 3 && (
                  <span>
                    <i
                      className="ri-add-fill"
                      style={{
                        cursor:
                          Object?.values(compareGuideData)
                            .slice(0, 3)
                            .filter(
                              (item) => item !== null && item !== undefined
                            )?.length < 3
                            ? "pointer"
                            : "not-allowed",
                      }}
                      onClick={() => setIsOpen(true)}
                    ></i>
                  </span>
                )}

                <button
                  disabled={isLoading}
                  className="btn btn-primary"
                  onClick={handelComparison}
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
                  {(guidePhraseData?.page_phrases)}
                  {guidePhraseData &&
                    guidePhraseData?.page_phases?.compare_button}
                </button>
              </div>
            </div>
          </section>
        )}
      {isOpen && (
        <CompareModal
          location="ON_GUIDE"
          setIsOpen={setIsOpen}
          favSlider={guidePhraseData}
        />
      )}
    </>
  );
}
