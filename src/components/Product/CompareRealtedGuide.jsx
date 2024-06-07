import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import React from "react";
import useScreenSize from "@/_helpers/useScreenSize";

export default function CompareRealtedGuide({ favSlider, slug, indexSlider }) {
  const { isMobile } = useScreenSize();

  if (!favSlider || favSlider.length === 0) {
    return null; // Render nothing if favSlider is empty or undefined
  }

  const navigationClassPrefix = `${
    indexSlider !== undefined ? `${indexSlider}` : "d"
  }`;

  const prevButtonClass = `prev-${navigationClassPrefix}`;
  const nextButtonClass = `next-${navigationClassPrefix}`;

  return (
    <div className="product-slider m-0">
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={30}
        loop={true}
        rewind={true}
        navigation={{
          nextEl: `.${nextButtonClass}`,
          prevEl: `.${prevButtonClass}`,
        }}
        pagination={true}
        breakpoints={{
          320: { slidesPerView: 2, spaceBetween: 10 },
          768: { slidesPerView: 3, spaceBetween: 10 },
          1024: { slidesPerView: 4, spaceBetween: 20 },
          1200: { slidesPerView: 6, spaceBetween: 20 },
        }}
        className="product-slider mt-2"
      >
        {favSlider.map((section, index) => (
          <SwiperSlide key={section?.short_name + index}>
            <a
              href={`/${section?.category_url || slug}/${section?.permalink}`}
              style={{ color: "#27304e" }}
            >
              <div className="product-card">
                <img
                  src={section.bannerImage || "/images/nofound.png"}
                  width={0}
                  height={0}
                  sizes="100%"
                  alt={`/${section?.category_url || slug}/${
                    section?.permalink
                  }`}
                />
                <div className="product-name-wrapper">
                  <span>{section?.short_name || section?.guide_name}</span>
                </div>
              </div>
            </a>
          </SwiperSlide>
        ))}
      </Swiper>
      {isMobile && favSlider.length > 2 && (
        <>
          <span className={`prev-${navigationClassPrefix} swiper-prev`}>
            <i className="ri-arrow-left-s-line"></i>
          </span>
          <span className={`next-${navigationClassPrefix} swiper-next `}>
            <i className="ri-arrow-right-s-line"></i>
          </span>
        </>
      )}
      {!isMobile && favSlider.length > 6 && (
        <>
          <span className={`prev-${navigationClassPrefix} swiper-prev`}>
            <i className="ri-arrow-left-s-line"></i>
          </span>
          <span className={`next-${navigationClassPrefix} swiper-next `}>
            <i className="ri-arrow-right-s-line"></i>
          </span>
        </>
      )}

      {/* {(isMobile && favSlider.length > 2 && ()) || (!isMobile && favSlider.length > 6) && (
        <>
          <span className={`swiper-prev ${navigationClassPrefix}-prev`}><i className="ri-arrow-left-s-line"></i></span>
          <span className={`swiper-next ${navigationClassPrefix}-next`}><i className="ri-arrow-right-s-line"></i></span>
        </>
      )} */}
    </div>
  );
}
