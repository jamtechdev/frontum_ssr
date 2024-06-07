"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Pagination } from "swiper/modules";
import Image from "next/image";
import { useRouter } from "next/navigation";
import formatValue from "@/_helpers/formatValue";

export default function ComparisonsSlider({products}) {
  const router = useRouter();
  (products);
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
    (comparison) => comparison.verdict_text === null
  );
  (filteredComparisons);
  return (
    <section className="comparisons-slider">
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={30}
        loop={true}
        navigation={{
          nextEl: ".comparisons-slider .swiper-next",
          prevEl: ".comparisons-slider .swiper-prev",
        }}
        pagination={true}
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
        {filteredComparisons?.map(function (item, index) {
          return (
            <SwiperSlide key={index}>
              <div
                className="comparisons-wrapper"
                onClick={() =>
                  router.push(`/${item?.category_url}/${item?.permalink}`)
                }
                style={{ cursor: "pointer" }}
              >
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
                    <div className="footer_content">
                      <span>{item?.product_second}</span>
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
                  {/* <div className="comparisons-footer comparisons__footer__text">
                      <p>The Dyson V15 Detect is slightly better overall than the Dyson V8. The V15 has a slightly bigger dirt compartment, a surface-type adjustment feature, lasts longer on a single charge, and clears debris more effectively on all surface types. Meanwhile, the V8 is easier to pick up and carry and has fewer parts that require regular maintenance.</p>
                      <span>See Full Comparison Table</span>
                    </div> */}
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
      {filteredComparisons?.length > 3 && (
        <>
          <span className="swiper-prev">
           <i className="ri-arrow-left-s-line"></i> 
           <i className="ri-arrow-left-s-line"></i> 
          </span>
          <span className="swiper-next">
            <i className="ri-arrow-right-s-line"></i>
          </span>
        </>
      )}
    </section>
  );
}
