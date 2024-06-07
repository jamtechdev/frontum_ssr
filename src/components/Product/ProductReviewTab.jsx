"use client";
import React from "react";
import { Col, Container, Row, Tab, Tabs } from "react-bootstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Pagination } from "swiper/modules";
import Image from "next/image";
import Rating from "../Common/Rating/Rating";
import formatValue from "@/_helpers/formatValue";

function ProductReviewTab({ productReview }) {
  // (productReview);
  return (
    <section>
      {" "}
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
              <>
                <SwiperSlide key={index}>
                  <a
                    href={`/link?p=${btoa(data.url)}`}
                  className="user__rating-card"
                  >
                    <img
                      src={data?.logo ? data?.logo : "/images/nofound.png"}
                      alt={data?.alt}
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
              </>
            );
          })}
        {/* {blogPageType == "listPage" &&
        blogDataList &&
        blogDataList?.map(function (item, index) {
          return (
            <SwiperSlide key={index}>
              <Link
                href={`/blog${
                  item?.category_url === null && item?.category_url === ""
                    ? `/${item?.permalink}`
                    : `/${item?.category_url}/${item?.permalink}`
                }`}
                style={{ color: "#27304e" }}
              >
                <div className="blog-card">
                  <div className="blog-card-img">
                    <img
                      src={
                        item.banner_image
                          ? item.banner_image
                          : "/images/nofound.png"
                      }
                      width={0}
                      height={0}
                      sizes="100%"
                      alt=""
                    />
                    <p className="dates">{item.published_at}</p>
                  </div>
                  <span className="blog-title">{item.title}</span>
                  <p className="category">{item.category}</p>
                </div>
              </Link>
            </SwiperSlide>
          );
        })} */}
       
      </Swiper>
      {productReview?.length > 4 ? (
          <>
            <span className="swiper-prev" style={{left:"5px"}}>
              <i className="ri-arrow-left-s-line"></i>
            </span>
            <span className="swiper-next" style={{right:"5px"}}>
              <i className="ri-arrow-right-s-line"></i>
            </span>
          </>
        ) : (
          ""
        )}
    </section>
  );
}

export default ProductReviewTab;
