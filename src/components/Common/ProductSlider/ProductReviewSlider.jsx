"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Pagination } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";
import useScreenSize from "@/_helpers/useScreenSize";
import React from "react";
function ProductReviewSlider({ favSlider }) {
  const formatValue = (value) => {
    if (value % 1 === 0 && value !== 10) {
      return `${value}.0`;
    }
    return value;
  };
  const { isMobile } = useScreenSize();

  return (
    <>
      <section className={`review-slider`}>
        <Swiper
          slidesPerView={6}
          modules={[Navigation, Pagination]}
          spaceBetween={30}
          loop={true}
          onSwiper={(swiper) => {}}
          navigation={{
            nextEl: `.swiper-next`,
            prevEl: `.swiper-prev`,
          }}
          pagination={favSlider?.length > 1 ? true : false}
          breakpoints={{
            320: {
              slidesPerView: 2,
              spaceBetween: 10,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 10,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
            1200: {
              slidesPerView: 6,
              spaceBetween: 20,
            },
          }}
          className={`product-slider`}
        >
          {/* Slides */}
          {favSlider?.map((item, index) => {
            const url = item?.category?.replace(/\s+/g, "-").toLowerCase();
            return (
              <SwiperSlide key={index}>
                <a href={`/${url}/${item?.permalink}`}>
                  <div className="review-wrapper">
                    <div className="review-card">
                      <img
                        src={item?.mini_image || "/images/nofound.png"}
                        width={60}
                        height={60}
                        sizes="100%"
                        alt={`${item?.permalink}`}
                      />
                      <div className="footer_content">
                        <div className="flex-container-section">
                          <span className="text-wrapper">{item?.name}</span>
                        </div>
                        <p>{item?.category}</p>
                      </div>
                      <span
                        className="rating_count"
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
                    </div>
                  </div>
                </a>
              </SwiperSlide>
            );
          })}
        </Swiper>
        {isMobile
          ? favSlider?.length > 2 && (
              <>
                <span className="swiper-prev">
                  <i className="ri-arrow-left-s-line"></i>
                </span>
                <span className="swiper-next">
                  <i className="ri-arrow-right-s-line"></i>
                </span>
              </>
            )
          : favSlider?.length > 6 && (
              <>
                <span className="swiper-prev">
                  <i className="ri-arrow-left-s-line"></i>
                </span>
                <span className="swiper-next">
                  <i className="ri-arrow-right-s-line"></i>
                </span>
              </>
            )}
      </section>
    </>
  );
}

export default ProductReviewSlider;
