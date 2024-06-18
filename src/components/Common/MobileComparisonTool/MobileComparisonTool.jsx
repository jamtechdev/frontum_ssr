import { useCallback, useState, useEffect } from "react";
import Image from "next/image";
import { Button, Col, Row, Table } from "react-bootstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Pagination } from "swiper/modules";
import Modal from "../Comparison/CompareModal";
import CompareModal from "../Comparison/CompareModal";
import formatValue from "@/_helpers/formatValue";
import { deleteCompareProduct } from "@/redux/features/compareProduct/compareProSlice";

export default function MobileComparisonTool({
  compareProduct,
  handelRemoveProductFormComparison,
  productPhaseData,
}) {
  const [swiperRef, setSwiperRef] = useState();

  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      swiperRef?.slidePrev();
    }
  }, [swiperRef, currentIndex]);

  const handleNext = useCallback(() => {
    if (currentIndex < comparisonProductData.length - 1) {
      setCurrentIndex(currentIndex + 1);
      swiperRef?.slideNext();
    }
  }, [swiperRef, currentIndex]);

  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);
  // This funcation rmeove undefined and empty object
  let comparisonProductData = compareProduct.filter(
    (item) =>
      item !== "" &&
      typeof item !== "undefined" &&
      Object.keys(item).length !== 0
  );
  // (comparisonProductData?.length);
  const highestScore = Math.max(
    ...comparisonProductData.map((item) => item.overall_score)
  );

  const handelRemoveProduct = (index) => {
    handelRemoveProductFormComparison(index);
  };

  const urlChange = (i) => {
    let x = window.location.pathname.split("/")[2].split("-vs-");
    // Create a new array without the element at the specified index
    const newArray = [...x.slice(0, i), ...x.slice(i + 1)];
    if (newArray.length > 1) {
      let newUrl = newArray.join("-vs-");
      let path = `${window.location.origin}/${
        window.location.pathname.split("/")[1]
      }/${newUrl}`;
      window.location.href = path;
    }

    newArray.length <= 1 && handelRemoveProduct(i);
  };

  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const findProductsScoreLabelIndex = (products) => {
    if (products.length === 0) {
      return "";
    }
    const maxScore = Math.max(...products.map((obj) => obj?.overall_score));
    const winningProductIndex = products
      .map((obj, index) =>
        obj?.overall_score === maxScore ? index : undefined
      )
      .filter((index) => index !== undefined);
    return winningProductIndex.length === 1 ? winningProductIndex[0] : -1000;
  };

  const productScoreLabelIndex = findProductsScoreLabelIndex(
    comparisonProductData
  );
  console.log(productScoreLabelIndex);

  return (
    <>
      <div className="comparison-tool mobile-comparison-tool">
        <Swiper
          modules={[Navigation, Pagination]}
          // spaceBetween={30}
          // loop={true}
          onSwiper={setSwiperRef}
          breakpoints={{
            320: {
              slidesPerView: 2,
              spaceBetween: 50,
            },
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 80,
            },
            1024: {
              slidesPerView: 2,
              spaceBetween: 80,
            },
            1200: {
              slidesPerView: 2,
              spaceBetween: 80,
            },
          }}
        >
          {comparisonProductData &&
            comparisonProductData?.map((item, index) => {
              const isWinner = item.overall_score === highestScore;

              return (
                <SwiperSlide key={index}>
                  <div className="comparison-wrapper">
                    {productScoreLabelIndex !== "" &&
                      productScoreLabelIndex === index && (
                        <div className="comparison-tag">
                          {productPhaseData && productPhaseData?.page_phases?.winner}
                        </div>
                      )}
                    {/* {isWinner && (
                      <div className="comparison-tag">
                        {productPhaseData?.page_phases?.winner}
                      </div>
                    )} */}

                    {productScoreLabelIndex === -1000 && index === 0 && (
                      <div className="comparison-tag text-center">
                        {productPhaseData && productPhaseData?.page_phases?.draw_text}
                      </div>
                    )}
                    {/* {(item)} */}
                    <div className="comparison-card">
                      <img
                        src={
                          item?.main_image
                            ? item?.main_image
                            : "/images/nofound.png"
                        }
                        width={0}
                        height={0}
                        alt=""
                        sizes="100%"
                      />
                      <div className="comparison-card-footer">
                        <p>{item?.name}</p>
                      </div>
                      <span
                        className="count"
                        style={{
                          background:
                            item.overall_score >= 7.5
                              ? "#093673"
                              : item.overall_score >= 5 &&
                                item.overall_score < 7.5
                              ? "#437ECE"
                              : "#85B2F1",
                        }}
                      >
                        {formatValue(item?.overall_score)}
                      </span>
                      <span
                        className="mobile-close_icon"
                        style={{ cursor: "pointer" }}
                        onClick={() => urlChange(index)}
                      >
                        <i className="ri-close-line"></i>{" "}
                        {productPhaseData?.page_phases?.remove_product_text}
                      </span>
                    </div>
                    {item?.price_websites?.length > 0 ? (
                      <>
                        <div className="comparison-product-item">
                          <img
                            src={
                              item?.price_websites[0]?.price != null &&
                              item?.price_websites[0]?.logo === null
                                ? "/images/No-Image.png"
                                : item?.price_websites[0]?.logo
                            }
                            width={0}
                            height={0}
                            sizes="100%"
                            alt="price"
                          />
                          {item?.price_websites[0]?.price != null && (
                            <span>
                              {" "}
                              <a
                                href={`/link?p=${btoa(
                                  item?.price_websites[0]?.url
                                )}`}
                                style={{ color: "#fff" }}
                              >
                                {" "}
                                {item?.price_websites[0]?.price}{" "}
                                {item?.currency}{" "}
                              </a>
                            </span>
                          )}
                        </div>
                        {/* <div className="comparison-product-item">
                          <img
                            src={
                              item?.price_websites[1]?.logo === null
                                ? "/images/No-Image.png"
                                : item?.price_websites[1]?.logo
                            }
                            width={0}
                            height={0}
                            sizes="100%"
                            alt="price"
                          />
                          {item?.price_websites[1]?.price != null && (
                            <span>{item?.price_websites[1]?.price} €</span>
                          )}
                        </div> */}
                      </>
                    ) : (
                      <>
                        <div className="not-availabel">
                          {/* <span className="txt">NOT AVAILABLE</span> */}
                          <i>N/A</i>
                          <span className="price">
                            ~ {item?.price} {item?.currency}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </SwiperSlide>
              );
            })}
        </Swiper>
        {comparisonProductData && comparisonProductData?.length > 2 && (
          <>
            {currentIndex === 0 ? (
              <span
                className="swiper-next"
                onClick={handleNext}
                style={{ marginLeft: "88vw" }}
              >
                <i className="ri-arrow-right-s-line"></i>
              </span>
            ) : (
              <span className="swiper-prev" onClick={handlePrevious}>
                <i className="ri-arrow-left-s-line"></i>
              </span>
            )}
          </>
        )}
      </div>
      <Row>
        <Col md={12} className="text-center mb-3">
          <Button className="site_main_btn" onClick={() => setIsOpen(true)}>
            {productPhaseData &&
              productPhaseData?.page_phases?.add_product_text}
          </Button>
        </Col>
      </Row>
      {isOpen && (
        <CompareModal
          setIsOpen={setIsOpen}
          location={""}
          favSlider={productPhaseData}
        />
      )}
    </>
  );
}
