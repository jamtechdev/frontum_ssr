"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import Image from "next/image";
import { useRouter } from "next/navigation";
import formatValue from "@/_helpers/formatValue";
import useScreenSize from "@/_helpers/useScreenSize";

export default function HomeCompareSlider({ products, page_phase }) {
  const router = useRouter();
  const { isMobile, isSmallDevice } = useScreenSize();

  const getColorBasedOnScore = (score) => {
    if (score >= 7.5) {
      return "#093673";
    } else if (score >= 5 && score < 7.5) {
      return "#437ECE";
    } else {
      return "#85B2F1";
    }
  };

  const filteredComparisons = products?.filter(
    (comparison) => comparison.verdict_text !== null
  );

  return (
    <section className="comparisons-slider">
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={30}
        loop={true}
        navigation={{
          nextEl: ".main-comparison-next",
          prevEl: ".main-comparison-prev",
        }}
        pagination={{ clickable: true }}
        breakpoints={{
          640: {
            slidesPerView: 1,
            spaceBetween: 10,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 10,
          },
          1024: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          1200: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
        }}
        className="product-slider"
      >
        {filteredComparisons.map((item, index) => {
          const verdictText =
            item?.verdict_text.length > 400
              ? item?.verdict_text.substring(0, 400) + "..."
              : item?.verdict_text;
          return (
            <SwiperSlide key={index}>
              <div className="comparisons-wrapper">
                <div className="comparisons-container">
                  <div className="comparisons-card">
                    <img
                      src={
                        item?.product_first_image
                          ? item?.product_first_image
                          : "/images/nofound.png"
                      }
                      width={0}
                      height={0}
                      sizes="100%"
                      alt={item?.product_first}
                    />
                    {item?.product_first_overall_counted_score >
                      item?.product_second_overall_counted_score && (
                      <div className="winner__badge">{page_phase?.winner}</div>
                    )}
                    <div className="footer_content">
                      <span>{item?.product_first}</span>
                    </div>
                    <span
                      className="rating_count"
                      style={{
                        background: getColorBasedOnScore(
                          item?.product_first_overall_counted_score
                        ),
                      }}
                    >
                      {formatValue(item?.product_first_overall_counted_score)}
                    </span>
                  </div>
                  <div className="vs-divider">
                    <span>VS</span>
                  </div>
                  <div className="comparisons-card">
                    <img
                      src={
                        item?.product_second_image
                          ? item?.product_second_image
                          : "/images/nofound.png"
                      }
                      width={0}
                      height={0}
                      sizes="100%"
                      alt={item?.product_second}
                    />
                    {item?.product_second_overall_counted_score >
                      item?.product_first_overall_counted_score && (
                      <div className="winner__badge">WINNER</div>
                    )}
                    <div className="footer_content">
                      <div className="flex-container-section">
                        <span className="text-wrapper">
                          {item?.product_second}
                        </span>
                      </div>
                    </div>
                    <span
                      className="rating_count"
                      style={{
                        background: getColorBasedOnScore(
                          item?.product_second_overall_counted_score
                        ),
                      }}
                    >
                      {formatValue(item?.product_second_overall_counted_score)}
                    </span>
                  </div>
                  <div className="comparisons-footer">{item?.category}</div>
                  <div className="comparisons-footer comparisons__footer__text main__comparisons__footer">
                    <div
                      dangerouslySetInnerHTML={{ __html: verdictText }}
                    ></div>
                    <span style={{ cursor: "pointer" }}>
                      <a href={`/${item?.category_url}/${item?.permalink}`}>
                        {page_phase?.comparison_see_full}
                      </a>
                    </span>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
      {(isSmallDevice && filteredComparisons.length > 1) ||
      (isMobile && filteredComparisons.length > 2) ||
      (!isMobile && filteredComparisons.length > 3) ? (
        <>
          <span className="main-comparison-prev swiper-prev">
            <i className="ri-arrow-left-s-line"></i>
          </span>
          <span className="main-comparison-next swiper-next">
            <i className="ri-arrow-right-s-line"></i>
          </span>
        </>
      ) : null}
    </section>
  );
}
