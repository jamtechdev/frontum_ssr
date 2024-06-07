"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Pagination } from "swiper/modules";
import Image from "next/image";
import { useCallback, useState } from "react";
import Tested from "../Tested/Tested";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

export default function ThumbSlider({ productData, is_tested, slug }) {
  // (slug)
  const product = [
    {
      image: "/images/nofound.png",
    },
    {
      image: "/images/nofound.png",
    },
    {
      image: "/images/nofound.png",
    },
    {
      image: "/images/nofound.png",
    },
  ];
  const [swiper, setSwiper] = useState(null);
  const [activeThumb, setActiveThumb] = useState(0);
  const [modalShow, setModalShow] = useState(false);

  const setSwiperRef = (swiper) => {
    setSwiper(swiper);
  };
  // (activeThumb);
  const handleThumbClick = (index) => {
    if (index === productData?.all_images?.length - 1) {
      setActiveThumb(0); // Reset activeThumb to 0
    } else {
      setActiveThumb(index);
    }
    if (swiper) {
      swiper.slideTo(index); // Navigate to the clicked thumbnail's corresponding slide
    }
  };

  const handlePrevious = () => {
    if (swiper) {
      swiper.slidePrev();
      setActiveThumb(activeThumb - 1);
    }
  };

  const handleNext = () => {
    // (activeThumb);
    if (activeThumb === productData?.all_images?.length - 1) {
      setActiveThumb(0); // Reset activeThumb to 0
    } else {
      setActiveThumb(activeThumb + 1);
    }
    if (swiper) {
      swiper.slideNext();
    }
  };
  // show main image into modal
  const [ImageModal, setImageModal] = useState("");

  const handleImageModal = (image) => {
    setImageModal(image);
    setModalShow(true);
  };

  const showArrows = productData?.all_images?.length > 1;

  return (
    <section className="thumb-section-container">
      {productData?.main_image === null ? (
        <>
          <ul className="thumb-images">
            {product.slice(0, 1)?.map((item, index) => (
              <li
                key={index}
                onClick={() => handleThumbClick(index)}
                className={index === activeThumb ? "active" : ""}
                style={{ cursor: "pointer" }}
              >
                <img
                  src={item.image}
                  width={0}
                  height={0}
                  sizes="100%"
                  alt={`${slug}`}
                />
              </li>
            ))}
          </ul>
        </>
      ) : (
        <ul className="thumb-images">
          {productData &&
            productData?.all_images?.map((item, index) => (
              <li
                key={index}
                onClick={() => handleThumbClick(index)}
                className={index === activeThumb ? "active" : ""}
                style={{ cursor: "pointer" }}
              >
                <img
                  src={item.image}
                  width={0}
                  height={0}
                  sizes="100%"
                  alt={`${slug}`}
                />
              </li>
            ))}
        </ul>
      )}

      <section className="thumb-slider">
        {is_tested && (
          <div className="product-page-tested">
            <Tested />
          </div>
        )}

        {productData?.main_image === null ? (
          <>
            <Swiper
              modules={[Navigation]}
              spaceBetween={30}
              loop={true}
              onSwiper={setSwiperRef}
              breakpoints={{
                640: {
                  slidesPerView: 1,
                  spaceBetween: 10,
                },
                768: {
                  slidesPerView: 1,
                  spaceBetween: 10,
                },
                1024: {
                  slidesPerView: 1,
                  spaceBetween: 20,
                },
              }}
            >
              {product.map((item, index) => (
                <SwiperSlide key={index} >
                  <img
                    src={item.image}
                    width={0}
                    height={0}
                    sizes="100%"
                    alt={`${slug}`}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </>
        ) : (
          <Swiper
            modules={[Navigation]}
            spaceBetween={30}
            loop={true}
            onSwiper={setSwiperRef}
            breakpoints={{
              640: {
                slidesPerView: 1,
                spaceBetween: 10,
              },
              768: {
                slidesPerView: 1,
                spaceBetween: 10,
              },
              1024: {
                slidesPerView: 1,
                spaceBetween: 20,
              },
            }}
          >
            {productData?.all_images?.map((item, index) => (
              <SwiperSlide
                key={index}
                onClick={() => handleImageModal(item.image)}
                style={{ cursor: "pointer" }}
              >
                <img
                  src={item.image}
                  width={0}
                  height={0}
                  sizes="100%"
                  alt={`${slug}`}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        )}

{showArrows && (
          <>
            <span className="swiper-prev" onClick={handlePrevious}>
              <i className="ri-arrow-left-s-line"></i>
            </span>
            <span className="swiper-next" onClick={handleNext}>
              <i className="ri-arrow-right-s-line"></i>
            </span>
          </>
        )}
      </section>

      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={modalShow}
        onHide={() => setModalShow(false)}
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <img
            src={ImageModal}
            width={0}
            height={0}
            sizes="100%"
            alt={`${slug}`}
            style={{
              width: "50%",
              height: "auto",
              margin: "auto",
              display: "block",
            }}
          />
        </Modal.Body>
      </Modal>
    </section>
  );
}
