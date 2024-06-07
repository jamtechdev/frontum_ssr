"use client";
import React from "react";
import { Col, Container, Row, Tab, Tabs } from "react-bootstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Pagination } from "swiper/modules";
import Image from "next/image";

function VideoReviews({ videoReview }) {
  // (videoReview?.length);
  return (
    <>
      <section className="product-slider review-slider-3">
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={30}
          loop={true}
          navigation={{
            nextEl: ".video_review_slider.swiper-next",
            prevEl: ".video_review_slider.swiper-prev",
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
              slidesPerView: 3,
              spaceBetween: 10,
            },
          }}
          className="video_review_slider"
        >
          {videoReview?.map((data, index) => {
            return (
              <SwiperSlide key={index}>
                <iframe
                  id="video"
                  width="100%"
                  height="250"
                  src={`${data?.url}`}
                  frameborder="0"
                  allowfullscreen
                ></iframe>
              </SwiperSlide>
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
        {videoReview?.length > 3 ? (
          <>
            <span className="video_review_slider swiper-prev">
              <i className="ri-arrow-left-s-line"></i>
            </span>
            <span className="video_review_slider swiper-next">
              <i className="ri-arrow-right-s-line"></i>
            </span>
          </>
        ) : (
          ""
        )}
      </section>
    </>
  );
}

export default VideoReviews;
