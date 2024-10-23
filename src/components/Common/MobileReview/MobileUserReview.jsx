"use client";
import React from "react";
import { Col, Container, Row, Tab, Tabs } from "react-bootstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Pagination } from "swiper/modules";
import Image from "next/image";
import formatValue from "@/_helpers/formatValue";
import Rating from "../Rating/Rating";

function MobileUserReview({ productReview }) {
  // (productReview?.length);
  return (
    <>
      <div className="mobile-product-slider">
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={30}
          loop={true}
          navigation={{
            nextEl: ".swiper-next",
            prevEl: ".swiper-prev",
          }}
          pagination={true}
          breakpoints={{
            320: {
              slidesPerView: 2,
              spaceBetween: 10,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 10,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 10,
            },
            1200: {
              slidesPerView: 4,
              spaceBetween: 10,
            },
          }}
        >
          {productReview &&
            productReview?.map((data, index) => {
              return (
                <React.Fragment key={index}>
                  <SwiperSlide key={index}>
                    <a
                      href={`/link?p=${btoa(data.url)}`}
                      className="user__rating-card"
                    target="_blank"
                    >
                      <img
                        src={data?.logo ? data?.logo : "/images/nofound.png"}
                      />
                      <div className="rating__count">
                        <span>{formatValue(data?.rating)}</span>
                        <Rating value={data?.rating} />
                      </div>
                      {/* {(data?.url, "neet")} */}
                      <small className="rating__review">
                        {data?.reviews} Reviews
                      </small>
                    </a>
                  </SwiperSlide>
                </React.Fragment>
              );
            })}
        </Swiper>
        {productReview?.length > 2 ? (
          <>
            <span className="swiper-prev">
              <i className="ri-arrow-left-s-line"></i>
            </span>
            <span className="swiper-next">
              <i className="ri-arrow-right-s-line"></i>
            </span>
          </>
        ) : (
          ""
        )}
      </div>
    </>
  );
}

export default MobileUserReview;
